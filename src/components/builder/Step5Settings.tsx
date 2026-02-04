'use client';

import { motion } from 'framer-motion';
import { useBuilderStore } from '@/stores/builderStore';
import { useEffect, useState } from 'react';

export default function Step5Settings() {
  const {
    recipientName,
    musicEnabled,
    musicMood,
    uniqueSlug,
    setMusicEnabled,
    setMusicMood,
    setUniqueSlug,
  } = useBuilderStore();

  const [generatedSlug, setGeneratedSlug] = useState('');

  useEffect(() => {
    if (recipientName) {
      const slug = generateSlug(recipientName);
      setGeneratedSlug(slug);
      if (!uniqueSlug) {
        setUniqueSlug(slug);
      }
    }
  }, [recipientName, uniqueSlug, setUniqueSlug]);

  const musicMoods = [
    { value: 'romantic', label: 'Romantic', icon: '💕', description: 'Soft, loving melodies' },
    { value: 'playful', label: 'Playful', icon: '🎵', description: 'Upbeat and fun' },
    { value: 'nostalgic', label: 'Nostalgic', icon: '🎹', description: 'Sentimental and warm' },
  ];

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Final Settings
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Add the finishing touches to your journey
        </p>
      </div>

      <div className="space-y-6">
        {/* Music Settings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            🎵 Background Music
          </h3>

          {/* Music Toggle */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="font-medium text-neutral-900 dark:text-neutral-100">
                Enable background music
              </p>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Add a romantic soundtrack to the journey
              </p>
            </div>
            <button
              onClick={() => setMusicEnabled(!musicEnabled)}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                musicEnabled ? 'bg-rose-500' : 'bg-neutral-300 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  musicEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Music Mood */}
          {musicEnabled && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                Music Mood
              </label>
              <div className="grid grid-cols-3 gap-3">
                {musicMoods.map((mood) => (
                  <button
                    key={mood.value}
                    onClick={() => setMusicMood(mood.value)}
                    className={`p-4 rounded-lg border-2 transition-all text-center ${
                      musicMood === mood.value
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-500/10'
                        : 'border-neutral-200 dark:border-neutral-800 hover:border-rose-300 dark:hover:border-rose-700'
                    }`}
                  >
                    <div className="text-3xl mb-2">{mood.icon}</div>
                    <div className="font-medium text-neutral-900 dark:text-neutral-100 mb-1">
                      {mood.label}
                    </div>
                    <div className="text-xs text-neutral-600 dark:text-neutral-400">
                      {mood.description}
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Journey Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6"
        >
          <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            🔗 Journey Link
          </h3>

          <div className="mb-4">
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Your unique link
            </label>
            <div className="flex items-center gap-2">
              <div className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-sm">
                https://www.tenderly.space/j/{generatedSlug}
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://www.tenderly.space/j/${generatedSlug}`
                  );
                }}
                className="px-4 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                title="Copy link"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
              </button>
            </div>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
              This link will be generated when you publish
            </p>
          </div>

          {/* Preview Button */}
          <button
            onClick={() => {
              // Open preview in new tab (will need journey ID from store)
              const journeyId = useBuilderStore.getState().journeyId;
              if (journeyId) {
                window.open(`/create/preview?id=${journeyId}`, '_blank');
              } else {
                alert('Please save your journey first');
              }
            }}
            className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Preview Journey
          </button>
        </motion.div>

        {/* Pro Features (Disabled) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-neutral-50 dark:bg-neutral-900/50 rounded-xl border border-neutral-200 dark:border-neutral-800 p-6 opacity-60"
        >
          <div className="flex items-start gap-3 mb-4">
            <div className="text-2xl">⭐</div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-1">
                Pro Features
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                Coming soon after launch
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                Password protect this journey
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                Schedule delivery for a specific date
              </span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                disabled
                className="w-4 h-4 rounded border-neutral-300 dark:border-neutral-700"
              />
              <span className="text-neutral-600 dark:text-neutral-400">
                Link expires after they say YES
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

// Slug generation helper
function generateSlug(recipientName: string): string {
  const name = recipientName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  const random = Math.random().toString(36).substring(2, 6);
  return `${name}-val-${random}`;
}
