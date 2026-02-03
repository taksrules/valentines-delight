'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

const steps = [
  {
    number: 1,
    icon: '📸',
    title: 'Choose Your Memories',
    description: 'Upload 4-6 photos that tell your story. Add heartfelt captions to each one.'
  },
  {
    number: 2,
    icon: '💭',
    title: 'Craft Your Questions',
    description: 'Pick from romantic templates or write custom questions that guide them through your journey.'
  },
  {
    number: 3,
    icon: '✨',
    title: 'Share & Celebrate',
    description: 'Send the unique link and watch as they experience your love story.'
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
          <h2 className="font-romantic text-3xl sm:text-4xl md:text-5xl text-rose-500 mb-4 tracking-tight dark:text-neutral-100">
            How It Works
          </h2>
          <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto dark:text-neutral-200">
            Creating your emotional journey is simple and takes just minutes
          </p>
        </motion.div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12 items-stretch auto-rows-fr max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="relative bg-gradient-to-br from-white to-rose-50/30 dark:from-neutral-900 dark:to-neutral-900 rounded-2xl p-8 border border-rose-100 shadow-sm hover:shadow-lg transition-shadow h-full flex flex-col dark:border-neutral-800 dark:shadow-neutral-900/50 dark:hover:border-neutral-700"
            >
              {/* Step number badge */}
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-br from-rose-400 to-pink-400 text-white font-bold text-lg mb-4">
                {step.number}
              </div>

              {/* Icon */}
              <div className="text-5xl mb-4">{step.icon}</div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-neutral-800 mb-3 dark:text-neutral-100">
                {step.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 leading-relaxed flex-1 dark:text-neutral-200">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
          className="text-center mt-12 text-neutral-500 text-sm dark:text-neutral-400"
        >
          From start to share in under 5 minutes ⏱️
        </motion.p>
      </Container>
    </section>
  );
}
