'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import Button from '@/components/ui/Button';

interface DashboardHeaderProps {
  userName?: string | null;
  journeyCount: number;
  monthlyLimit: number;
  activeTab: string;
  totalViews: number;
}

export default function DashboardHeader({ userName, journeyCount, monthlyLimit, activeTab, totalViews }: DashboardHeaderProps) {
  const navigation = [
    { name: 'Dashboard', tab: 'overview' },
    { name: 'My Journeys', tab: 'journeys' }
  ];

  const currentTab = navigation.find(n => n.tab === activeTab)?.name || 'Dashboard';
  const remaining = monthlyLimit === -1 ? '∞' : Math.max(0, monthlyLimit - journeyCount);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
            {currentTab === 'Dashboard' ? `Welcome back, ${userName || 'Creator'}! ✨` : currentTab}
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            {currentTab === 'Dashboard' 
              ? "Here's what's happening with your emotional moments."
              : "Manage and relive the journeys you've created."}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/create">
            <button className="flex items-center gap-2 px-6 py-2.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl font-bold shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Create New Journey
            </button>
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { 
            label: 'Published', 
            count: journeyCount, 
            icon: (
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            ),
            bg: 'bg-rose-500/10'
          },
          { 
            label: 'Total Views', 
            count: totalViews,
            icon: (
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ),
            bg: 'bg-rose-500/10'
          },
          { 
            label: 'Slots Left', 
            count: remaining, 
            icon: (
              <svg className="w-5 h-5 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            ),
            bg: 'bg-rose-500/10'
          }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
            className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm transition-all"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                {stat.icon}
              </div>
              <h3 className="text-sm font-bold text-neutral-600 dark:text-neutral-400">
                {stat.label}
              </h3>
            </div>
            <p className="text-4xl font-black text-neutral-900 dark:text-neutral-100 tracking-tight">
              {stat.count}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
