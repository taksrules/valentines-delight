import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { s3Client, JOURNEY_PHOTOS_BUCKET } from '@/lib/s3';
import { DeleteObjectsCommand } from '@aws-sdk/client-s3';

/**
 * CLEANUP PIPELINE: Hard delete journeys and assets after 24 hours.
 * 
 * Logic:
 * 1. Find journeys where status = 'deleted' AND deletedAt < (now - 24h)
 * 2. Delete all photos from Supabase Storage (S3)
 * 3. Delete database records (cascading will handle photos, analytics, etc.)
 */
export async function POST(request: Request) {
  // 🛡️ Security: Protect with a secret key
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // 1. Find journeys to purge
    const journeysToPurge = await prisma.journey.findMany({
      where: {
        status: 'deleted',
        deletedAt: {
          lt: twentyFourHoursAgo
        }
      },
      include: {
        photos: true
      }
    });

    if (journeysToPurge.length === 0) {
      return NextResponse.json({ message: 'No journeys to purge' });
    }

    const results = [];

    for (const journey of journeysToPurge) {
      try {
        // 2. Delete photos from storage
        const photoKeys = journey.photos
          .map((photo: any) => {
            const urlObj = new URL(photo.imageUrl);
            // Public URL: /storage/v1/object/public/journey-photos/userId/filename
            if (photo.imageUrl.includes('/public/')) {
              const parts = urlObj.pathname.split('/public/');
              if (parts.length > 1) {
                const fullPath = parts[1];
                return fullPath.split('/').slice(1).join('/'); // userId/filename
              }
            }
            // S3 URL: /storage/v1/s3/bucket/key
            else if (photo.imageUrl.includes('/s3/')) {
              const s3Match = photo.imageUrl.match(/\/s3\/[^/]+\/(.+?)(?:\?|$)/);
              return s3Match?.[1];
            }
            return null;
          })
          .filter((key: any): key is string => !!key);

        if (photoKeys.length > 0) {
          await s3Client.send(new DeleteObjectsCommand({
            Bucket: JOURNEY_PHOTOS_BUCKET,
            Delete: {
              Objects: photoKeys.map((Key: string) => ({ Key }))
            }
          }));
          console.log(`[Cleanup] Deleted ${photoKeys.length} photos for journey ${journey.id}`);
        }

        // 3. Delete success photo if present
        if (journey.successPhotoUrl) {
          const successUrlObj = new URL(journey.successPhotoUrl);
          let successKey = null;
          if (journey.successPhotoUrl.includes('/public/')) {
            const parts = successUrlObj.pathname.split('/public/');
            if (parts.length > 1) {
              const fullPath = parts[1];
              successKey = fullPath.split('/').slice(1).join('/');
            }
          } else if (journey.successPhotoUrl.includes('/s3/')) {
            const s3Match = journey.successPhotoUrl.match(/\/s3\/[^/]+\/(.+?)(?:\?|$)/);
            successKey = s3Match?.[1];
          }

          if (successKey) {
            const { DeleteObjectCommand } = await import('@aws-sdk/client-s3');
            await s3Client.send(new DeleteObjectCommand({
              Bucket: JOURNEY_PHOTOS_BUCKET,
              Key: successKey
            }));
          }
        }

        // 4. Hard delete from database
        await prisma.journey.delete({
          where: { id: journey.id }
        });

        results.push({ id: journey.id, status: 'purged' });
      } catch (err) {
        console.error(`[Cleanup] Failed to purge journey ${journey.id}:`, err);
        results.push({ id: journey.id, status: 'error', error: String(err) });
      }
    }

    return NextResponse.json({
      message: `Processed ${journeysToPurge.length} journeys`,
      results
    });
  } catch (error) {
    console.error('[Cleanup] Execution failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
