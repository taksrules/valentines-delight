'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import { valentineConfig } from '../app/config';

interface TransitionScreenProps {
  onComplete: () => void;
}

export default function TransitionScreen({ onComplete }: TransitionScreenProps) {
  const [showButton, setShowButton] = useState(false);
  
  const transitionText = valentineConfig.customMessages.transition;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <motion.div 
        className="max-w-2xl w-full text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Dimmed background effect */}
        <motion.div
          className="fixed inset-0 bg-black/10 backdrop-blur-sm -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
        
        <AnimatedText 
          delay={0.5} 
          typewriter={true}
          onComplete={() => setTimeout(() => setShowButton(true), 1000)}
          className="text-2xl md:text-3xl whitespace-pre-line leading-relaxed"
        >
          {transitionText}
        </AnimatedText>
        
        {showButton && (
          <motion.div
            className="mt-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <motion.button
              onClick={onComplete}
              className="text-rose-500 text-xl hover:text-rose-600 transition-colors"
              animate={{ 
                scale: [1, 1.05, 1],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              I'm ready... 💕
            </motion.button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
