'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { 
  Heart, 
  Music, 
  Image as ImageIcon, 
  Layout, 
  Lock, 
  RefreshCw 
} from 'lucide-react';

const features = [
  {
    icon: Heart,
    title: 'Emotionally Intelligent',
    description: 'Gentle pacing and thoughtful transitions create a truly moving experience'
  },
  {
    icon: Music,
    title: 'Background Music',
    description: 'Romantic tracks that set the perfect mood'
  },
  {
    icon: ImageIcon,
    title: 'Photo Memories',
    description: 'Polaroid-style reveals with captions that tell your story'
  },
  {
    icon: Layout,
    title: 'Beautiful Templates',
    description: 'Pre-designed romantic journeys you can customize'
  },
  {
    icon: Lock,
    title: 'Private & Secure',
    description: 'Only you and your recipient can see your journey'
  },
  {
    icon: RefreshCw,
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
          <h2 className="font-romantic text-3xl sm:text-4xl md:text-5xl text-rose-500 mb-4 tracking-tight dark:text-rose-400">
            Why People Love It
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto dark:text-neutral-300">
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
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group bg-white rounded-2xl p-6 border border-neutral-200 hover:border-rose-300 hover:shadow-xl transition-all duration-300 h-full flex flex-col dark:bg-neutral-900 dark:border-neutral-800 dark:shadow-neutral-900/50 dark:hover:border-rose-400/40 dark:hover:shadow-2xl"
            >
              {/* Icon Circle - Dark Mode Optimized */}
              <div className="w-20 h-20 rounded-full bg-rose-500/10 dark:bg-rose-500/20 border border-rose-100 dark:border-rose-500/30 flex items-center justify-center mb-6 group-hover:bg-rose-500/20 dark:group-hover:bg-rose-500/30 transition-all duration-300">
                <feature.icon className="w-10 h-10 text-rose-500 dark:text-rose-400 stroke-[1.5] group-hover:text-rose-600 dark:group-hover:text-rose-300 transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3 className="text-lg font-bold text-neutral-900 mb-2 dark:text-neutral-100">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-neutral-700 text-sm leading-relaxed flex-1 dark:text-neutral-400">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
