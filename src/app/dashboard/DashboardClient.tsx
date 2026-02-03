'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import JourneyTimeline from '@/components/dashboard/JourneyTimeline';
import Container from '@/components/ui/Container';

interface Journey {
  id: string;
  recipientName: string;
  status: 'draft' | 'published' | 'completed';
  uniqueSlug?: string;
  createdAt: string;
  viewCount: number;
  firstPhotoUrl?: string;
}

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
}

interface DashboardClientProps {
  user: User;
}

export default function DashboardClient({ user }: DashboardClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = searchParams.get('tab') || 'overview';
  
  const [journeys, setJourneys] = useState<Journey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [monthlyLimit] = useState(1); // Free tier limit from MVP

  const stats = useMemo(() => {
    const totalViews = journeys.reduce((acc, curr) => acc + curr.viewCount, 0);
    const publishedCount = journeys.filter(j => j.status === 'published' || j.status === 'completed').length;
    const remaining = Math.max(0, monthlyLimit - publishedCount);
    
    return {
      total: journeys.length,
      published: publishedCount,
      views: totalViews,
      remaining
    };
  }, [journeys, monthlyLimit]);

  useEffect(() => {
    fetchJourneys();
  }, []);

  const fetchJourneys = async () => {
    try {
      const response = await fetch('/api/v1/journeys');
      if (response.ok) {
        const data = await response.json();
        setJourneys(data.journeys || []);
      }
    } catch (error) {
      console.error('Failed to fetch journeys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteJourney = async (id: string) => {
    try {
      const response = await fetch(`/api/v1/journeys/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        setJourneys(journeys.filter(j => j.id !== id));
      }
    } catch (error) {
      console.error('Failed to delete journey:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="py-12">
        <Container>
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-neutral-600 dark:text-neutral-300">Loading your journeys...</p>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="py-8 min-h-screen">
      <Container>
        <DashboardHeader
          userName={user.name}
          journeyCount={stats.published}
          monthlyLimit={monthlyLimit}
          activeTab={activeTab}
          totalViews={stats.views}
        />
        
        {activeTab === 'overview' ? (
          <DashboardOverview 
            latestJourneys={journeys.slice(0, 3)}
            onDeleteJourney={handleDeleteJourney}
          />
        ) : (
          <JourneyTimeline
            journeys={journeys}
            onDeleteJourney={handleDeleteJourney}
          />
        )}
      </Container>
    </div>
  );
}
