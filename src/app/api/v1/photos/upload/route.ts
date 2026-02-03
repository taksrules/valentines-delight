import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { s3Client, JOURNEY_PHOTOS_BUCKET } from '@/lib/s3';
import { PutObjectCommand } from '@aws-sdk/client-s3';

// POST /api/v1/photos/upload - Upload photo to Supabase Storage
export async function POST(request: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'No file provided' } },
        { status: 422 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' } },
        { status: 422 }
      );
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'File too large. Maximum size is 5MB' } },
        { status: 422 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 10);
    const extension = file.name.split('.').pop() || 'jpg';
    const filename = `${session!.user!.id}/${timestamp}-${randomString}.${extension}`;

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Upload to Supabase Storage via S3
    await s3Client.send(
      new PutObjectCommand({
        Bucket: JOURNEY_PHOTOS_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: file.type,
        Metadata: {
          userId: session!.user!.id,
          originalName: file.name,
        },
      })
    );

    // Generate public URL
    const publicUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/${JOURNEY_PHOTOS_BUCKET}/${filename}`;

    return NextResponse.json({
      success: true,
      data: {
        url: publicUrl,
        filename,
        size: file.size,
        type: file.type,
      }
    });
  } catch (error) {
    console.error('Error uploading photo:', error);
    
    // Log more details for debugging
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : '';
    console.error('Error details:', { errorMessage, errorStack });
    
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: `Failed to upload photo: ${errorMessage}`
        }
      },
      { status: 500 }
    );
  }
}
