import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import JourneyViewer from '@/components/journey/JourneyViewer';
import { LayoutDashboard, Edit3, Send, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const session = await auth();
  if (!session) {
    redirect('/sign-in?returnUrl=/preview/');
  }

  const { slug } = await params;
  if (!slug) {
    notFound();
  }

  // Fetch journey by slug (check ownership later for better error messages)
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

  // CRITICAL: Only creator can preview
  if (journey.creatorId !== session.user.id) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto border border-rose-500/20">
            <AlertCircle className="w-10 h-10 text-rose-500" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-white">Access Denied</h1>
            <p className="text-neutral-400">You don't have permission to preview this journey. Only the creator can view their magic before it's shared.</p>
          </div>
          <Link 
            href="/dashboard"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-semibold hover:bg-neutral-200 transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // Generate signed URLs for photos
  const { GetObjectCommand } = await import('@aws-sdk/client-s3');
  const { getSignedUrl } = await import('@aws-sdk/s3-request-presigner');
  const { s3Client } = await import('@/lib/s3');

  const photosWithSignedUrls = await Promise.all(
    journey.photos.map(async (photo: any) => {
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
    <div className="relative">
      {/* Creator Toolbar */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] px-4 py-3 bg-black/90 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl flex items-center gap-4">
        <div className="flex items-center gap-3 px-3 py-1.5 bg-white/5 rounded-xl border border-white/5">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${journey.status === 'published' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-[10px] font-bold text-white uppercase tracking-wider">{journey.status}</span>
          </div>
        </div>
        
        <div className="h-6 w-[1px] bg-white/10" />
        
        <div className="flex items-center gap-2">
          <Link 
            href={`/edit/${journey.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium transition-all"
          >
            <Edit3 className="w-4 h-4" />
            Edit
          </Link>
          
          {journey.status !== 'published' && (
            <Link 
              href={`/dashboard?id=${journey.id}&publish=true`}
              className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-rose-500/20 transition-all border border-rose-400/20"
            >
              <Send className="w-4 h-4" />
              Publish Now
            </Link>
          )}
        </div>
      </div>

      <JourneyViewer
        journey={{
          ...journey,
          photos: photosWithSignedUrls,
          successPhotoUrl: journey.successPhotoUrl, // Logic inside viewer handles signing
        }}
        isPreview={true}
      />
    </div>
  );
}
