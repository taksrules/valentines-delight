'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { ShimmerImage } from './ui/Loader';
import confetti from 'canvas-confetti';
import AnimatedText from './ui/AnimatedText';
import Button from './ui/Button';
import { getOccasionTheme, formatMessage, getGradientClasses } from '@/lib/occasion-themes';
import { MemoryPhoto } from '../app/types';
import { useRef } from 'react';
import Link from 'next/link';
import { showError, showInfo, showSuccess } from '@/lib/notifications';

interface CelebrationScreenProps {
  journeyId?: string | null;
  recipientName: string;
  creatorName: string | null;
  occasionType: string;
  photos: MemoryPhoto[];
  successPhotoUrl?: string | null;
  referralCode?: string | null;
  allowSharing?: boolean;
  retryCount: number;
  onReplay?: () => void;
  isDemo?: boolean;
}

export default function CelebrationScreen({ 
  journeyId,
  recipientName, 
  creatorName, 
  occasionType, 
  photos, 
  successPhotoUrl,
  referralCode,
  allowSharing = true,
  retryCount, 
  onReplay,
  isDemo = false
}: CelebrationScreenProps) {
  const [showButtons, setShowButtons] = useState(false);
  const [showPhotos, setShowPhotos] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [shareReadyFile, setShareReadyFile] = useState<File | null>(null);
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

  const handleShare = async () => {
    if (!journeyId) {
      showInfo('Sharing is for live journeys', 'Publish your journey first to generate a high-res share card.');
      return;
    }

    // If we already have the file, trigger native share immediately (direct user gesture)
    if (shareReadyFile && navigator.share && navigator.canShare && navigator.canShare({ files: [shareReadyFile] })) {
      try {
        await navigator.share({
          files: [shareReadyFile],
          title: 'My Tenderly Moment 💕',
          text: 'Look at this beautiful journey we shared! Create yours at tenderly.app',
        });
        showSuccess('Shared! 💕', 'Your moment has been shared.');
        return;
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Share failed:', err);
        }
      }
    }
    
    // Otherwise, generate it first
    setIsGenerating(true);
    try {
      const response = await fetch(`/api/v1/journeys/${journeyId}/share-card`);

      if (!response.ok) throw new Error('Generation failed');

      const blob = await response.blob();
      const file = new File([blob], `tenderly-moment-${referralCode || 'share'}.png`, { type: 'image/png' });
      setShareReadyFile(file);
      
      // Auto-trigger download as fallback/success indicator
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `tenderly-moment-${referralCode || 'share'}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      showSuccess('Moment captured! 📸', 'Your high-res memory is ready to share.');
    } catch (err) {
      console.error('Failed to generate sharing card:', err);
      showError('Couldn\'t capture moment', 'We had trouble generating your share card. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  
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
            scale: [1, 1.05, 1],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="relative inline-block"
        >
          {successPhotoUrl ? (
            <div className="relative mb-8">
              {/* Decorative background for the photo */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-400 to-pink-500 rounded-2xl blur-xl opacity-20 animate-pulse" />
              
              <div className="relative bg-white dark:bg-neutral-900 p-4 shadow-2xl rounded-2xl rotate-2 transform hover:rotate-0 transition-transform duration-500">
                <div className="relative w-48 h-48 md:w-64 md:h-64 rounded-xl overflow-hidden mb-2">
                  <ShimmerImage
                    src={successPhotoUrl}
                    alt="Success!"
                    fill
                    className="object-cover"
                  />
                </div>
                {creatorName && (
                  <p className="font-romantic text-2xl text-rose-500 dark:text-rose-400 mt-2">
                    {creatorName} 💕
                  </p>
                )}
              </div>
              
              {/* Extra hearts around the photo */}
              <motion.span 
                className="absolute -top-4 -right-4 text-4xl"
                animate={{ y: [-10, 10, -10] }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <motion.span 
                className="absolute -bottom-4 -left-4 text-4xl"
                animate={{ y: [10, -10, 10] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                💖
              </motion.span>
            </div>
          ) : (
            <h1 className="text-6xl md:text-8xl mb-8">
              🎉 💕 🎉
            </h1>
          )}
        </motion.div>
        
        <AnimatedText delay={0.5} duration={1}>
          <h2 className="text-4xl md:text-5xl mb-6 text-neutral-800 dark:text-neutral-100 font-romantic">
            You said YES!
          </h2>
        </AnimatedText>
        
        <AnimatedText delay={1.2} duration={1}>
          <p className="text-xl md:text-2xl whitespace-pre-line leading-relaxed text-neutral-700 dark:text-neutral-200 font-romantic">
            {message}
          </p>
          {retryCount > 0 && (
            <p className="text-lg text-rose-400 dark:text-rose-300 italic mt-4">
              {retryCount >= 3 
                ? "I never doubted you for a second 😉" 
                : "Worth the wait! 😊"}
            </p>
          )}
        </AnimatedText>
        
        
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
                      <ShimmerImage
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
        {showButtons && (
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {onReplay && (
                <Button 
                  variant="secondary" 
                  onClick={onReplay}
                  className="text-sm"
                >
                  Experience it again ↻
                </Button>
              )}

              {allowSharing && (
                <Button
                  variant={shareReadyFile ? "primary" : "outline"}
                  onClick={handleShare}
                  isLoading={isGenerating}
                  className={`text-sm ${!shareReadyFile ? 'border-rose-300 text-rose-600 hover:bg-rose-50' : 'shadow-lg shadow-rose-500/20'}`}
                >
                  {shareReadyFile ? 'Share to Socials 📱' : 'Capture This Moment 📸'}
                </Button>
              )}
            </motion.div>
          )}

        {isDemo && showButtons && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-16 mx-auto max-w-lg p-8 bg-white/95 backdrop-blur-md rounded-2xl border-2 border-rose-100 shadow-xl dark:bg-neutral-900/90 dark:border-rose-500/20"
          >
            <div className="space-y-4">
              <h3 className="text-2xl font-romantic text-rose-500 dark:text-rose-400">
                Want to create your own moment? 💕
              </h3>
              <p className="text-neutral-600 dark:text-neutral-300">
                Build your personalized journey and share it with your special someone in just 5 minutes.
              </p>
              <Link href="/sign-up" className="block pt-2">
                <Button variant="primary" className="w-full py-4 text-lg shadow-lg shadow-rose-500/20">
                  Create Your Journey — Free
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
