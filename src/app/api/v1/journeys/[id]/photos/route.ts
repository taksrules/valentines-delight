import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// POST /api/v1/journeys/[id]/photos - Add photo to journey
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
      include: { photos: true }
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

    if (journey.photos.length >= 6) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Maximum 6 photos allowed' } },
        { status: 422 }
      );
    }

    const body = await request.json();
    const { imageUrl, caption, photoOrder } = body;

    if (!imageUrl) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Image URL is required' } },
        { status: 422 }
      );
    }

    const photo = await prisma.journeyPhoto.create({
      data: {
        journeyId: id,
        imageUrl,
        caption: caption || '',
        photoOrder: photoOrder || journey.photos.length + 1,
      }
    });

    return NextResponse.json({
      success: true,
      data: photo
    });
  } catch (error) {
    console.error('Error adding photo:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to add photo'
        }
      },
      { status: 500 }
    );
  }
}

// DELETE /api/v1/journeys/[id]/photos - Remove all photos (for batch update)
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

    if (journey.creatorId !== session!.user!.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } },
        { status: 403 }
      );
    }

    await prisma.journeyPhoto.deleteMany({
      where: { journeyId: id }
    });

    return NextResponse.json({
      success: true,
      message: 'Photos deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting photos:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to delete photos'
        }
      },
      { status: 500 }
    );
  }
}
