'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { getGradientClasses } from '@/lib/occasion-themes';

interface NoOutcomeScreenProps {
  retryCount: number;
  occasionType: string;
  onComplete: () => void;
}

export default function NoOutcomeScreen({ retryCount, occasionType, onComplete }: NoOutcomeScreenProps) {
  const gradientClasses = getGradientClasses(occasionType);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 4000); // 4 seconds total (1s fade in/out + 2s reading)

    return () => clearTimeout(timer);
  }, [onComplete]);

  const messages = [
    "That's okay... \nMaybe we should remember those moments again? 💕",
    "I understand... \nBut those memories were real. One more look? 🥺",
    "You're making this hard! 😅 \nJust one more time? (I promise it's worth it)"
  ];

  const currentMessage = retryCount < messages.length 
    ? messages[retryCount] 
    : messages[messages.length - 1];

  return (
    <motion.div 
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 ${gradientClasses}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="max-w-md w-full text-center space-y-6">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <p className="text-2xl md:text-3xl font-romantic text-neutral-800 dark:text-neutral-100 leading-relaxed whitespace-pre-line">
            {currentMessage}
          </p>
        </motion.div>
        
        <motion.div 
          className="flex justify-center gap-2 mt-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
        >
          <motion.span 
            className="w-2 h-2 rounded-full bg-rose-500/40"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <motion.span 
            className="w-2 h-2 rounded-full bg-rose-500/40"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
          />
          <motion.span 
            className="w-2 h-2 rounded-full bg-rose-500/40"
            animate={{ scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
