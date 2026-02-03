'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import confetti from 'canvas-confetti';
import AnimatedText from './ui/AnimatedText';
import Button from './ui/Button';
import { getOccasionTheme, formatMessage, getGradientClasses } from '@/lib/occasion-themes';
import { MemoryPhoto } from '../app/types';

interface CelebrationScreenProps {
  recipientName: string;
  creatorName: string | null;
  occasionType: string;
  photos: MemoryPhoto[];
  retryCount: number;
  onReplay?: () => void;
}

export default function CelebrationScreen({ recipientName, creatorName, occasionType, photos, retryCount, onReplay }: CelebrationScreenProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const theme = getOccasionTheme(occasionType);
  const gradientClasses = getGradientClasses(occasionType);
  
  const isFirstTime = retryCount === 0;
  
  const message = isFirstTime 
    ? theme.celebrationMessage
    : theme.retryMessage;
  
  useEffect(() => {
    // Trigger confetti
    const duration = isFirstTime ? 3000 : 5000;
    const end = Date.now() + duration;
    
    const colors = ['#f43f5e', '#fb7185', '#f9a8d4', '#fda4af'];
    
    const frame = () => {
      confetti({
        particleCount: isFirstTime ? 3 : 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      
      confetti({
        particleCount: isFirstTime ? 3 : 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });
      
      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    
    frame();
    
    // Show photos after initial celebration
    setTimeout(() => setShowPhotos(true), duration + 1000);
    
    // Show buttons after photos
    setTimeout(() => setShowButtons(true), duration + 3000);
  }, [isFirstTime]);
  
  return (
    <div className={`min-h-screen flex items-center justify-center p-6 relative z-10 ${gradientClasses}`}>
      <motion.div 
        className="max-w-4xl w-full text-center space-y-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
      >
        {/* Floating hearts animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-4xl"
              style={{
                left: `${Math.random() * 100}%`,
                bottom: '-10%'
              }}
              animate={{
                y: [0, -window.innerHeight * 1.2],
                x: [0, (Math.random() - 0.5) * 100],
                rotate: [0, 360],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 4 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: 'easeOut'
              }}
            >
              {['💕', '❤️', '💖', '✨'][i % 4]}
            </motion.div>
          ))}
        </div>
        
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 1,
            repeat: 3,
            ease: 'easeInOut'
          }}
        >
          <h1 className="text-6xl md:text-8xl mb-8">
            🎉 💕 🎉
          </h1>
        </motion.div>
        
        <AnimatedText delay={0.5} duration={1}>
          <h2 className="text-4xl md:text-5xl mb-6 text-neutral-800 dark:text-neutral-100">
            You said YES!
          </h2>
        </AnimatedText>
        
        <AnimatedText delay={1.2} duration={1}>
          <p className="text-xl md:text-2xl whitespace-pre-line leading-relaxed text-neutral-700 dark:text-neutral-200">
            {message}
          </p>
        </AnimatedText>
        
        {!isFirstTime && retryCount > 0 && (
          <AnimatedText delay={2} duration={0.8}>
            <p className="text-lg text-rose-400 dark:text-rose-300 italic">
              (Worth the wait! 😊)
            </p>
          </AnimatedText>
        )}
        
        {/* Photo Gallery - Shows all the memories again */}
        {showPhotos && (
          <motion.div
            className="mt-16 space-y-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            <h3 className="text-2xl md:text-3xl font-romantic text-rose-500 dark:text-rose-300 mb-8">
              Our Beautiful Memories Together 💕
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
              {photos.map((photo: MemoryPhoto, index: number) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1, 
                    rotate: index % 2 === 0 ? 3 : -3 
                  }}
                  transition={{ 
                    delay: index * 0.2,
                    duration: 0.6,
                    ease: 'easeOut'
                  }}
                  whileHover={{ 
                    scale: 1.1, 
                    rotate: 0,
                    zIndex: 10,
                    transition: { duration: 0.2 }
                  }}
                  className="relative"
                >
                  {/* Polaroid frame */}
                  <div className="bg-white dark:bg-neutral-900 p-3 shadow-xl rounded-lg dark:shadow-neutral-900/50">
                    <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 dark:from-neutral-800 dark:to-neutral-800 rounded overflow-hidden mb-2 relative">
                      <Image
                        src={photo.url}
                        alt={photo.caption}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 25vw"
                      />
                    </div>
                    <p className="text-xs md:text-sm font-romantic text-neutral-700 dark:text-neutral-200 text-center">
                      {photo.caption}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
            
            <motion.p
              className="text-lg text-rose-400 dark:text-rose-300 italic mt-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
            >
              And so many more to come... ✨
            </motion.p>
          </motion.div>
        )}
        
        {showButtons && onReplay && (
          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button 
              variant="secondary" 
              onClick={onReplay}
              className="text-sm"
            >
              Experience it again ↻
            </Button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
