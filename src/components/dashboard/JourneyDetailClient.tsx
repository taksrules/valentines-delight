'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Eye, 
  Calendar, 
  CheckCircle, 
  MessageCircle,
  ExternalLink,
  Edit,
  Share2,
  Copy,
  ArrowLeft,
  LayoutGrid
} from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import ResponsesTab from '@/components/dashboard/ResponsesTab';
import Link from 'next/link';
import { Shimmer } from '@/components/ui/Loader';
import { showSuccess } from '@/lib/notifications';

interface JourneyDetailClientProps {
  journey: {
    id: string;
    recipientName: string;
    status: string;
    uniqueSlug: string | null;
    createdAt: string;
    viewCount: number;
    responsesAvailable: boolean;
  };
}

export default function JourneyDetailClient({ journey, isLoading = false }: JourneyDetailClientProps & { isLoading?: boolean }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';

  if (isLoading) {
    return <JourneyDetailSkeleton />;
  }

  const tabs = [
    { id: 'overview', name: 'Overview', icon: LayoutGrid },
    { id: 'responses', name: 'Responses', icon: MessageCircle, badge: journey.responsesAvailable },
    { id: 'edit', name: 'Edit', icon: Edit },
  ];

  const handleTabChange = (tabId: string) => {
    if (tabId === 'edit') {
      router.push(`/create?id=${journey.id}`);
      return;
    }
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tabId);
    router.push(`?${params.toString()}`);
  };

  const handleCopy = () => {
    const url = `${window.location.origin}/j/${journey.uniqueSlug}`;
    navigator.clipboard.writeText(url);
    showSuccess('Link copied! 📋');
  };

  return (
    <div className="py-6 md:py-12 min-h-screen bg-neutral-50/50 dark:bg-neutral-950/50">
      <Container>
        {/* Back Button */}
        <Link 
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-medium text-neutral-500 hover:text-rose-500 transition-colors mb-6 md:mb-10 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Dashboard
        </Link>

        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-10 md:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md text-[10px] font-bold uppercase tracking-wider border border-neutral-200 dark:border-neutral-700">
                  Journey
                </span>
                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Created on {new Date(journey.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold text-neutral-900 dark:text-white tracking-tight">
                For {journey.recipientName}
              </h1>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
              {journey.uniqueSlug && (
                <Link href={journey.status !== 'draft' ? `/j/${journey.uniqueSlug}` : `/preview/${journey.uniqueSlug}`} target="_blank" className="w-full sm:w-auto">
                  <Button variant="secondary" className="w-full gap-2 py-2.5 px-6 font-bold shadow-lg shadow-neutral-500/5">
                    {journey.status !== 'draft' ? (
                      <><ExternalLink className="w-4 h-4" /> View Live</>
                    ) : (
                      <><Eye className="w-4 h-4" /> Preview Draft</>
                    )}
                  </Button>
                </Link>
              )}
              <Link href={`/create?id=${journey.id}`} className="w-full sm:w-auto">
                <Button className="w-full gap-2 py-2.5 px-6 font-bold shadow-lg shadow-rose-500/20">
                  <Edit className="w-4 h-4" />
                  Edit Journey
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-1 mb-10 overflow-x-auto pb-1 no-scrollbar border-b border-neutral-200 dark:border-neutral-800">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`relative flex items-center gap-2 px-6 py-4 text-sm font-semibold transition-all whitespace-nowrap ${
                  isActive
                    ? 'text-rose-500'
                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-rose-500' : 'text-neutral-400'}`} />
                {tab.name}
                {tab.badge && (
                  <span className="flex h-2 w-2 rounded-full bg-rose-500 ml-1" />
                )}
                {isActive && (
                  <motion.div 
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-rose-500"
                  />
                )}
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="min-h-[400px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-10 md:space-y-16"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard 
                    label="Total Views" 
                    value={journey.viewCount} 
                    icon={Eye} 
                    color="rose"
                  />
                  <StatCard 
                    label="Current Status" 
                    value={journey.status.charAt(0).toUpperCase() + journey.status.slice(1)} 
                    icon={CheckCircle} 
                    color="emerald"
                  />
                  <StatCard 
                    label="Partner Responses" 
                    value={journey.responsesAvailable ? 'Available' : 'None yet'} 
                    icon={MessageCircle} 
                    color="indigo"
                  />
                </div>

                {/* Share Section */}
                <section className="max-w-4xl">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
                       <Share2 className="w-5 h-5 text-rose-500" />
                       Share Your Journey
                    </h3>
                    <p className="text-sm text-neutral-500">
                      Send this link to {journey.recipientName} to start their experience
                    </p>
                  </div>

                  <div className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
                    <div className="flex flex-col md:flex-row gap-4">
                      <div className="flex-1 relative group">
                        <input 
                          readOnly 
                          value={journey.uniqueSlug ? `${window.location.origin}/j/${journey.uniqueSlug}` : ''}
                          className="w-full bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl px-4 py-3 text-sm font-mono text-neutral-600 dark:text-neutral-400 focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all outline-none"
                        />
                        <button 
                          onClick={handleCopy}
                          className="absolute right-2 top-1.5 px-4 py-1.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors flex items-center gap-1.5 shadow-sm"
                        >
                            <>
                              <Copy className="w-3.5 h-3.5" />
                              <span>Copy Link</span>
                            </>
                        </button>
                      </div>
                      <button className="flex items-center justify-center gap-2 px-8 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-xl font-bold hover:opacity-90 transition-opacity active:scale-[0.98]">
                        <Share2 className="w-4 h-4" />
                        Share Journey
                      </button>
                    </div>
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'responses' && (
              <motion.div
                key="responses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <ResponsesTab journeyId={journey.id} recipientName={journey.recipientName} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Container>
    </div>
  );
}

function JourneyDetailSkeleton() {
  return (
    <div className="py-6 md:py-12 min-h-screen">
      <Container>
        <Shimmer className="h-4 w-32 rounded-full mb-10" />
        
        <div className="flex flex-col md:flex-row justify-between gap-6 mb-16">
          <div className="space-y-4">
            <Shimmer className="h-6 w-24 rounded-md" />
            <Shimmer className="h-12 w-64 md:w-96 rounded-xl" />
          </div>
          <div className="flex gap-3">
            <Shimmer className="h-11 w-32 rounded-xl" />
            <Shimmer className="h-11 w-32 rounded-xl" />
          </div>
        </div>

        <div className="flex gap-4 border-b border-neutral-200 dark:border-neutral-800 mb-10">
          <Shimmer className="h-10 w-24" />
          <Shimmer className="h-10 w-24" />
          <Shimmer className="h-10 w-24" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <Shimmer className="h-48 rounded-3xl" />
          <Shimmer className="h-48 rounded-3xl" />
          <Shimmer className="h-48 rounded-3xl" />
        </div>

        <div className="max-w-4xl space-y-6">
          <Shimmer className="h-10 w-48 rounded-lg" />
          <Shimmer className="h-32 rounded-2xl" />
        </div>
      </Container>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string, value: string | number, icon: any, color: 'rose' | 'emerald' | 'indigo' }) {
  const colors = {
    rose: 'text-rose-500 bg-rose-500/10',
    emerald: 'text-emerald-500 bg-emerald-500/10',
    indigo: 'text-indigo-500 bg-indigo-500/10'
  };

  return (
    <div className="group p-8 bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-sm hover:shadow-md transition-all duration-300">
      <div className={`w-12 h-12 rounded-full ${colors[color]} flex items-center justify-center mb-6`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="space-y-1">
        <div className="text-3xl font-black text-neutral-900 dark:text-white tracking-tight">
          {value}
        </div>
        <div className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
          {label}
        </div>
      </div>
    </div>
  );
}
