'use client';

import { motion } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import Button from './ui/Button';
import { valentineConfig } from '../app/config';

interface BigQuestionProps {
  onYes: () => void;
  onNo: () => void;
  retryCount: number;
}

export default function BigQuestion({ onYes, onNo, retryCount }: BigQuestionProps) {
  const subtext = retryCount > 0 
    ? `We've been through this ${retryCount} time${retryCount > 1 ? 's' : ''} already...`
    : 'After everything we\'ve shared...';
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10 bg-gradient-to-br from-cream-50 via-rose-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
      <motion.div 
        className="max-w-2xl w-full text-center space-y-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating hearts background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-3xl opacity-10 dark:opacity-20"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`
              }}
              animate={{
                y: [0, -30, 0],
                x: [0, Math.random() * 20 - 10, 0],
                rotate: [0, 360]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.2
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
        
        <AnimatedText delay={0.3} className="mb-6">
          <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-200 italic">
            {subtext}
          </p>
        </AnimatedText>
        
        <AnimatedText delay={0.8}>
          <h1 className="text-5xl md:text-7xl mb-8 text-neutral-800 dark:text-neutral-100">
            {valentineConfig.customMessages.bigQuestion}
          </h1>
        </AnimatedText>
        
        <motion.div
          className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.5, duration: 0.6 }}
        >
          <Button 
            variant="primary" 
            onClick={onYes}
            className="order-1 sm:order-1"
          >
            Yes! 💕
          </Button>
          
          <Button 
            variant="secondary" 
            onClick={onNo}
            className="order-2 sm:order-2 text-sm"
          >
            {retryCount > 0 ? 'Not yet...' : 'No...'}
          </Button>
        </motion.div>
        
        {retryCount > 0 && (
          <motion.p
            className="text-sm text-neutral-400 dark:text-neutral-400 mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2 }}
          >
            (You know you want to say yes 😊)
          </motion.p>
        )}
      </motion.div>
    </div>
  );
}
