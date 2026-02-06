'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Button from '@/components/ui/Button';

interface User {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

interface SettingsClientProps {
  user: User;
}

export default function SettingsClient({ user }: SettingsClientProps) {
  const [name, setName] = useState(user.name || '');
  const [image, setImage] = useState(user.image || '');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch('/api/v1/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, image }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage({ type: 'success', text: 'Profile updated successfully! ✨' });
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'An unexpected error occurred' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">
          Account Settings
        </h1>
        <p className="text-base font-normal text-neutral-600 dark:text-neutral-400">
          Manage your profile information and account preferences.
        </p>
      </motion.div>

      <div className="space-y-8">
        {/* Profile Section */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white mb-6">
            Profile Information
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="What should we call you?"
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-transparent focus:ring-2 focus:ring-rose-500 transition-all outline-none"
                disabled={isSaving}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={user.email || ''}
                className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-800/50 text-neutral-500 cursor-not-allowed outline-none"
                disabled
              />
              <p className="mt-1.5 text-sm font-normal text-neutral-500 dark:text-neutral-400">
                Email cannot be changed currently.
              </p>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex items-center justify-center gap-2 px-8 py-3 bg-rose-500 hover:bg-rose-600 disabled:opacity-50 text-white rounded-xl font-medium shadow-lg shadow-rose-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] w-full sm:w-auto"
              >
                {isSaving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>

            {message && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className={`p-4 rounded-xl text-sm font-medium ${
                  message.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                    : 'bg-rose-50 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400'
                }`}
              >
                {message.text}
              </motion.div>
            )}
          </form>
        </section>

        {/* Account Status / Plan */}
        <section className="bg-white dark:bg-neutral-900 rounded-2xl p-6 border border-neutral-200 dark:border-neutral-800 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">
              Subscription Plan
            </h2>
            <span className="px-3 py-1 bg-rose-500/10 text-rose-500 rounded-full text-xs font-bold uppercase tracking-wider">
              Free Tier
            </span>
          </div>
          
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-800">
            <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
              Subscription management is coming soon! You are currently on the Free plan, which includes up to 1 published journey per month.
            </p>
            <div className="flex items-center gap-2 text-sm font-bold text-neutral-400 cursor-not-allowed">
              <span>Compare plans & upgrade</span>
              <span className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-800 rounded text-[10px] uppercase">Coming Soon</span>
            </div>
          </div>
        </section>

        {/* Danger Zone */}
        <section className="bg-rose-50/50 dark:bg-rose-950/20 rounded-2xl p-6 border border-rose-100 dark:border-rose-900/30">
          <h2 className="text-xl font-semibold text-rose-500 mb-6">
            Danger Zone
          </h2>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-rose-900 dark:text-rose-100">
                Delete Account
              </h3>
              <p className="text-xs text-rose-700 dark:text-rose-300">
                Permanently remove your account and all your journeys. This action cannot be undone.
              </p>
            </div>
            <button className="px-6 py-2.5 bg-rose-100 hover:bg-rose-200 text-rose-700 dark:bg-rose-950 dark:hover:bg-rose-900 dark:text-rose-400 rounded-xl font-medium transition-all text-sm border border-rose-200 dark:border-rose-900/50">
              Delete Account
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
