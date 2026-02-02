'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
  fullWidth?: boolean;
}

export default function Button({ 
  variant = 'primary', 
  children, 
  fullWidth = false,
  className = '',
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-8 py-4 rounded-full font-medium text-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-400 shadow-lg hover:shadow-xl hover:scale-105',
    secondary: 'bg-neutral-200 text-neutral-600 hover:bg-neutral-300 focus:ring-neutral-400 shadow-md hover:shadow-lg'
  };
  
  const widthStyle = fullWidth ? 'w-full' : 'min-w-[160px]';
  
  return (
    <motion.button
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
