import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

import { GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Client } from '@/lib/s3';

// GET /api/v1/journeys - List user's journeys
export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const journeys = await prisma.journey.findMany({
      where: {
        creatorId: session!.user!.id,
        deletedAt: null
      },
      include: {
        _count: {
          select: {
            analytics: {
              where: { eventType: 'viewed' }
            }
          }
        },
        photos: {
          orderBy: { photoOrder: 'asc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    });


    const formattedJourneys = await Promise.all(journeys.map(async (journey: any) => {
      let firstPhotoUrl = journey.photos[0]?.imageUrl || null;

      if (firstPhotoUrl && (firstPhotoUrl.includes('/storage/v1/object/public/') || firstPhotoUrl.includes('/storage/v1/s3/'))) {
        try {
          const urlObj = new URL(firstPhotoUrl);
          let bucket = '';
          let key = '';

          if (firstPhotoUrl.includes('/storage/v1/object/public/')) {
            const parts = urlObj.pathname.split('/public/');
            if (parts.length > 1) {
              const fullPath = parts[1];
              const pathParts = fullPath.split('/');
              bucket = pathParts[0];
              key = pathParts.slice(1).join('/');
            }
          } else {
            const s3Match = firstPhotoUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
            if (s3Match) {
              bucket = s3Match[1];
              key = s3Match[2];
            }
          }

          if (bucket && key) {
            const command = new GetObjectCommand({ Bucket: bucket, Key: key });
            firstPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 1800 });
          }
        } catch (e) {
          console.error('[Journeys List] Failed to sign photo URL:', e);
        }
      }

      return {
        id: journey.id,
        recipientName: journey.recipientName,
        status: journey.status,
        uniqueSlug: journey.uniqueSlug,
        createdAt: journey.createdAt.toISOString(),
        viewCount: journey._count.analytics,
        firstPhotoUrl
      };
    }));


    return NextResponse.json({
      success: true,
      journeys: formattedJourneys
    });
  } catch (error) {
    console.error('Error fetching journeys:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch journeys'
        }
      },
      { status: 500 }
    );
  }
}

// POST /api/v1/journeys - Create new journey
export async function POST(request: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const { recipientName, creatorName, occasionType = 'valentine', templateId, turnstileToken } = body;

    // Verify Turnstile
    if (!turnstileToken) {
      console.warn('[SECURITY] Journey creation without Turnstile token');
      return NextResponse.json(
        { success: false, error: { code: 'TURNSTILE_REQUIRED', message: 'Verification required' } },
        { status: 400 }
      );
    }

    const { verifyTurnstileToken, getClientIP } = await import('@/lib/turnstile');
    const clientIP = getClientIP(request);
    const verification = await verifyTurnstileToken(turnstileToken, clientIP);

    if (!verification.success) {
      return NextResponse.json(
        { success: false, error: { code: 'TURNSTILE_FAILED', message: verification.error || 'Verification failed' } },
        { status: 400 }
      );
    }

    if (!recipientName) {
      return NextResponse.json(
        {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Recipient name is required' }
        },
        { status: 422 }
      );
    }

    // Generate temporary unique slug for draft (will be replaced on publish)
    const draftSlug = `draft-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;

    const journey = await prisma.journey.create({
      data: {
        creatorId: session!.user!.id,
        recipientName,
        creatorName: creatorName || session!.user!.name || 'Someone special',
        occasionType,
        status: 'draft',
        uniqueSlug: draftSlug,
        templateId: templateId || null
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: {
          id: journey.id,
          status: journey.status,
          occasionType: journey.occasionType,
          recipientName: journey.recipientName,
          creatorName: journey.creatorName,
          createdAt: journey.createdAt.toISOString()
        }
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating journey:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to create journey'
        }
      },
      { status: 500 }
    );
  }
}
