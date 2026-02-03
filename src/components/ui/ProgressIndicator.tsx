'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressIndicator({ current, total, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-2 ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          className={`h-2 rounded-full transition-all duration-500 ${
            index === current 
              ? 'w-8 bg-rose-500 dark:bg-rose-400' 
              : index < current 
                ? 'w-2 bg-rose-300 dark:bg-rose-500/50' 
                : 'w-2 bg-neutral-300 dark:bg-neutral-700'
          }`}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        />
      ))}
      <span className="ml-2 text-sm text-neutral-500 dark:text-neutral-400">
        {current + 1} of {total}
      </span>
    </div>
  );
}
