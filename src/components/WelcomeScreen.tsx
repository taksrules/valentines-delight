'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AnimatedText from './ui/AnimatedText';
import Button from './ui/Button';
import { valentineConfig, formatMessage } from '../app/config';

interface WelcomeScreenProps {
  onStart: () => void;
  retryCount: number;
}

export default function WelcomeScreen({ onStart, retryCount }: WelcomeScreenProps) {
  const [showButton, setShowButton] = useState(false);
  
  const welcomeMessage = formatMessage(
    valentineConfig.customMessages.welcome,
    { recipientName: valentineConfig.recipientName }
  );
  
  const retryMessage = retryCount > 0 
    ? `Let's take this journey together... again 💭\n\n(Attempt ${retryCount + 1})`
    : null;
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10">
      <motion.div 
        className="max-w-2xl w-full text-center space-y-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        {/* Floating hearts decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl opacity-20"
              style={{
                left: `${20 + i * 20}%`,
                top: `${10 + i * 15}%`
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, -10, 0]
              }}
              transition={{
                duration: 3 + i,
                repeat: Infinity,
                ease: 'easeInOut'
              }}
            >
              💕
            </motion.div>
          ))}
        </div>
        
        <AnimatedText delay={0.3} duration={1}>
          <h1 className="text-5xl md:text-7xl mb-6">
            💖
          </h1>
        </AnimatedText>
        
        <AnimatedText 
          delay={0.8} 
          duration={1}
          onComplete={() => setTimeout(() => setShowButton(true), 500)}
        >
          <div className="space-y-4">
            <p className="text-xl md:text-2xl whitespace-pre-line leading-relaxed">
              {retryMessage || welcomeMessage}
            </p>
          </div>
        </AnimatedText>
        
        {showButton && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="primary" 
              onClick={onStart}
              className="mt-8"
            >
              {retryCount > 0 ? 'Let\'s try again 💕' : 'Start the journey 💕'}
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
