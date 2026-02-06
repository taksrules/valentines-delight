'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';

export default function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="flex flex-col items-center justify-center py-16 px-4"
    >
      {/* Illustration */}
      <div className="relative w-48 h-48 mb-8">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 to-pink-100 dark:from-rose-500/10 dark:to-pink-500/10 rounded-full flex items-center justify-center">
          <svg className="w-24 h-24 text-rose-400 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </div>
        {/* Floating hearts */}
        <motion.div
          animate={{
            y: [-10, -20, -10],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute -top-4 -right-4 text-2xl"
        >
          💕
        </motion.div>
        <motion.div
          animate={{
            y: [-15, -25, -15],
            opacity: [0.5, 1, 0.5]
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5
          }}
          className="absolute -bottom-2 -left-2 text-xl"
        >
          ✨
        </motion.div>
      </div>

      {/* Message */}
      <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-white mb-3 text-center">
        Ready to Create Your First Journey?
      </h3>
      <p className="text-base font-normal text-neutral-600 dark:text-neutral-400 mb-8 text-center max-w-md">
        Turn your love story into an unforgettable interactive experience in just minutes.
      </p>

      {/* CTA Button */}
      <Link href="/create">
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-full font-medium text-lg shadow-lg hover:shadow-xl transition-shadow dark:shadow-rose-900/30"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Your First Journey
        </motion.button>
      </Link>

      {/* Help text */}
      <p className="mt-6 text-sm text-neutral-500 dark:text-neutral-400">
        Takes less than 5 minutes • No credit card required
      </p>
    </motion.div>
  );
}
