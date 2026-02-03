'use client';

import { motion } from 'framer-motion';
import JourneyCard from './JourneyCard';
import Link from 'next/link';

interface Stats {
  total: number;
  published: number;
  views: number;
  remaining: number;
}

interface Journey {
  id: string;
  recipientName: string;
  status: 'draft' | 'published' | 'completed';
  uniqueSlug?: string;
  createdAt: string;
  viewCount: number;
  firstPhotoUrl?: string;
}

interface DashboardOverviewProps {
  latestJourneys: Journey[];
  onDeleteJourney: (id: string) => void;
}

export default function DashboardOverview({ latestJourneys, onDeleteJourney }: DashboardOverviewProps) {
  return (
    <div className="space-y-10">
      {/* Latest Journeys section */}

      {/* Latest Journeys section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            Latest Moments
          </h2>
          <Link href="/dashboard?tab=journeys" className="text-rose-500 dark:text-rose-400 font-bold hover:underline">
            View all →
          </Link>
        </div>

        {latestJourneys.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestJourneys.map((journey) => (
              <JourneyCard
                key={journey.id}
                journey={journey}
                onDelete={onDeleteJourney}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-neutral-900 rounded-2xl border-2 border-dashed border-neutral-200 dark:border-neutral-800 p-12 text-center">
            <span className="text-5xl block mb-4">🎨</span>
            <h3 className="text-lg font-bold mb-2">No journeys yet</h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">Start creating your first emotional journey today!</p>
            <Link href="/create">
              <button className="px-6 py-2 bg-rose-500 text-white rounded-xl font-bold">
                Get Started
              </button>
            </Link>
          </div>
        )}
      </section>

      {/* Tips / Info section */}
      <section className="bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl p-8 border border-rose-500/20">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-2">
              Pro Tip: Use high-quality photos! 📸
            </h3>
            <p className="text-neutral-600 dark:text-neutral-300">
              Journeys with 4 or more photos get 3x more emotional engagement. Try to pick moments that tell a story.
            </p>
          </div>
          <Link href="/create">
            <button className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-3 rounded-2xl font-bold shadow-xl shadow-rose-500/20 transition-all">
              Inspire Someone Now
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
}
