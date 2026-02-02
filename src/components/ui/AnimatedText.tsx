'use client';

import { ReactNode, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedTextProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  className?: string;
  onComplete?: () => void;
  typewriter?: boolean;
}

export default function AnimatedText({ 
  children, 
  delay = 0, 
  duration = 0.8,
  className = '',
  onComplete,
  typewriter = false
}: AnimatedTextProps) {
  const [displayedText, setDisplayedText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  
  const text = typeof children === 'string' ? children : '';
  
  useEffect(() => {
    if (!typewriter || !text) {
      setIsComplete(true);
      return;
    }
    
    let currentIndex = 0;
    const typewriterDelay = delay * 1000;
    const charDelay = 30; // milliseconds per character
    
    const timeout = setTimeout(() => {
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, charDelay);
      
      return () => clearInterval(interval);
    }, typewriterDelay);
    
    return () => clearTimeout(timeout);
  }, [text, typewriter, delay, onComplete]);
  
  useEffect(() => {
    if (isComplete && !typewriter) {
      onComplete?.();
    }
  }, [isComplete, typewriter, onComplete]);
  
  if (typewriter && text) {
    return (
      <motion.div
        className={className}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay, duration: 0.3 }}
      >
        {displayedText}
        {!isComplete && <span className="animate-pulse">|</span>}
      </motion.div>
    );
  }
  
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: 'easeOut' }}
      onAnimationComplete={() => {
        setIsComplete(true);
        onComplete?.();
      }}
    >
      {children}
    </motion.div>
  );
}

export function FadeInContainer({ 
  children, 
  delay = 0,
  className = ''
}: { 
  children: ReactNode; 
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, delay }}
    >
      {children}
    </motion.div>
  );
}
