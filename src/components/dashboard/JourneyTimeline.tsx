'use client';

import { motion } from 'framer-motion';
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

interface JourneyTimelineProps {
  journeys: Journey[];
  onDeleteJourney: (id: string) => void;
}

export default function JourneyTimeline({ journeys, onDeleteJourney }: JourneyTimelineProps) {
  if (journeys.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="relative py-10 max-w-5xl mx-auto">
      {/* Central Line */}
      <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 bg-gradient-to-b from-rose-500/50 via-pink-500/50 to-transparent dark:from-rose-500/30 dark:via-pink-500/30 rounded-full" />

      <div className="space-y-24 relative">
        {journeys.map((journey, index) => {
          const isEven = index % 2 === 0;
          const date = new Date(journey.createdAt);
          
          return (
            <div key={journey.id} className="relative flex items-center justify-center">
              {/* Timeline Dot */}
              <div className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white dark:bg-neutral-900 border-4 border-rose-500 z-10 shadow-[0_0_20px_rgba(244,63,94,0.3)] flex items-center justify-center text-xs">
                 💖
              </div>

              {/* Content Wrapper */}
              <div className={`w-full flex ${isEven ? 'justify-start' : 'justify-end'} px-4 md:px-0`}>
                <motion.div
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-10%" }}
                  transition={{ duration: 0.6, type: 'spring' }}
                  className={`w-full md:w-[45%] group`}
                >
                  <div className="relative">
                    {/* Floating Date Bubble */}
                    <div className={`absolute top-0 ${isEven ? 'right-0 -mr-4 md:right-auto md:left-full md:ml-8' : 'left-0 -ml-4 md:left-auto md:right-full md:mr-8'} -mt-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-full px-4 py-1 shadow-sm z-20`}>
                      <span className="text-sm font-bold text-rose-500">
                        {new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date)}
                      </span>
                    </div>

                    {/* Card Container with Glassmorphism Effect */}
                    <div className="backdrop-blur-xl bg-white/80 dark:bg-neutral-900/80 rounded-3xl p-2 border border-white/20 dark:border-neutral-800 shadow-2xl transition-transform group-hover:scale-[1.02]">
                       <JourneyCard 
                          journey={journey} 
                          onDelete={onDeleteJourney}
                       />
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Finishing Element */}
      <div className="mt-24 text-center">
         <div className="inline-block px-8 py-3 bg-neutral-100 dark:bg-neutral-800 rounded-full border border-neutral-200 dark:border-neutral-700 font-bold text-neutral-500">
            End of Timeline 💫
         </div>
      </div>
    </div>
  );
}
