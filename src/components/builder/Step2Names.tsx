'use client';

import { motion } from 'framer-motion';
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
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-800 p-8 shadow-sm"
      >
        {/* Recipient Name */}
        <div className="mb-6">
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
            className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
              errors.recipient
                ? 'border-red-500 focus:border-red-500'
                : 'border-neutral-200 dark:border-neutral-800 focus:border-rose-500'
            } bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0`}
          />
          {errors.recipient && (
            <p className="mt-2 text-sm text-red-500">{errors.recipient}</p>
          )}
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            This will be used throughout the journey
          </p>
        </div>

        {/* Creator Name */}
        <div>
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
            className="w-full px-4 py-3 rounded-lg border-2 border-neutral-200 dark:border-neutral-800 focus:border-rose-500 bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 dark:placeholder-neutral-600 focus:outline-none focus:ring-0 transition-colors"
          />
          <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
            How you want to sign off (defaults to "Someone special")
          </p>
        </div>

        {/* Preview */}
        {recipientName && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-4 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-800 rounded-lg"
          >
            <div className="flex gap-3">
              <div className="text-2xl">💌</div>
              <div>
                <h4 className="font-semibold text-rose-900 dark:text-rose-300 mb-1">
                  Preview
                </h4>
                <p className="text-sm text-rose-700 dark:text-rose-400">
                  "Hey <span className="font-bold">{recipientName}</span>, I created something
                  special for you..."
                  {creatorName && (
                    <>
                      {' '}
                      - <span className="font-bold">{creatorName}</span>
                    </>
                  )}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Tips */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mt-6 p-4 bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-800 rounded-lg"
      >
        <div className="flex gap-3">
          <div className="text-xl">💡</div>
          <div>
            <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Tips</h4>
            <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
              <li>• Use their first name or a nickname they'll recognize</li>
              <li>• Your name can be playful, romantic, or mysterious</li>
              <li>• You can always change these later</li>
            </ul>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
