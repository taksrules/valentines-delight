import { Shimmer } from '@/components/ui/Loader';

export default function JourneyCardSkeleton() {
  return (
    <div className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-hidden">
      {/* Thumbnail Shimmer */}
      <Shimmer className="h-48 rounded-none" />

      {/* Content Shimmer */}
      <div className="p-5">
        {/* Title Shimmer */}
        <Shimmer className="h-7 w-3/4 mb-4 rounded-lg" />

        {/* Meta Info Shimmer */}
        <div className="flex gap-4 mb-6">
          <Shimmer className="h-4 w-20 rounded-lg" />
          <Shimmer className="h-4 w-24 rounded-lg" />
        </div>

        {/* Actions Shimmer */}
        <div className="flex gap-2">
          <Shimmer className="h-10 flex-1 rounded-lg" />
          <Shimmer className="h-10 w-12 rounded-lg" />
          <Shimmer className="h-10 w-12 rounded-lg" />
        </div>
      </div>
    </div>
  );
}
