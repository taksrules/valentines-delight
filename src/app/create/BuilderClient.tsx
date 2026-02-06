'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { useBuilderStore } from '@/stores/builderStore';
import StepIndicator from '@/components/builder/StepIndicator';
import { QRCodeCanvas } from 'qrcode.react';
import Step1Occasion from '@/components/builder/Step1Occasion';
import Step2Names from '@/components/builder/Step2Names';
import Step3Questions from '@/components/builder/Step3Questions';
import Step4Photos from '@/components/builder/Step4Photos';
import Step5Settings from '@/components/builder/Step5Settings';
import Container from '@/components/ui/Container';
import { PageLoader } from '@/components/ui/Loader';
import Button from '@/components/ui/Button'; // Assuming I want to swap existing buttons to my Button component
import { InvisibleTurnstile } from '@/components/ui/InvisibleTurnstile';

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
  const [isInitialLoading, setIsInitialLoading] = useState(!!journeyId);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [publishedSlug, setPublishedSlug] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);

  // Load existing journey if editing
  useEffect(() => {
    if (journeyId) {
      setIsInitialLoading(true);
      loadJourney(journeyId).finally(() => setIsInitialLoading(false));
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
      // Only auto-save if already created or if we have a token (rare case for auto-save)
      if (recipientName && (journeyId || turnstileToken)) {
        saveProgress(turnstileToken || undefined);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [recipientName, saveProgress, journeyId, turnstileToken]);

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

  const handleNext = async (token?: string) => {
    if (!canProceed()) return;

    try {
      // If first save (creating journey) and no token provided, trigger Turnstile
      if (currentStep >= 2 && recipientName && !journeyId && !token && !turnstileToken) {
        setShowTurnstile(true);
        return;
      }

      // Only save if we have recipient name (after Step 2)
      if (currentStep >= 2 && recipientName) {
        await saveProgress(token || turnstileToken || undefined);
      }

      if (currentStep < 5) {
        setStep(currentStep + 1);
      }
    } catch (error) {
      console.error('Error saving progress:', error);
      alert('Failed to save progress. Please check the console for details.');
      setTurnstileToken(null);
      setShowTurnstile(false);
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
    await saveProgress(turnstileToken || undefined);

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

  if (isInitialLoading) {
    return <PageLoader />;
  }

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
              <span>Saved {formatTimeSince(lastSaved as Date)}</span>
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
          <Button
            onClick={handleBack}
            disabled={currentStep === 1}
            variant="secondary"
          >
            ← Back
          </Button>

          <div className="flex items-center gap-4">
            {!canProceed() && getStepHelp() && (
              <span className="text-sm text-neutral-600 dark:text-neutral-400">
                {getStepHelp()}
              </span>
            )}

            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                isLoading={isSaving}
              >
                Continue →
              </Button>
            ) : (
              <Button
                onClick={handlePublish}
                disabled={!canProceed()}
                isLoading={isPublishing || isSaving}
              >
                🎉 Publish Journey
              </Button>
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

        {/* Invisible Turnstile */}
        {showTurnstile && (
          <InvisibleTurnstile
            action="create_journey"
            onVerify={(token: string) => {
              setTurnstileToken(token);
              setShowTurnstile(false);
              handleNext(token);
            }}
            onError={(error: string) => {
              alert(error);
              setShowTurnstile(false);
            }}
          />
        )}
      </div>
  );
}

// Success Modal Component
function SuccessModal({ slug, onClose }: { slug: string; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const link = `${window.location.origin}/j/${slug}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code') as HTMLCanvasElement;
    if (canvas) {
      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.download = `qr-code-${slug}.png`;
      a.href = url;
      a.click();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-white dark:bg-neutral-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-rose-100 dark:border-neutral-800"
      >
        <div className="text-center mb-8">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
            Your Journey is Live!
          </h2>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm">
            Share this link to start the magic
          </p>
        </div>

        <div className="space-y-6">
          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-6 bg-rose-50 dark:bg-neutral-950 rounded-2xl border border-rose-100 dark:border-neutral-800">
            <QRCodeCanvas
              id="qr-code"
              value={link}
              size={160}
              level="H"
              includeMargin={true}
              imageSettings={{
                src: "/favicon.png", // Attempt to use favicon as logo in center
                x: undefined,
                y: undefined,
                height: 24,
                width: 24,
                excavate: true,
              }}
              className="rounded-lg shadow-sm"
            />
            <button 
              onClick={downloadQRCode}
              className="mt-4 text-xs font-medium text-rose-500 hover:text-rose-600 dark:text-rose-400 underline decoration-rose-200 underline-offset-4"
            >
              Download QR Code
            </button>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
              Share Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={link}
                readOnly
                className="flex-1 px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-xl text-neutral-900 dark:text-neutral-100 font-mono text-xs overflow-hidden text-ellipsis"
              />
              <button
                onClick={handleCopy}
                className="px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-medium transition-colors shadow-lg shadow-rose-200 dark:shadow-none"
              >
                {copied ? '✓' : 'Copy'}
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-3">
          <button
            onClick={onClose}
            className="px-4 py-3 bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100 rounded-xl text-sm font-semibold transition-colors"
          >
            Dashboard
          </button>
          <button
            onClick={() => window.open(`/j/${slug}`, '_blank')}
            className="px-4 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-neutral-100 rounded-xl text-sm font-semibold transition-colors"
          >
            Preview
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
