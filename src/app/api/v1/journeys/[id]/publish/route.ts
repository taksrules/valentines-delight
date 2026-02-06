import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// POST /api/v1/journeys/[id]/publish - Publish journey
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const journey = await prisma.journey.findUnique({
      where: { id },
      include: {
        questions: true,
        photos: true,
      }
    });

    if (!journey) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Journey not found' } },
        { status: 404 }
      );
    }

    if (journey.creatorId !== session!.user!.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } },
        { status: 403 }
      );
    }

    // Quota Enforcement
    const { getQuotaForTier } = await import('@/lib/quotas');
    const user = await prisma.user.findUnique({
      where: { id: session!.user!.id },
      select: { subscriptionTier: true }
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: { code: 'USER_NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      );
    }

    const quota = getQuotaForTier(user.subscriptionTier);

    if (quota.publishedJourneys !== -1) {
      const publishedCount = await prisma.journey.count({
        where: {
          creatorId: session!.user!.id,
          status: 'published',
          deletedAt: null,
          NOT: { id: journey.id } // Don't count the current journey if it's already published
        }
      });

      if (publishedCount >= quota.publishedJourneys) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'QUOTA_EXCEEDED',
              message: `You've reached the ${user.subscriptionTier} tier limit of ${quota.publishedJourneys} published journey. Please upgrade to create more magic.`
            }
          },
          { status: 403 }
        );
      }
    }

    // Validate journey is complete
    if (!journey.recipientName) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Recipient name is required' } },
        { status: 422 }
      );
    }

    if (journey.questions.length !== 4) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Exactly 4 questions required' } },
        { status: 422 }
      );
    }

    if (journey.photos.length < 4 || journey.photos.length > 6) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: '4-6 photos required' } },
        { status: 422 }
      );
    }

    // Generate unique slug
    const slug = await generateUniqueSlug(journey.recipientName, journey.occasionType);

    // Select a random curated music track based on mood
    const mood = journey.musicMood || 'romantic';
    const curatedTracks = await prisma.musicTrack.findMany({
      where: { mood }
    });
    
    let selectedTrackId = journey.musicTrackId;
    
    if (curatedTracks.length > 0 && !journey.musicTrackId) {
      const randomTrack = curatedTracks[Math.floor(Math.random() * curatedTracks.length)];
      selectedTrackId = randomTrack.id;
    }

    // Publish journey
    const published = await prisma.journey.update({
      where: { id },
      data: {
        status: 'published',
        uniqueSlug: slug,
        referralCode: journey.referralCode || (await generateReferralCode()),
        musicTrackId: selectedTrackId,
        publishedAt: new Date(),
      }
    });

    return NextResponse.json({
      success: true,
      slug: published.uniqueSlug,
      message: 'Journey published successfully'
    });
  } catch (error) {
    console.error('Error publishing journey:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to publish journey'
        }
      },
      { status: 500 }
    );
  }
}

// Helper function to generate unique slug
async function generateUniqueSlug(recipientName: string, occasionType: string): Promise<string> {
  const baseName = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  
  const occasion = occasionType.substring(0, 3); // 'val', 'pro', etc.
  
  // Try to find a unique slug
  for (let i = 0; i < 10; i++) {
    const random = Math.random().toString(36).substring(2, 6);
    const slug = `${baseName}-${occasion}-${random}`;
    
    const existing = await prisma.journey.findUnique({
      where: { uniqueSlug: slug }
    });
    
    if (!existing) {
      return slug;
    }
  }
  
  // Fallback with timestamp
  const timestamp = Date.now().toString(36);
  return `${baseName}-${occasion}-${timestamp}`;
}

// Helper function to generate 8-char alphanumeric referral code
async function generateReferralCode(): Promise<string> {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  // Try 5 times to get a unique code
  for (let attempt = 0; attempt < 5; attempt++) {
    result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    const existing = await prisma.journey.findUnique({
      where: { referralCode: result }
    });
    
    if (!existing) return result;
  }
  
  // Fallback with timestamp short version if multiple collisions
  return Date.now().toString(36).substring(0, 8);
}
