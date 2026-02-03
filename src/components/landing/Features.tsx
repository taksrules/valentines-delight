'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

const features = [
  {
    icon: '💕',
    title: 'Emotionally Intelligent',
    description: 'Gentle pacing and thoughtful transitions create a truly moving experience'
  },
  {
    icon: '🎵',
    title: 'Background Music',
    description: 'Romantic tracks that set the perfect mood'
  },
  {
    icon: '📸',
    title: 'Photo Memories',
    description: 'Polaroid-style reveals with captions that tell your story'
  },
  {
    icon: '🎨',
    title: 'Beautiful Templates',
    description: 'Pre-designed romantic journeys you can customize'
  },
  {
    icon: '🔒',
    title: 'Private & Secure',
    description: 'Only you and your recipient can see your journey'
  },
  {
    icon: '✨',
    title: 'The "No" Loop',
    description: 'Playful retry logic that\'s never pushy'
  }
];

export default function Features() {
  return (
    <section id="features" className="py-20 sm:py-24 bg-gradient-to-b from-rose-50/30 to-white dark:from-neutral-950 dark:to-neutral-950">
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
            Why People Love It
          </h2>
          <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto dark:text-neutral-200">
            Every detail designed to make your moment unforgettable
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch auto-rows-fr max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="bg-white rounded-2xl p-6 border border-neutral-200 hover:border-rose-200 hover:shadow-lg transition-all h-full flex flex-col dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-900/50 dark:hover:border-neutral-700"
            >
              {/* Icon */}
              <div className="text-4xl mb-4">{feature.icon}</div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-neutral-800 mb-2 dark:text-neutral-100">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-600 text-sm leading-relaxed flex-1 dark:text-neutral-200">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
