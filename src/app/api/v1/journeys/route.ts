import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// GET /api/v1/journeys - List user's journeys
export async function GET() {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const journeys = await prisma.journey.findMany({
      where: {
        creatorId: session.user.id,
        deletedAt: null
      },
      include: {
        photos: {
          orderBy: { photoOrder: 'asc' },
          take: 1
        },
        _count: {
          select: {
            analytics: {
              where: { eventType: 'viewed' }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    // Generate signed URLs for first photos
    const { GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const { s3Client } = await import('@/lib/s3');

    const formattedJourneys = await Promise.all(journeys.map(async (journey) => {
      let firstPhotoUrl = journey.photos[0]?.imageUrl || null;

      if (firstPhotoUrl && firstPhotoUrl.includes('/storage/v1/object/public/')) {
        try {
          const urlObj = new URL(firstPhotoUrl);
          const parts = urlObj.pathname.split('/public/');

          if (parts.length > 1) {
            const fullPath = parts[1];
            const pathParts = fullPath.split('/');
            const bucket = pathParts[0];
            const key = pathParts.slice(1).join('/');

            if (bucket && key) {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key });
              firstPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            }
          }
        } catch (e) {
          console.error('[Journeys List] Failed to sign photo URL:', e);
        }
      }
      // Handle already-signed S3 URLs or direct storage paths
      else if (firstPhotoUrl && firstPhotoUrl.includes('/storage/v1/s3/')) {
        try {
            const s3Match = firstPhotoUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
            if (s3Match) {
              const bucket = s3Match[1];
              const key = s3Match[2];
              
              const command = new GetObjectCommand({ Bucket: bucket, Key: key });
              firstPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            }
          } catch (e) {
            console.error('[Journeys List] Failed to re-sign S3 URL:', e);
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
    const { recipientName, creatorName, occasionType = 'valentine', templateId } = body;

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
