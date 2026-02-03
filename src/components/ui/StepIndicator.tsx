"use client";

import { motion } from "framer-motion";

interface Step {
  label: string;
  description?: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export default function StepIndicator({ steps, currentStep, className = "" }: StepIndicatorProps) {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isPending = index > currentStep;

          return (
            <div key={index} className="flex items-center flex-1">
              {/* Step circle and label */}
              <div className="flex flex-col items-center">
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: isActive ? 1.1 : 1 }}
                  className={`
                    w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm
                    transition-all duration-300 border-2
                    ${isCompleted 
                      ? "bg-rose-500 border-rose-500 text-white dark:bg-rose-400 dark:border-rose-400 dark:text-neutral-950" 
                      : isActive 
                        ? "bg-rose-500 border-rose-500 text-white dark:bg-rose-400 dark:border-rose-400 dark:text-neutral-950 shadow-lg shadow-rose-200 dark:shadow-rose-900/30" 
                        : "bg-neutral-100 dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-400 dark:text-neutral-500"
                    }
                  `}
                >
                  {isCompleted ? (
                    <motion.svg
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </motion.svg>
                  ) : (
                    index + 1
                  )}
                </motion.div>
                <div className="mt-2 text-center">
                  <p className={`text-xs font-medium ${
                    isActive || isCompleted 
                      ? "text-neutral-800 dark:text-neutral-100" 
                      : "text-neutral-400 dark:text-neutral-500"
                  }`}>
                    {step.label}
                  </p>
                  {step.description && (
                    <p className={`text-xs mt-0.5 ${
                      isActive || isCompleted 
                        ? "text-neutral-500 dark:text-neutral-400" 
                        : "text-neutral-300 dark:text-neutral-600"
                    }`}>
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting line (except for last step) */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3 h-0.5 relative -mt-6">
                  <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.4, ease: "easeInOut" }}
                    className="absolute inset-0 bg-rose-500 dark:bg-rose-400 rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
