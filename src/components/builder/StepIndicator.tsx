'use client';

import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

const steps = [
  { number: 1, label: 'Occasion' },
  { number: 2, label: 'Names' },
  { number: 3, label: 'Questions' },
  { number: 4, label: 'Photos' },
  { number: 5, label: 'Settings' },
];

export default function StepIndicator({ currentStep, onStepClick }: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center flex-1">
            {/* Step Circle */}
            <button
              onClick={() => onStepClick?.(step.number)}
              disabled={step.number > currentStep}
              className={`relative flex flex-col items-center group ${
                step.number > currentStep ? 'cursor-not-allowed' : 'cursor-pointer'
              }`}
            >
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === step.number ? 1.1 : 1,
                }}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  currentStep === step.number
                    ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/50'
                    : currentStep > step.number
                    ? 'bg-rose-100 text-rose-600 dark:bg-rose-500/20 dark:text-rose-400'
                    : 'bg-neutral-200 text-neutral-400 dark:bg-neutral-800 dark:text-neutral-600'
                }`}
              >
                {currentStep > step.number ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  step.number
                )}
              </motion.div>
              
              {/* Step Label */}
              <span
                className={`mt-2 text-xs font-medium transition-colors ${
                  currentStep === step.number
                    ? 'text-rose-600 dark:text-rose-400'
                    : currentStep > step.number
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-400 dark:text-neutral-600'
                }`}
              >
                {step.label}
              </span>
            </button>

            {/* Connector Line */}
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-2 relative">
                <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />
                <motion.div
                  initial={false}
                  animate={{
                    scaleX: currentStep > step.number ? 1 : 0,
                  }}
                  transition={{ duration: 0.3 }}
                  className="absolute inset-0 bg-rose-500 origin-left"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
