'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/stores/builderStore';
import StepIndicator from '@/components/builder/StepIndicator';
import Step1Occasion from '@/components/builder/Step1Occasion';
import Step2Names from '@/components/builder/Step2Names';
import Step3Questions from '@/components/builder/Step3Questions';
import Step4Photos from '@/components/builder/Step4Photos';
import Step5Settings from '@/components/builder/Step5Settings';
import Container from '@/components/ui/Container';

interface BuilderClientProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
}

export default function BuilderClient({ user }: BuilderClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const journeyId = searchParams?.get('id');

  const {
    currentStep,
    setStep,
    recipientName,
    questions,
    photos,
    creatorName,
    setCreatorName,
    saveProgress,
    loadJourney,
    publishJourney,
    isSaving,
    lastSaved,
  } = useBuilderStore();

  const [isPublishing, setIsPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState('');

  // Load existing journey if editing
  useEffect(() => {
    if (journeyId) {
      loadJourney(journeyId);
    }
  }, [journeyId, loadJourney]);

  // Set default creator name
  useEffect(() => {
    if (!creatorName && user.name) {
      setCreatorName(user.name);
    }
  }, [user.name, creatorName, setCreatorName]);

  // Auto-save every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (recipientName) {
        saveProgress();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [recipientName, saveProgress]);

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return true; // Occasion is pre-selected
      case 2:
        return recipientName.trim().length >= 2;
      case 3:
        return questions.length === 4;
      case 4:
        return photos.length >= 4 && photos.length <= 6;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = async () => {
    if (!canProceed()) return;

    try {
      // Only save if we have recipient name (after Step 2)
      if (currentStep >= 2 && recipientName) {
        await saveProgress();
      }

      if (currentStep < 5) {
        setStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save progress. Please check the console for details.');
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setStep(currentStep - 1);
    }
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Final save
    await saveProgress();

    // Publish
    const result = await publishJourney();

    setIsPublishing(false);

    if (result.success && result.slug) {
      setPublishedSlug(result.slug);
      setShowSuccessModal(true);
    } else {
      alert(result.error || 'Failed to publish journey');
    }
  };

  const getStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Occasion />;
      case 2:
        return <Step2Names />;
      case 3:
        return <Step3Questions />;
      case 4:
        return <Step4Photos />;
      case 5:
        return <Step5Settings />;
      default:
        return null;
    }
  };

  const getStepHelp = () => {
    switch (currentStep) {
      case 2:
        return 'Recipient name is required';
      case 3:
        return 'You need exactly 4 questions';
      case 4:
        return 'Upload 4-6 photos';
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-12">
      <Container>
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Create Your Journey
          </h1>
          <p className="text-neutral-600 dark:text-neutral-300">
            Follow the steps to create an unforgettable experience
          </p>
        </div>

        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} onStepClick={setStep} />

        {/* Auto-save Indicator */}
        <div className="flex justify-center mb-6">
          {isSaving ? (
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </div>
          ) : lastSaved ? (
            <div className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
              <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Saved {formatTimeSince(lastSaved)}</span>
            </div>
          ) : null}
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {getStepComponent()}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="mt-12 flex items-center justify-between max-w-4xl mx-auto">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              currentStep === 1
                ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-400 dark:text-neutral-600 cursor-not-allowed'
                : 'bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
            }`}
          >
            ← Back
          </button>

          <div className="flex items-center gap-4">
            {!canProceed() && getStepHelp() && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {getStepHelp()}
              </span>
            )}

            {currentStep < 5 ? (
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  canProceed()
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-500 cursor-not-allowed'
                }`}
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handlePublish}
                disabled={isPublishing || !canProceed()}
                className={`px-8 py-3 rounded-lg font-medium transition-colors ${
                  canProceed() && !isPublishing
                    ? 'bg-rose-500 hover:bg-rose-600 text-white'
                    : 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 cursor-not-allowed'
                }`}
              >
                {isPublishing ? 'Publishing...' : '🎉 Publish Journey'}
              </button>
            )}
          </div>
        </div>
      </Container>

      {/* Success Modal */}
      {showSuccessModal && (
        <SuccessModal
          slug={publishedSlug}
          onClose={() => {
            setShowSuccessModal(false);
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}

// Success Modal Component
function SuccessModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const link = `https://emotionalmoments.app/j/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-neutral-900 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      >
        <div className="text-center mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Your Journey is Live!
          </h2>
          <p className="text-neutral-600 dark:text-neutral-300">
            Share this link with your special someone
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Share Link
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={link}
              readOnly
              className="flex-1 px-4 py-3 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-lg text-neutral-900 dark:text-neutral-100 font-mono text-sm"
            />
            <button
              onClick={handleCopy}
              className="px-4 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors"
            >
              {copied ? '✓' : 'Copy'}
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3 bg-neutral-200 dark:bg-neutral-800 hover:bg-neutral-300 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-lg font-medium transition-colors"
          >
            View Dashboard
          </button>
          <button
            onClick={() => window.open(`/j/${slug}`, '_blank')}
            className="flex-1 px-6 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-lg font-medium transition-colors"
          >
            Preview Journey
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Helper function
function formatTimeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  return `${hours}h ago`;
}
