'use client';

import JourneyCard from './JourneyCard';
import EmptyState from './EmptyState';

interface Journey {
  id: string;
  recipientName: string;
  status: 'draft' | 'published' | 'completed';
  uniqueSlug?: string;
  createdAt: string;
  viewCount: number;
  firstPhotoUrl?: string;
}

interface JourneyGridProps {
  journeys: Journey[];
  onDeleteJourney: (id: string) => void;
}

export default function JourneyGrid({ journeys, onDeleteJourney }: JourneyGridProps) {
  if (journeys.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {journeys.map((journey, index) => (
        <JourneyCard
          key={journey.id}
          journey={journey}
          onDelete={onDeleteJourney}
        />
      ))}
    </div>
  );
}
