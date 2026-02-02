'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import Button from './ui/Button';
import ProgressIndicator from './ui/ProgressIndicator';
import { MemoryQuestion as MemoryQuestionType } from '../app/types';

interface MemoryQuestionProps {
  question: MemoryQuestionType;
  questionIndex: number;
  totalQuestions: number;
  onAnswer: (answer: string) => void;
}

export default function MemoryQuestion({ 
  question, 
  questionIndex, 
  totalQuestions,
  onAnswer 
}: MemoryQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showAcknowledgment, setShowAcknowledgment] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswer(answer);
    setShowAcknowledgment(true);
    setTimeout(() => setShowContinue(true), 1500);
  };
  
  const handleContinue = () => {
    if (selectedAnswer) {
      onAnswer(selectedAnswer);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <motion.div 
        className="max-w-3xl w-full space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
      >
        <ProgressIndicator 
          current={questionIndex} 
          total={totalQuestions}
          className="mb-8"
        />
        
        <AnimatedText delay={0.3} className="text-center">
          <p className="text-xl md:text-2xl text-rose-400 italic mb-4">
            {question.prompt}
          </p>
        </AnimatedText>
        
        <AnimatedText delay={0.6} className="text-center">
          <h2 className="text-3xl md:text-4xl mb-8">
            {question.question}
          </h2>
        </AnimatedText>
        
        {!showAcknowledgment && (
          <motion.div 
            className="grid gap-4 mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {question.answers.map((answer, index) => (
              <motion.button
                key={index}
                className="p-6 rounded-2xl bg-white/50 backdrop-blur-sm border-2 border-rose-200 hover:border-rose-400 hover:bg-rose-50/50 transition-all duration-300 text-left text-lg"
                onClick={() => handleAnswerSelect(answer)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.02, x: 10 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-rose-400 mr-3">❤️</span>
                {answer}
              </motion.button>
            ))}
          </motion.div>
        )}
        
        {showAcknowledgment && (
          <motion.div
            className="text-center space-y-6 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-2xl md:text-3xl text-rose-500 font-romantic">
              {question.acknowledgment}
            </p>
            
            {showContinue && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <Button onClick={handleContinue}>
                  Continue →
                </Button>
              </motion.div>
            )}
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
