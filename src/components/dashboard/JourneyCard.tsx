'use client';

import { motion } from 'framer-motion';
import { ShimmerImage } from '@/components/ui/Loader';
import Link from 'next/link';
import { useState } from 'react';
import { showSuccess } from '@/lib/notifications';

interface Journey {
  id: string;
  recipientName: string;
  status: 'draft' | 'published' | 'completed';
  uniqueSlug?: string;
  createdAt: string;
  viewCount: number;
  firstPhotoUrl?: string;
}

interface JourneyCardProps {
  journey: Journey;
  onDelete: (id: string) => void;
}

export default function JourneyCard({ journey, onDelete }: JourneyCardProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const statusConfig = {
    draft: {
      label: 'Draft',
      color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300',
      icon: '📝'
    },
    published: {
      label: 'Published',
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      icon: '🚀'
    },
    completed: {
      label: 'Completed',
      color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
      icon: '💚'
    }
  };

  const status = statusConfig[journey.status];
  const formattedDate = new Date(journey.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await onDelete(journey.id);
    setIsDeleting(false);
    setShowDeleteConfirm(false);
  };

  const shareUrl = journey.uniqueSlug 
    ? `${window.location.origin}/j/${journey.uniqueSlug}`
    : null;

  const copyShareLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      showSuccess('Link copied to clipboard! 📋');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-lg transition-all overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-48 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-neutral-800 dark:to-neutral-900">
        {journey.firstPhotoUrl ? (
          <ShimmerImage
            src={journey.firstPhotoUrl}
            alt={`Journey for ${journey.recipientName}`}
            fill
            className="object-cover"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl opacity-30">💕</div>
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 right-3 flex gap-2">
          {journey.status === 'completed' && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white shadow-lg animate-pulse">
              💭 New Response!
            </span>
          )}
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color} backdrop-blur-sm`}>
            <span>{status.icon}</span>
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <Link href={`/dashboard/journeys/${journey.id}`}>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2 hover:text-rose-500 transition-colors cursor-pointer">
            For {journey.recipientName}
          </h3>
        </Link>

       {/* // ... (lines 109-123 unchanged) */}

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <div className="flex gap-2">
    <Link href={journey.status !== 'draft' ? `/j/${journey.uniqueSlug}` : `/preview/${journey.uniqueSlug}`} target="_blank" className="flex-1">
      <button className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg font-bold transition-all hover:bg-rose-600 active:scale-[0.98] flex items-center justify-center gap-2">
        {journey.status !== 'draft' ? (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-7.714 2.143L11 21l-2.286-6.857L1 12l7.714-2.143L11 3z" />
            </svg>
            View Live
          </>
        ) : (
          <>
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview 
          </>
        )}
      </button>
    </Link>
            
            <Link href={`/dashboard/journeys/${journey.id}`} className="flex-1">
              <button className="w-full px-4 py-2 border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white rounded-lg font-bold transition-all hover:bg-neutral-50 dark:hover:bg-neutral-800 active:scale-[0.98]">
                Manage
              </button>
            </Link>
          </div>
          
          <div className="flex items-center gap-2">
            {shareUrl && journey.status === 'published' && (
              <button
                onClick={copyShareLink}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Copy Link
              </button>
            )}
            
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="p-2 border border-neutral-300 dark:border-neutral-700 text-neutral-500 hover:text-red-500 rounded-lg transition-colors"
              title="Delete journey"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-xl p-6 max-w-md w-full border border-neutral-200 dark:border-neutral-800"
          >
            <h3 className="text-2xl font-semibold text-neutral-900 dark:text-white mb-2">
              Delete Journey?
            </h3>
            <p className="text-base font-normal text-neutral-600 dark:text-neutral-400 mb-6">
              Are you sure you want to delete the journey for {journey.recipientName}? This will also permanently delete all partner responses. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
