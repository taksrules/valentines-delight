'use client';

import { motion } from 'framer-motion';

interface ProgressIndicatorProps {
  current: number;
  total: number;
  className?: string;
}

export default function ProgressIndicator({ current, total, className = '' }: ProgressIndicatorProps) {
  return (
    <div className={`flex items-center justify-center gap-3 ${className}`}>
      {Array.from({ length: total }, (_, index) => (
        <motion.div
          key={index}
          className="relative"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          <svg 
            className={`w-6 h-6 transition-all duration-500 ${
              index <= current 
                ? 'text-rose-500 fill-rose-500 scale-110' 
                : 'text-neutral-300 dark:text-neutral-700 fill-transparent'
            }`}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l8.72-8.72 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          
          {index === current && (
            <motion.div
              className="absolute inset-0 bg-rose-400 rounded-full filter blur-md opacity-50"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 0.2, 0.5]
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
