import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { getTieredSignedUrl, getCacheHeaders } from '@/lib/storage';

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


    const formattedJourneys = await Promise.all(journeys.map(async (journey: { 
      id: string, 
      recipientName: string, 
      status: string, 
      uniqueSlug: string | null, 
      createdAt: Date,
      _count: { analytics: number },
      photos: { imageUrl: string }[] 
    }) => {
      let firstPhotoUrl = journey.photos[0]?.imageUrl || null;

      if (firstPhotoUrl) {
        firstPhotoUrl = await getTieredSignedUrl(firstPhotoUrl, journey.status);
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


    // For the list view, we use private caching to ensure users always see their latest drafts
    // but published ones can still benefit from 5m revalidation
    const cacheHeaders = {
      'Cache-Control': 'private, max-age=300, must-revalidate',
      'X-Cache-Status': 'private-list'
    };

    return NextResponse.json({
      success: true,
      journeys: formattedJourneys
    }, {
      headers: cacheHeaders as HeadersInit
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

    // Rate Limiting
    const { createJourneyLimit, getRateLimitHeaders, formatTimeRemaining } = await import('@/lib/rate-limit');
    const userId = session!.user!.id;
    const { success, limit, remaining, reset } = await createJourneyLimit.limit(userId);
    const rlHeaders = getRateLimitHeaders(limit, remaining, reset);

    if (!success) {
      return NextResponse.json(
        { 
          success: false, 
          error: { 
            code: 'RATE_LIMIT_EXCEEDED', 
            message: `You've reached your journey creation limit. Please try again in ${formatTimeRemaining(reset)}.` 
          } 
        },
        { status: 429, headers: rlHeaders }
      );
    }

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
