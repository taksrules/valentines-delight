import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

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
      data: { deletedAt: new Date() }
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

    // Generate signed URLs for photos (following audio pattern)
    const { GetObjectCommand } = await import('@aws-sdk/client-s3');
    const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
    const { s3Client } = await import('@/lib/s3');

    const photosWithSignedUrls = await Promise.all(
      journey.photos.map(async (photo) => {
        let signedUrl = photo.imageUrl;

        // If it's a Supabase Storage URL, generate signed URL
        if (photo.imageUrl.includes('/storage/v1/object/public/')) {
          try {
            const urlObj = new URL(photo.imageUrl);
            const parts = urlObj.pathname.split('/public/');

            if (parts.length > 1) {
              const fullPath = parts[1]; // "journey-photos/userId/filename.jpg"
              const pathParts = fullPath.split('/');
              const bucket = pathParts[0]; // "journey-photos"
              const key = pathParts.slice(1).join('/'); // "userId/filename.jpg"

              if (bucket && key) {
                const command = new GetObjectCommand({ Bucket: bucket, Key: key });
                signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 }); // 1 hour
              }
            }
          } catch (e) {
            console.error('[GET journey] Failed to sign photo URL:', e);
            // Keep original URL as fallback
          }
        }
        // Handle already-signed S3 URLs or direct storage paths
        else if (photo.imageUrl.includes('/storage/v1/s3/')) {
          try {
            const s3Match = photo.imageUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
            if (s3Match) {
              const bucket = s3Match[1];
              const key = s3Match[2];
              
              const command = new GetObjectCommand({ Bucket: bucket, Key: key });
              signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            }
          } catch (e) {
            console.error('[GET journey] Failed to re-sign S3 URL:', e);
          }
        }

        return {
          ...photo,
          imageUrl: signedUrl,
        };
      })
    );

    // Sign successPhotoUrl if present
    let signedSuccessPhotoUrl = journey.successPhotoUrl;
    if (journey.successPhotoUrl && (journey.successPhotoUrl.includes('/storage/v1/object/public/') || journey.successPhotoUrl.includes('/storage/v1/s3/'))) {
      try {
        const urlObj = new URL(journey.successPhotoUrl);
        let bucket = '';
        let key = '';

        if (journey.successPhotoUrl.includes('/storage/v1/object/public/')) {
          const parts = urlObj.pathname.split('/public/');
          if (parts.length > 1) {
            const fullPath = parts[1];
            const pathParts = fullPath.split('/');
            bucket = pathParts[0];
            key = pathParts.slice(1).join('/');
          }
        } else {
          const s3Match = journey.successPhotoUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
          if (s3Match) {
            bucket = s3Match[1];
            key = s3Match[2];
          }
        }

        if (bucket && key) {
          const { GetObjectCommand } = await import('@aws-sdk/client-s3');
          const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
          const { s3Client } = await import('@/lib/s3');
          const command = new GetObjectCommand({ Bucket: bucket, Key: key });
          signedSuccessPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        }
      } catch (e) {
        console.error('[GET journey] Failed to sign success photo URL:', e);
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        ...journey,
        photos: photosWithSignedUrls,
        successPhotoUrl: signedSuccessPhotoUrl,
      }
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
