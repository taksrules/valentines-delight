'use client';

import { HTMLMotionProps, motion } from 'framer-motion';
import { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  fullWidth?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  isLoading?: boolean;
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  className = '',
  type = 'button',
  isLoading = false
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center px-8 py-4 rounded-full font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantStyles = {
    primary: 'bg-rose-500 text-white hover:bg-rose-600 focus:ring-rose-500 shadow-lg hover:shadow-xl dark:bg-rose-400 dark:text-neutral-950 dark:hover:bg-rose-500 dark:shadow-rose-900/30 dark:focus:ring-rose-300',
    secondary: 'bg-neutral-200 text-neutral-700 hover:bg-neutral-300 focus:ring-neutral-400 dark:bg-transparent dark:border dark:border-rose-400/40 dark:text-rose-400 dark:hover:bg-rose-400/10 dark:focus:ring-rose-300'
  };
  
  const widthStyle = fullWidth ? 'w-full' : '';
  
  const motionProps: HTMLMotionProps<"button"> = {
    whileHover: (disabled || isLoading) ? {} : { scale: 1.05 },
    whileTap: (disabled || isLoading) ? {} : { scale: 0.95 },
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.3 }
  };

  return (
    <motion.button
      type={type}
      className={`${baseStyles} ${variantStyles[variant]} ${widthStyle} ${className}`}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...motionProps}
    >
      {isLoading ? (
        <span className="flex items-center gap-2">
          <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Loading...
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
