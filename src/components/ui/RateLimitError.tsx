'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Container from './Container';

interface RateLimitErrorProps {
  resetTimestamp: number;
}

export default function RateLimitError({ resetTimestamp }: RateLimitErrorProps) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTime = () => {
      const now = Date.now();
      const diff = Math.max(0, resetTimestamp - now);
      
      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);
      
      if (minutes > 0) {
        setTimeLeft(`${minutes}m ${seconds}s`);
      } else {
        setTimeLeft(`${seconds}s`);
      }
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [resetTimestamp]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-20">
      <Container>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md mx-auto text-center"
        >
          <div className="w-24 h-24 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-rose-100 dark:border-rose-800">
            <span className="text-5xl">⏳</span>
          </div>
          
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            Slow down a bit
          </h1>
          
          <p className="text-neutral-600 dark:text-neutral-400 mb-8 leading-relaxed">
            You've reached our rate limit. We do this to keep the magic running smoothly for everyone.
          </p>
          
          <div className="p-6 bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl border border-neutral-200 dark:border-neutral-800 mb-8">
            <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Ready to retry in
            </p>
            <p className="text-4xl font-mono font-bold text-rose-500 tabular-nums">
              {timeLeft}
            </p>
          </div>
          
          <div className="space-y-4">
            <button 
              onClick={() => window.location.reload()}
              className="w-full py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold shadow-lg shadow-rose-200 dark:shadow-none transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Try Again
            </button>
            
            <Link 
              href="/"
              className="block text-sm text-neutral-500 hover:text-rose-500 transition-colors"
            >
              Back to home
            </Link>
          </div>
        </motion.div>
      </Container>
    </div>
  );
}
