'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingHearts from '@/components/ui/FloatingHearts';
import Button from '@/components/ui/Button';
import Container from '@/components/ui/Container';

export default function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-cream-50 via-rose-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900">
      {/* Subtle gradient overlays */}
      <div className="absolute inset-0 bg-gradient-radial from-rose-100/20 via-transparent to-transparent opacity-50 dark:from-neutral-800/40" />
      
      {/* Floating hearts animation */}
      <FloatingHearts count={12} />
      
      {/* Main content */}
      <Container className="relative z-10 py-16 sm:py-20 lg:py-24 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mx-auto flex max-w-4xl flex-col items-center space-y-6 sm:space-y-8"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm border border-rose-100 dark:border-neutral-800 dark:bg-neutral-900">
            <span className="text-xl">💕</span>
            <span className="text-sm font-medium text-rose-600 dark:text-rose-300">Perfect for Valentine's Day 2025</span>
          </div>

          {/* Headline */}
          <h1 className="font-romantic text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-rose-500 leading-tight tracking-tight dark:text-neutral-100">
            Turn Your Love Story Into An Unforgettable Journey
          </h1>

          {/* Subheadline */}
          <p className="max-w-3xl text-base sm:text-lg md:text-xl text-neutral-700 leading-relaxed dark:text-neutral-200">
            Create a personalized, interactive experience that guides them through your memories before asking the big question
          </p>

          {/* CTA Buttons */}
          <div className="flex w-full flex-col sm:flex-row gap-4 justify-center sm:items-stretch pt-4">
            <Link href="/sign-up" className="block w-full sm:w-auto">
              <Button variant="primary" className="w-full sm:w-auto h-full px-8 py-4 text-base sm:text-lg">
                Create Your Journey – Free
              </Button>
            </Link>
            <Link href="/demo" className="block w-full sm:w-auto">
              <Button variant="secondary" className="w-full sm:w-auto h-full px-8 py-4 text-base sm:text-lg">
                See a Demo
              </Button>
            </Link>
          </div>

          {/* Trust indicators */}
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            ✨ No credit card required • Free forever • Ready in 5 minutes
          </p>
        </motion.div>

        {/* Preview mockup */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 max-w-4xl mx-auto"
        >
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-white/80 bg-white dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-neutral-900/50">
            <div className="aspect-video bg-gradient-to-br from-rose-50 to-pink-50 flex items-center justify-center p-8 dark:from-neutral-900 dark:to-neutral-950">
              <div className="text-center space-y-4">
                <div className="text-5xl">💕</div>
                <p className="text-xl font-romantic text-rose-500 dark:text-rose-300">Interactive Journey Preview</p>
                <p className="text-sm text-neutral-600 dark:text-neutral-200">See how your love story comes to life</p>
              </div>
            </div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
