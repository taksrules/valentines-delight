import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import JourneyViewer from '@/components/journey/JourneyViewer';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';

interface PageProps {
  params: Promise<{ slug: string }>;
}

import { s3Client } from '@/lib/s3';
import { getClientIP, viewRateLimit } from '@/lib/rate-limit';
import RateLimitError from '@/components/ui/RateLimitError';
import { getTieredSignedUrl, getCacheHeaders } from '@/lib/storage';

export default async function JourneyPage({ params }: PageProps) {
  const { slug } = await params;

  // Rate Limiting
  const ip = await getClientIP();
  const { success, reset } = await viewRateLimit.limit(ip);

  if (!success) {
    return <RateLimitError resetTimestamp={reset} />;
  }

  // Fetch journey by slug
  const journey = await prisma.journey.findFirst({
    where: {
      uniqueSlug: slug,
      deletedAt: null,
    },
    include: {
      questions: {
        orderBy: { questionOrder: 'asc' },
      },
      photos: {
        orderBy: { photoOrder: 'asc' },
      },
      musicTrack: true,
    },
  });

  if (!journey) {
    notFound();
  }

  // CRITICAL: Only show published or completed journeys publicly
  if (journey.status !== 'published' && journey.status !== 'completed') {
    const { auth } = await import('@/lib/auth');
    const session = await auth();
    
    // If logged in creator, give them a hint
    if (session?.user?.id === journey.creatorId) {
      return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
          <div className="max-w-md w-full text-center space-y-6">
            <div className="w-20 h-20 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <AlertCircle className="w-10 h-10 text-amber-500" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-white">This is a Draft</h1>
              <p className="text-neutral-400">You're seeing this because you're the creator. This journey isn't public yet. Use Preview Mode to view it exactly as your recipient will.</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link 
                href={`/preview/${slug}`}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors"
              >
                Go to Preview Mode
              </Link>
              <Link 
                href="/dashboard"
                className="text-sm text-neutral-500 hover:text-white transition-colors"
              >
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>
      );
    }

    notFound(); // Don't reveal draft exists to others
  }

  // Increment viewCount and log analytics (asynchronously)
  // We don't await these to keep response time fast, but in a Server Component we can do it here.
  try {
    const updatePromise = prisma.journey.update({
      where: { id: journey.id },
      data: { viewCount: { increment: 1 } }
    });

    const analyticsPromise = prisma.journeyAnalytics.create({
      data: {
        journeyId: journey.id,
        eventType: 'viewed',
        sessionId: `srvr-${ip}-${Date.now()}`, // Simple deterministic session ID for server loads
      }
    });

    // Fire and forget or await? Let's await to be sure but it's fast.
    await Promise.allSettled([updatePromise, analyticsPromise]);
  } catch (e) {
    console.error('[Journey Page] Failed to track view:', e);
  }

  const photosWithSignedUrls = await Promise.all(
    journey.photos.map(async (photo:any) => {
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

  // Set cache headers for the page response
  // Note: For Server Components, we can't set headers directly from the component return,
  // but if this were an API route we would. For the page itself, Next.js handles caching via revalidate.
  // However, the assets (images) will benefit from the signed URL expiry.

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
