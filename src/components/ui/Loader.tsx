'use client';

import { motion } from 'framer-motion';

export function Spinner({ size = 'md', color = 'rose' }: { size?: 'sm' | 'md' | 'lg', color?: 'rose' | 'white' | 'neutral' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  const colorClasses = {
    rose: 'border-rose-500 border-t-transparent',
    white: 'border-white border-t-transparent',
    neutral: 'border-neutral-300 dark:border-neutral-700 border-t-transparent',
  };

  return (
    <div 
      className={`rounded-full animate-spin ${sizeClasses[size]} ${colorClasses[color]}`} 
      role="status"
    >
      <span className="sr-only">Loading...</span>
    </div>
  );
}

export function Skeleton({ className = '' }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-md ${className}`} />
  );
}

export function SkeletonCircle({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | number, className?: string }) {
  const sizeValue = typeof size === 'number' ? `${size}px` : {
    sm: '32px',
    md: '48px',
    lg: '64px',
  }[size];

  return (
    <div 
      className={`animate-pulse bg-neutral-200 dark:bg-neutral-800 rounded-full ${className}`}
      style={{ width: sizeValue, height: sizeValue }}
    />
  );
}

export function PageLoader() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-cream-50/80 dark:bg-neutral-950/80 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="flex flex-col items-center"
      >
        <div className="relative mb-6">
          <Spinner size="lg" />
          <div className="absolute inset-0 flex items-center justify-center text-2xl">
            💕
          </div>
        </div>
        <p className="text-neutral-600 dark:text-neutral-300 font-medium animate-pulse">
          Preparing your moments...
        </p>
      </motion.div>
    </div>
  );
}

export function Shimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`shimmer bg-neutral-200 dark:bg-neutral-800 ${className}`} />
  );
}

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';

export function ShimmerImage({ src, alt, className = '', ...props }: ImageProps & { className?: string }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Safety: forced load state if event fails
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className={`overflow-hidden bg-neutral-100 dark:bg-neutral-900 ${props.fill ? 'absolute inset-0' : 'relative'} ${className}`}>
      {/* Shimmer Overlay on top */}
      {!isLoaded && !error && (
        <div className="shimmer absolute inset-0 z-10 pointer-events-none" />
      )}
      
      {error ? (
        <div className="absolute inset-0 flex items-center justify-center bg-neutral-100 dark:bg-neutral-800 text-neutral-400">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      ) : (
        <Image
          src={src}
          alt={alt}
          className={`${className} transition-opacity duration-500`}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
    </div>
  );
}
