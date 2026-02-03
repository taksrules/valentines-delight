'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import FloatingHearts from '@/components/ui/FloatingHearts';
import Container from '@/components/ui/Container';

export default function FinalCTA() {
  return (
    <section id="get-started" className="relative py-20 sm:py-24 overflow-hidden bg-gradient-to-br from-rose-500 via-pink-500 to-purple-500 dark:from-rose-700 dark:via-pink-700 dark:to-purple-700">
      {/* Floating hearts */}
      <FloatingHearts count={8} />
      
      <Container className="relative z-10 text-center max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="space-y-8"
        >
          {/* Headline */}
          <h2 className="font-romantic text-4xl sm:text-5xl md:text-6xl text-white leading-tight tracking-tight">
            Ready to Create Your Moment?
          </h2>

          {/* Subheadline */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl md:text-2xl text-white/90">
            Join hundreds of people making their love stories unforgettable
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center sm:items-stretch">
            <Link href="/signup" className="block w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto h-full px-10 py-4 bg-white text-rose-600 rounded-full font-semibold text-lg shadow-xl hover:shadow-2xl transition-shadow dark:bg-rose-400 dark:text-neutral-950 dark:hover:bg-rose-500 dark:shadow-rose-900/30"
              >
                Start Creating – It's Free
              </motion.button>
            </Link>
            <Link href="/demo" className="block w-full sm:w-auto">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full sm:w-auto h-full px-10 py-4 bg-white/10 backdrop-blur-sm text-white border-2 border-white/30 rounded-full font-semibold text-lg hover:bg-white/20 transition-colors"
              >
                See a Demo Journey
              </motion.button>
            </Link>
          </div>

          {/* Trust indicators */}
          <p className="text-white/80 text-sm">
            ✨ No credit card • Free forever • Ready in 5 minutes
          </p>
        </motion.div>
      </Container>
    </section>
  );
}
