'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [view, setView] = useState<'main' | 'preferences'>('main');
  const [preferences, setPreferences] = useState({
    essential: true,
    analytical: true,
  });

  useEffect(() => {
    const consent = localStorage.getItem('tenderly-cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    } else {
      try {
        const saved = JSON.parse(consent);
        if (typeof saved === 'object') setPreferences(saved);
      } catch (e) {
        // Fallback for old simple string consent
      }
    }
  }, []);

  const handleSave = (prefs = preferences) => {
    localStorage.setItem('tenderly-cookie-consent', JSON.stringify(prefs));
    setIsVisible(false);
  };

  const handleAcceptAll = () => {
    const allOn = { essential: true, analytical: true };
    setPreferences(allOn);
    handleSave(allOn);
  };

  const handleRejectAll = () => {
    const minimal = { essential: true, analytical: false };
    setPreferences(minimal);
    handleSave(minimal);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={`fixed bottom-0 left-0 right-0 z-[100] w-full bg-[#0a0a0a]/95 backdrop-blur-[12px] border-t border-white/10 transition-all duration-500 ${
            view === 'preferences' ? 'h-auto py-8' : 'h-[220px] sm:h-[80px]'
          }`}
        >
          <div className="max-w-7xl mx-auto px-6 h-full">
            {view === 'main' ? (
              <div className="h-full flex flex-col sm:flex-row items-center justify-center sm:justify-between gap-6 sm:gap-8">
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-sm font-bold text-white mb-1">
                    We use cookies to improve your experience
                  </h3>
                  <p className="text-neutral-400 text-xs leading-relaxed max-w-2xl">
                    We use cookies for authentication and analytics. Read our <Link href="/privacy" className="text-rose-400 hover:text-rose-300 transition-colors underline underline-offset-4">Privacy Policy</Link> for details.
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleRejectAll}
                    className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg border border-white/20 text-neutral-200 hover:bg-white/5 transition-colors whitespace-nowrap min-w-[120px]"
                  >
                    Reject All
                  </button>
                  <button
                    onClick={() => setView('preferences')}
                    className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg border border-white/20 text-neutral-200 hover:bg-white/5 transition-colors whitespace-nowrap min-w-[120px]"
                  >
                    Customize
                  </button>
                  <button
                    onClick={handleAcceptAll}
                    className="flex-1 sm:flex-none px-6 py-2 text-sm font-medium rounded-lg bg-rose-500 text-white hover:bg-rose-600 transition-colors whitespace-nowrap min-w-[120px]"
                  >
                    Accept All
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-8 max-w-3xl mx-auto">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-white">Cookie Preferences</h3>
                  <button 
                    onClick={() => setView('main')}
                    className="text-neutral-400 hover:text-white text-sm"
                  >
                    Back
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Essential */}
                  <div className="flex items-center justify-between gap-6 p-4 rounded-xl bg-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Essential Cookies</h4>
                      <p className="text-neutral-400 text-xs">Necessary for the website to function. Cannot be disabled.</p>
                    </div>
                    <div className="w-12 h-6 rounded-full bg-rose-500/50 flex items-center px-1 cursor-not-allowed">
                      <div className="w-4 h-4 rounded-full bg-white translate-x-6" />
                    </div>
                  </div>

                  {/* Analytical */}
                  <div className="flex items-center justify-between gap-6 p-4 rounded-xl bg-white/5">
                    <div>
                      <h4 className="text-sm font-bold text-white mb-1">Analytical Cookies</h4>
                      <p className="text-neutral-400 text-xs">Allows us to see how creators and recipients interact with the platform.</p>
                    </div>
                    <button 
                      onClick={() => setPreferences(p => ({ ...p, analytical: !p.analytical }))}
                      className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${
                        preferences.analytical ? 'bg-rose-500' : 'bg-neutral-600'
                      }`}
                    >
                      <motion.div 
                        animate={{ x: preferences.analytical ? 24 : 0 }}
                        className="w-4 h-4 rounded-full bg-white" 
                      />
                    </button>
                  </div>
                </div>

                <div className="flex justify-end gap-4 border-t border-white/10 pt-6">
                  <button
                    onClick={() => setView('main')}
                    className="px-6 py-2 text-sm font-medium text-neutral-400 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleSave()}
                    className="px-8 py-2 text-sm font-bold bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-all"
                  >
                    Save Preferences
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
