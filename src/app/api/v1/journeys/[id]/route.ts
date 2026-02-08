import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { getTieredSignedUrl, getCacheHeaders } from '@/lib/storage';

// DELETE /api/v1/journeys/[id] - Soft delete journey
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const journey = await prisma.journey.findUnique({
      where: { id }
    });

    if (!journey) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Journey not found' } },
        { status: 404 }
      );
    }

    if (journey.creatorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to delete this journey' } },
        { status: 403 }
      );
    }

    await prisma.journey.update({
      where: { id },
      data: { 
        deletedAt: new Date(),
        status: 'deleted' // Explicitly mark for hard-delete pipeline
      }
    });

    return NextResponse.json({
      success: true,
      message: 'Journey deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting journey:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete journey'
        }
      },
      { status: 500 }
    );
  }
}

// GET /api/v1/journeys/[id] - Get journey details
export async function GET(
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
        questions: {
          orderBy: { questionOrder: 'asc' }
        },
        photos: {
          orderBy: { photoOrder: 'asc' }
        }
      }
    });

    if (!journey) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Journey not found' } },
        { status: 404 }
      );
    }

    if (journey.creatorId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized to view this journey' } },
        { status: 403 }
      );
    }

    const photosWithSignedUrls = await Promise.all(
      journey.photos.map(async (photo: any) => {
        const signedUrl = await getTieredSignedUrl(photo.imageUrl, journey.status);
        return {
          ...photo,
          imageUrl: signedUrl,
        };
      })
    );

    // Sign successPhotoUrl if present
    let signedSuccessPhotoUrl = journey.successPhotoUrl;
    if (journey.successPhotoUrl) {
      signedSuccessPhotoUrl = await getTieredSignedUrl(journey.successPhotoUrl, journey.status);
    }

    // Get appropriate cache headers
    const cacheHeaders = getCacheHeaders(journey.status);

    return NextResponse.json({
      success: true,
      data: {
        ...journey,
        photos: photosWithSignedUrls,
        successPhotoUrl: signedSuccessPhotoUrl,
      }
    }, {
      headers: cacheHeaders as HeadersInit
    });
  } catch (error) {
    console.error('Error fetching journey:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to fetch journey'
        }
      },
      { status: 500 }
    );
  }
}

// PATCH /api/v1/journeys/[id] - Update journey
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const journey = await prisma.journey.findUnique({
      where: { id }
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

    const body = await request.json();
    const { recipientName, creatorName, occasionType, musicEnabled, musicMood, successPhotoUrl, allowSharing } = body;

    const updated = await prisma.journey.update({
      where: { id },
      data: {
        ...(recipientName && { recipientName }),
        ...(creatorName !== undefined && { creatorName }),
        ...(occasionType && { occasionType }),
        ...(musicEnabled !== undefined && { musicEnabled }),
        ...(musicMood && { musicMood }),
        ...(successPhotoUrl !== undefined && { successPhotoUrl }),
        ...(allowSharing !== undefined && { allowSharing }),
      }
    });

    return NextResponse.json({
      success: true,
      data: updated
    });
  } catch (error) {
    console.error('Error updating journey:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to update journey'
        }
      },
      { status: 500 }
    );
  }
}
