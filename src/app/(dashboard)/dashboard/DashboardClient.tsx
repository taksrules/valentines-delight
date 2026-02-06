'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/dashboard/DashboardHeader';
import DashboardOverview from '@/components/dashboard/DashboardOverview';
import JourneyTimeline from '@/components/dashboard/JourneyTimeline';
import Container from '@/components/ui/Container';
import JourneyCardSkeleton from '@/components/dashboard/JourneyCardSkeleton';
import { Shimmer } from '@/components/ui/Loader';
import { getQuotaForTier } from '@/lib/quotas';
import { showError, showSuccess } from '@/lib/notifications';

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
  subscriptionTier?: string;
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
  
  const quota = useMemo(() => getQuotaForTier(user.subscriptionTier), [user.subscriptionTier]);
  const monthlyLimit = quota.publishedJourneys;

  const stats = useMemo(() => {
    const totalViews = journeys.reduce((acc, curr) => acc + (curr?.viewCount || 0), 0);
    const publishedCount = journeys.filter(j => j && (j.status === 'published' || j.status === 'completed')).length;

    const remaining = monthlyLimit === -1 ? Infinity : Math.max(0, monthlyLimit - publishedCount);
    
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
        showSuccess('Journey deleted');
      } else {
        showError('Safe failure', 'We couldn\'t delete this journey. Please try again.');
      }
    } catch (error) {
      console.error('Failed to delete journey:', error);
      showError('Connection error', 'Couldn\'t connect to the server to delete the journey.');
    }
  };

  if (isLoading) {
    return (
      <div className="py-8">
        <Container>
          <div className="mb-12">
            <Shimmer className="h-10 w-48 rounded-lg mb-4" />
            <Shimmer className="h-6 w-96 rounded-lg opacity-60" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <JourneyCardSkeleton key={i} />
            ))}
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
