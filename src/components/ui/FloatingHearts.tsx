'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface FloatingHeartsProps {
  count?: number;
}

export default function FloatingHearts({ count = 12 }: FloatingHeartsProps) {
  const [hearts, setHearts] = useState<Array<{ id: number; emoji: string; delay: number; duration: number; x: string }>>([]);

  useEffect(() => {
    const heartEmojis = ['💕', '❤️', '💖', '✨'];
    const newHearts = Array.from({ length: count }, (_, i) => ({
      id: i,
      emoji: heartEmojis[i % heartEmojis.length],
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      x: `${Math.random() * 100}%`
    }));
    setHearts(newHearts);
  }, [count]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {hearts.map((heart) => (
        <motion.div
          key={heart.id}
          className="absolute text-3xl md:text-4xl opacity-60 dark:opacity-[0.05]"
          style={{
            left: heart.x,
            bottom: '-10%'
          }}
          animate={{
            y: [0, -window.innerHeight * 1.3],
            x: [0, (Math.random() - 0.5) * 150],
            rotate: [0, 360],
            opacity: [0, 0.6, 0.6, 0]
          }}
          transition={{
            duration: heart.duration,
            repeat: Infinity,
            delay: heart.delay,
            ease: 'easeOut'
          }}
        >
          {heart.emoji}
        </motion.div>
      ))}
    </div>
  );
}
