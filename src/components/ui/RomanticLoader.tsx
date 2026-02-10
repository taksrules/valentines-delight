'use client';

import { motion } from 'framer-motion';

interface RomanticLoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  fullPage?: boolean;
}

export default function RomanticLoader({ 
  message = 'Sharing the magic...', 
  size = 'md',
  fullPage = false 
}: RomanticLoaderProps) {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-16 h-16',
    lg: 'w-24 h-24'
  };

  const loaderContent = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className={`relative ${sizes[size]}`}>
        {/* Pulsing Outer Glow */}
        <motion.div
          className="absolute inset-0 bg-rose-500/20 dark:bg-rose-400/20 rounded-full blur-xl"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0.8, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        {/* Main Heart SVG */}
        <motion.svg
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full text-rose-500 dark:text-rose-400 drop-shadow-sm"
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <path
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
            fill="currentColor"
          />
        </motion.svg>

        {/* Orbiting Sparkles */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-rose-300 dark:bg-rose-200 rounded-full"
            animate={{
              x: [0, Math.cos(i * 120) * 30, 0],
              y: [0, Math.sin(i * 120) * 30, 0],
              opacity: [0, 1, 0],
              scale: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "circOut"
            }}
          />
        ))}
      </div>

      {message && (
        <motion.p
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm font-medium text-rose-600 dark:text-rose-400 font-serif"
        >
          <span className="flex items-center gap-2">
            {message}
            <motion.span
              animate={{ opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, times: [0, 0.5, 1] }}
            >
              ...
            </motion.span>
          </span>
        </motion.p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md"
      >
        <div className="bg-white/50 dark:bg-neutral-900/50 p-12 rounded-3xl border border-rose-100 dark:border-rose-900/30 shadow-2xl">
          {loaderContent}
        </div>
      </motion.div>
    );
  }

  return loaderContent;
}
