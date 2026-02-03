import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth-helpers';
import JourneyViewer from '@/components/journey/JourneyViewer';

interface PageProps {
  searchParams: Promise<{ id?: string }>;
}

export default async function PreviewPage({ searchParams }: PageProps) {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }

  const { id } = await searchParams;
  if (!id) {
    notFound();
  }

  // Fetch journey (must be owned by user)
  const journey = await prisma.journey.findFirst({
    where: {
      id,
      creatorId: session.user.id,
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

      if (photo.imageUrl.includes('/storage/v1/object/public/')) {
        try {
          const urlObj = new URL(photo.imageUrl);
          const parts = urlObj.pathname.split('/public/');

          if (parts.length > 1) {
            const fullPath = parts[1];
            const pathParts = fullPath.split('/');
            const bucket = pathParts[0];
            const key = pathParts.slice(1).join('/');

            if (bucket && key) {
              const command = new GetObjectCommand({ Bucket: bucket, Key: key });
              signedUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
            }
          }
        } catch (e) {
          console.error('[Preview page] Failed to sign photo URL:', e);
        }
      }

      return {
        ...photo,
        imageUrl: signedUrl,
      };
    })
  );

  return (
    <JourneyViewer
      journey={{
        ...journey,
        photos: photosWithSignedUrls,
      }}
      isPreview={true}
    />
  );
}
