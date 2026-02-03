'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { MemoryPhoto } from '../app/types';
import AnimatedText from './ui/AnimatedText';

interface MemoryRevealProps {
  photos: MemoryPhoto[];
  onComplete: () => void;
}

export default function MemoryReveal({ photos, onComplete }: MemoryRevealProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [allRevealed, setAllRevealed] = useState(false);
  
  useEffect(() => {
    if (currentPhotoIndex < photos.length) {
      const timer = setTimeout(() => {
        setCurrentPhotoIndex(prev => prev + 1);
      }, 2500); // Show each photo for 2.5 seconds
      
      return () => clearTimeout(timer);
    } else if (currentPhotoIndex === photos.length && !allRevealed) {
      setAllRevealed(true);
      setTimeout(onComplete, 2000); // Wait 2 seconds after all photos shown
    }
  }, [currentPhotoIndex, photos.length, allRevealed, onComplete]);
  
  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative z-10 bg-gradient-to-br from-cream-50 via-rose-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
      <motion.div 
        className="max-w-4xl w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        <AnimatedText delay={0.3} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl mb-4 text-neutral-800 dark:text-neutral-100">
            Remember these moments? 💭
          </h2>
          <p className="text-xl text-neutral-600 dark:text-neutral-200">
            Each one special in its own way...
          </p>
        </AnimatedText>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
          <AnimatePresence>
            {photos.slice(0, currentPhotoIndex).map((photo, index) => (
              <motion.div
                key={photo.id}
                className="relative"
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ 
                  opacity: 1, 
                  scale: 1, 
                  rotate: index % 2 === 0 ? 2 : -2 
                }}
                transition={{ 
                  duration: 0.8,
                  ease: 'easeOut'
                }}
              >
                {/* Polaroid-style frame */}
                <div className="bg-white dark:bg-neutral-900 p-4 shadow-2xl rounded-lg transform hover:scale-105 transition-transform duration-300 dark:shadow-neutral-900/50">
                  <div className="aspect-square bg-gradient-to-br from-rose-100 to-pink-100 dark:from-neutral-800 dark:to-neutral-800 rounded overflow-hidden mb-4 relative">
                    <Image
                      src={photo.url}
                      alt={photo.caption}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  <p className="text-center font-romantic text-xl text-neutral-700 dark:text-neutral-200">
                    {photo.caption}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        
        {allRevealed && (
          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-2xl text-rose-500 dark:text-rose-300 font-romantic">
              So many beautiful memories together... ✨
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
