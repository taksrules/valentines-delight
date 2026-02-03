'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import Image from 'next/image';

const steps = [
  {
    number: 1,
    image: '/images/step-1-upload.png',
    title: 'Choose Your Memories',
    description: 'Upload 4-6 photos that tell your story. Add heartfelt captions to each one.',
    time: '2 min'
  },
  {
    number: 2,
    image: '/images/step-2-questions.png',
    title: 'Craft Your Questions',
    description: 'Pick from romantic templates or write custom questions that guide them through your journey.',
    time: '2 min'
  },
  {
    number: 3,
    image: '/images/step-3-share.png',
    title: 'Share & Celebrate',
    description: 'Send the unique link and watch as they experience your love story.',
    time: '1 min'
  }
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-20 sm:py-24 bg-white dark:bg-neutral-950">
      <Container>
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-neutral-900 mb-4 tracking-tight dark:text-neutral-100">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto dark:text-neutral-300">
            Creating your emotional journey is simple and takes just minutes
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-start max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={step.number} className="relative">
              {/* Connecting arrow (hidden on mobile, shown on desktop between cards) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-32 -right-6 lg:-right-6 z-0">
                  <svg width="48" height="24" viewBox="0 0 48 24" fill="none" className="text-rose-300 dark:text-rose-400/30">
                    <path d="M0 12H46M46 12L36 2M46 12L36 22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
                className="relative bg-gradient-to-br from-white to-rose-50/30 dark:from-neutral-900 dark:to-neutral-900/50 rounded-2xl p-6 border border-rose-100 shadow-md hover:shadow-xl transition-all duration-300 h-full flex flex-col dark:border-neutral-800 dark:shadow-neutral-900/50 dark:hover:border-rose-400/30 dark:hover:shadow-2xl"
              >
                {/* Step number badge */}
                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-rose-500 to-pink-500 text-white font-bold text-base mb-4 shadow-lg">
                  {step.number}
                </div>

                {/* Product screenshot */}
                <div className="relative w-full aspect-square mb-4 rounded-xl overflow-hidden border border-rose-100 dark:border-neutral-700 shadow-sm bg-white dark:bg-neutral-800">
                  <Image
                    src={step.image}
                    alt={step.title}
                    fill
                    className="object-cover dark:opacity-90 dark:brightness-90"
                  />
                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-neutral-900 mb-2 dark:text-neutral-100">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-neutral-700 leading-relaxed flex-1 mb-3 dark:text-neutral-300">
                  {step.description}
                </p>

                {/* Time indicator */}
                <div className="flex items-center gap-2 text-sm text-rose-600 dark:text-rose-400 font-medium">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {step.time}
                </div>
              </motion.div>
            </div>
          ))}
        </div>

        {/* Total time callout */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 px-6 py-4 bg-rose-50 dark:bg-neutral-900 rounded-full inline-flex items-center gap-2 mx-auto border border-rose-100 dark:border-rose-400/30"
        >
          <svg className="w-5 h-5 text-rose-600 dark:text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          <span className="text-neutral-900 dark:text-neutral-100 font-semibold">
            From start to share in under 5 minutes
          </span>
        </motion.div>
      </Container>
    </section>
  );
}
