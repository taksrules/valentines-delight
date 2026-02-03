'use client';

import { motion } from 'framer-motion';
import Container from '@/components/ui/Container';

const testimonials = [
  {
    quote: "She said yes! This made our Valentine's Day absolutely unforgettable.",
    author: "Alex M.",
    role: "Valentine's proposal",
    rating: 5
  },
  {
    quote: "I've never seen anything like this. So thoughtful and beautiful.",
    author: "Sarah K.",
    role: "Recipient",
    rating: 5
  },
  {
    quote: "The perfect way to express my feelings. She loved every moment.",
    author: "James R.",
    role: "Anniversary",
    rating: 5
  }
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-20 sm:py-24 bg-white dark:bg-neutral-950">
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
            Love Stories Made Real
          </h2>
          <p className="text-lg sm:text-xl text-neutral-700 max-w-2xl mx-auto dark:text-neutral-200">
            Join hundreds of people creating unforgettable moments
          </p>
        </motion.div>

        {/* Testimonials grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 sm:mb-16 items-stretch auto-rows-fr max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="bg-gradient-to-br from-white to-rose-50/30 dark:from-neutral-900 dark:to-neutral-900 rounded-2xl p-6 border border-rose-100 shadow-sm hover:shadow-lg h-full flex flex-col dark:border-neutral-800 dark:shadow-neutral-900/50 dark:hover:border-neutral-700"
            >
              {/* Rating stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <span key={i} className="text-rose-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <blockquote className="text-neutral-700 leading-relaxed mb-6 italic flex-1 dark:text-neutral-200">
                "{testimonial.quote}"
              </blockquote>

              {/* Author */}
              <div className="pt-4 border-t border-rose-100 dark:border-neutral-800">
                <div className="font-semibold text-neutral-800 dark:text-neutral-100">{testimonial.author}</div>
                <div className="text-sm text-neutral-500 dark:text-neutral-400">{testimonial.role}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-3 gap-6 sm:gap-8 max-w-4xl mx-auto"
        >
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-rose-500 mb-2 dark:text-neutral-100">500+</div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-200">Journeys Created</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-rose-500 mb-2 dark:text-neutral-100">92%</div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-200">Say YES</div>
          </div>
          <div className="text-center">
            <div className="text-3xl sm:text-4xl font-bold text-rose-500 mb-2 dark:text-neutral-100">4.9/5</div>
            <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-200">Rating</div>
          </div>
        </motion.div>
      </Container>
    </section>
  );
}
