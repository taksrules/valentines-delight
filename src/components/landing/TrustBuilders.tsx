'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';
import { Lock, Sparkles, Clock } from 'lucide-react';

const trustItems = [
  {
    icon: <Lock className="w-8 h-8 text-rose-500" />,
    title: 'Private & Secure',
    description: 'Your memories are encrypted and private. Only you and your recipient can see the journey.'
  },
  {
    icon: <Sparkles className="w-8 h-8 text-rose-500" />,
    title: 'Beautiful Anywhere',
    description: 'Designed to look stunning on every device, from mobile phones to massive desktops.'
  },
  {
    icon: <Clock className="w-8 h-8 text-rose-500" />,
    title: 'Ready in Minutes',
    description: 'Our intuitive builder helps you create a professional-grade experience in under 5 minutes.'
  }
];

export default function TrustBuilders() {
  return (
    <section id="trust" className="py-20 sm:py-24 bg-white dark:bg-neutral-950">
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
            Create with Confidence
          </h2>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto dark:text-neutral-300">
            Thoughtfully designed to help you express what matters most
          </p>
        </motion.div>

        {/* Trust grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {trustItems.map((item, index) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="flex flex-col items-center text-center p-8 rounded-2xl bg-rose-50 items-stretch h-full dark:bg-neutral-900 border border-transparent hover:border-rose-100 dark:hover:border-rose-500/20 transition-all duration-300"
            >
              <div className="mb-6 p-4 rounded-full bg-white shadow-sm dark:bg-neutral-800 self-center">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-neutral-900 mb-4 dark:text-neutral-100">
                {item.title}
              </h3>
              <p className="text-neutral-600 leading-relaxed dark:text-neutral-400">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </Container>
    </section>
  );
}
