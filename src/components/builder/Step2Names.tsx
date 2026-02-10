'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/stores/builderStore';
import { useState } from 'react';

export default function Step2Names() {
  const { recipientName, creatorName, setRecipientName, setCreatorName } = useBuilderStore();
  const [errors, setErrors] = useState<{ recipient?: string }>({});

  const validateRecipientName = (name: string) => {
    if (!name.trim()) {
      setErrors({ recipient: 'Recipient name is required' });
      return false;
    }
    if (name.trim().length < 2) {
      setErrors({ recipient: 'Name must be at least 2 characters' });
      return false;
    }
    setErrors({});
    return true;
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-3">
          Who is this journey for?
        </h2>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          Let's personalize this experience
        </p>
      </div>

      <motion.div
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        initial="hidden"
        animate="show"
        className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm hover:shadow-md transition-shadow duration-500"
      >
        {/* Recipient Name */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
          className="mb-6"
        >
          <label
            htmlFor="recipientName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Their name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="recipientName"
            value={recipientName}
            onChange={(e) => {
              setRecipientName(e.target.value);
              validateRecipientName(e.target.value);
            }}
            onBlur={(e) => validateRecipientName(e.target.value)}
            placeholder="e.g., Emily, Alex, Jordan"
            className={`w-full px-4 py-3 rounded-xl border-2 transition-all duration-300 ${
              errors.recipient
                ? 'border-red-500 focus:border-red-500 bg-red-50/10'
                : 'border-neutral-200 dark:border-neutral-800 focus:border-rose-500 bg-white dark:bg-neutral-950 shadow-inner-sm'
            } text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0`}
          />
          {errors.recipient && (
            <p className="mt-2 text-sm text-red-500">{errors.recipient}</p>
          )}
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-serif italic">
            This will be used throughout the journey
          </p>
        </motion.div>

        {/* Creator Name */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 10 },
            show: { opacity: 1, y: 0 }
          }}
        >
          <label
            htmlFor="creatorName"
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2"
          >
            Your name <span className="text-neutral-400">(optional)</span>
          </label>
          <input
            type="text"
            id="creatorName"
            value={creatorName}
            onChange={(e) => setCreatorName(e.target.value)}
            placeholder="e.g., Your Chief, Your Secret Admirer"
            className="w-full px-4 py-3 rounded-xl border-2 border-neutral-200 dark:border-neutral-800 focus:border-rose-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-all duration-300 shadow-inner-sm"
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400 font-serif italic">
            How you want to sign off (defaults to "Someone special")
          </p>
        </motion.div>

        {/* Preview */}
        <AnimatePresence>
          {recipientName && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="mt-8 p-6 bg-rose-50/50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-900/30 rounded-2xl"
            >
              <div className="flex gap-4">
                <div className="text-3xl">💌</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-1 font-serif">
                    The Magic Message
                  </h4>
                  <p className="text-sm text-rose-700/80 dark:text-rose-400/80 leading-relaxed">
                    "Hey <span className="font-bold text-rose-600 dark:text-rose-400">{recipientName}</span>, I created something
                    special for you..."
                    {creatorName && (
                      <>
                        {' '}
                        - <span className="font-bold text-rose-600 dark:text-rose-400">{creatorName}</span>
                      </>
                    )}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-blue-50/50 dark:bg-blue-500/5 border border-blue-100 dark:border-blue-900/30 rounded-2xl flex gap-3"
      >
        <div className="text-xl">💡</div>
        <div className="text-sm text-blue-700/80 dark:text-blue-400/80">
          <p className="font-medium mb-1 text-blue-900 dark:text-blue-300">Quick Tips</p>
          <ul className="space-y-1 font-serif italic">
            <li>• Use their first name or a nickname they'll recognize</li>
            <li>• Your name can be playful, romantic, or mysterious</li>
          </ul>
        </div>
      </motion.div>
    </div>
  );
}
