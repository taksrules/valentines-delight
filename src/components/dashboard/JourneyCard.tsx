'use client';

import { motion } from 'framer-motion';
import { ShimmerImage } from '@/components/ui/Loader';
import Link from 'next/link';
import { useState } from 'react';

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
      // TODO: Add toast notification
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
        <div className="absolute top-3 right-3">
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${status.color} backdrop-blur-sm`}>
            <span>{status.icon}</span>
            {status.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-medium text-neutral-900 dark:text-white mb-2">
          For {journey.recipientName}
        </h3>

        <div className="flex items-center gap-4 text-sm font-normal text-neutral-500 dark:text-neutral-400 mb-4">
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            <span>{journey.viewCount} views</span>
          </div>
          <div className="flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>{formattedDate}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {journey.status === 'draft' ? (
            <Link href={`/create?id=${journey.id}`} className="flex-1">
              <button className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg font-medium transition-colors">
                Continue Editing
              </button>
            </Link>
          ) : (
            <>
              <Link href={`/j/${journey.uniqueSlug}`} className="flex-1">
                <button className="w-full px-4 py-2 bg-rose-500 text-white rounded-lg font-medium transition-colors">
                  View Journey
                </button>
              </Link>
              {shareUrl && (
                <button
                  onClick={copyShareLink}
                  className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                  title="Copy share link"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </button>
              )}
            </>
          )}
          
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="px-4 py-2 border border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg font-medium hover:bg-red-50 hover:border-red-300 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:border-red-700 dark:hover:text-red-400 transition-colors"
            title="Delete journey"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
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
              Are you sure you want to delete the journey for {journey.recipientName}? This action cannot be undone.
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
