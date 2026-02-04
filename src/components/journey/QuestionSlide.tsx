'use client';

import { motion } from 'framer-motion';
import { getOccasionTheme, getGradientClasses, getPrimaryColor } from '@/lib/occasion-themes';
import ProgressIndicator from '@/components/ui/ProgressIndicator';

interface QuestionSlideProps {
  question: {
    questionText: string;
    option1: string;
    option2: string;
    option3: string;
    option4: string | null;
    acknowledgmentText: string;
  };
  questionNumber: number;
  totalQuestions: number;
  occasionType: string;
  selectedAnswer?: string;
  onAnswer: (answer: string) => void;
  onPrevious: () => void;
}

export default function QuestionSlide({
  question,
  questionNumber,
  totalQuestions,
  occasionType,
  selectedAnswer,
  onAnswer,
  onPrevious,
}: QuestionSlideProps) {
  const theme = getOccasionTheme(occasionType);
  const gradientClasses = getGradientClasses(occasionType);
  const primaryColor = getPrimaryColor(occasionType);
  
  const options = [
    question.option1,
    question.option2,
    question.option3,
    question.option4,
  ].filter((opt): opt is string => opt !== null);

  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative z-10 ${gradientClasses}`}>
      <motion.div
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        className="max-w-2xl w-full"
      >
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-2xl p-8 md:p-12">
          <ProgressIndicator 
            current={questionNumber - 1} 
            total={totalQuestions} 
            className="mb-8"
          />

          <h2 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-8">
            {question.questionText}
          </h2>

          <div className="space-y-3 mb-6">
            {options.map((option, index) => (
              <button
                key={index}
                onClick={() => onAnswer(option)}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  selectedAnswer === option
                    ? `bg-${primaryColor}-500 text-white shadow-lg scale-105`
                    : 'bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {option}
              </button>
            ))}
          </div>

          {selectedAnswer && question.acknowledgmentText && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 bg-${primaryColor}-50 dark:bg-${primaryColor}-500/10 rounded-xl text-${primaryColor}-900 dark:text-${primaryColor}-300`}
            >
              {question.acknowledgmentText}
            </motion.div>
          )}

          {questionNumber > 1 && (
            <button
              onClick={onPrevious}
              className="mt-6 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 text-sm"
            >
              ← Previous
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
