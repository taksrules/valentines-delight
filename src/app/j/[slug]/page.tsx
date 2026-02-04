import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import JourneyViewer from '@/components/journey/JourneyViewer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function JourneyPage({ params }: PageProps) {
  const { slug } = await params;

  // Fetch published journey by slug
  const journey = await prisma.journey.findFirst({
    where: {
      uniqueSlug: slug,
      status: 'published',
      deletedAt: null,
    },
    include: {
      questions: {
        orderBy: { questionOrder: 'asc' },
      },
      photos: {
        orderBy: { photoOrder: 'asc' },
      },
    },
  });

  if (!journey) {
    notFound();
  }

  // Generate signed URLs for photos
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const { s3Client } = await import('@/lib/s3');

  const photosWithSignedUrls = await Promise.all(
    journey.photos.map(async (photo) => {
      let signedUrl = photo.imageUrl;

      try {
        const urlObj = new URL(photo.imageUrl);
        
        // Handle Supabase public storage URLs: /storage/v1/object/public/bucket/key
        if (photo.imageUrl.includes('/storage/v1/object/public/')) {
          const parts = urlObj.pathname.split('/storage/v1/object/public/');
          if (parts.length > 1) {
            const fullPath = parts[1];
            const pathParts = fullPath.split('/');
            const bucket = pathParts[0];
            const key = pathParts.slice(1).join('/');

            if (bucket && key) {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key });
              signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
              console.log(`[Journey] Signed URL for ${key}`);
            }
          }
        }
        // Handle already-signed S3 URLs or direct storage paths
        else if (photo.imageUrl.includes('/storage/v1/s3/')) {
          // Extract bucket and key from S3 URL
          const s3Match = photo.imageUrl.match(/\/storage\/v1\/s3\/([^/]+)\/(.+?)(?:\?|$)/);
          if (s3Match) {
            const bucket = s3Match[1];
            const key = s3Match[2];
            
            const command = new GetObjectCommand({ Bucket: bucket, Key: key });
            signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            console.log(`[Journey] Re-signed S3 URL for ${key}`);
          }
        }
      } catch (e) {
        console.error('[Journey page] Failed to sign photo URL:', photo.imageUrl, e);
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
        const command = new GetObjectCommand({ Bucket: bucket, Key: key });
        signedSuccessPhotoUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log(`[Journey] Signed success photo URL for ${key}`);
      }
    } catch (e) {
      console.error('[Journey page] Failed to sign success photo URL:', e);
    }
  }

  return (
    <JourneyViewer
      journey={{
        ...journey,
        photos: photosWithSignedUrls,
        successPhotoUrl: signedSuccessPhotoUrl,
      }}
      isPreview={false}
    />
  );
}
