'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/stores/builderStore';

const occasions = [
  {
    type: 'valentine',
    name: "Valentine's Day",
    icon: '💕',
    description: 'Express your love this Valentine\'s Day',
    available: true,
  },
  {
    type: 'proposal',
    name: 'Proposal',
    icon: '💍',
    description: 'Pop the question in a memorable way',
    available: false,
  },
  {
    type: 'anniversary',
    name: 'Anniversary',
    icon: '🎉',
    description: 'Celebrate your special milestone',
    available: false,
  },
  {
    type: 'apology',
    name: 'Apology',
    icon: '🌹',
    description: 'Make amends with heartfelt sincerity',
    available: false,
  },
  {
    type: 'long_distance',
    name: 'Long Distance',
    icon: '✈️',
    description: 'Bridge the distance with love',
    available: false,
  },
  {
    type: 'custom',
    name: 'Custom',
    icon: '✨',
    description: 'Create your own unique journey',
    available: false,
  },
];

export default function Step1Occasion() {
  const { occasionType, setOccasionType } = useBuilderStore();

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Choose Your Occasion
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          What's the special moment you're celebrating?
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {occasions.map((occasion) => (
          <motion.button
            key={occasion.type}
            whileHover={occasion.available ? { y: -4 } : {}}
            whileTap={occasion.available ? { scale: 0.98 } : {}}
            onClick={() => occasion.available && setOccasionType(occasion.type)}
            disabled={!occasion.available}
            className={`relative p-6 rounded-xl border-2 transition-all text-left ${
              occasionType === occasion.type
                ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10 shadow-lg shadow-rose-500/20'
                : occasion.available
                ? 'border-neutral-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-700 bg-white dark:bg-neutral-900'
                : 'border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50 opacity-60 cursor-not-allowed'
            }`}
          >
            {/* Coming Soon Badge */}
            {!occasion.available && (
              <div className="absolute top-3 right-3">
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-neutral-200 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
                  Coming Soon
                </span>
              </div>
            )}

            {/* Icon */}
            <div className="text-5xl mb-3">{occasion.icon}</div>

            {/* Name */}
            <h3
              className={`text-xl font-bold mb-2 ${
                occasionType === occasion.type
                  ? 'text-rose-600 dark:text-rose-400'
                  : 'text-neutral-900 dark:text-neutral-100'
              }`}
            >
              {occasion.name}
            </h3>

            {/* Description */}
            <p className="text-sm text-neutral-600 dark:text-neutral-400">
              {occasion.description}
            </p>

            {/* Selected Indicator */}
            {occasionType === occasion.type && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-3 right-3 w-6 h-6 bg-rose-500 rounded-full flex items-center justify-center"
              >
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>

      {/* Info Box */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mt-8 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div className="flex gap-3">
          <div className="text-2xl">ℹ️</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">
              More occasions coming soon!
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
              We're launching with Valentine's Day to make this February extra special. More
              occasion types will be available after launch.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
