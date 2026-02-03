'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { useSession, signOut } from 'next-auth/react';
import Container from '@/components/ui/Container';
import ThemeToggle from '@/components/ui/ThemeToggle';
import Button from '@/components/ui/Button';

export default function LandingNav() {
  const { data: session, status } = useSession();
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/TenderlyDark.png' : '/images/tenderlyLight.png';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-rose-100/70 bg-white/90 backdrop-blur dark:border-neutral-800 dark:bg-neutral-950">
      <Container className="flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group transition-all duration-300">
          <Image
            src={logoSrc}
            alt="Emotional Moments"
            width={160}
            height={40}
            className="h-8 w-auto transition-transform duration-300 group-hover:scale-105"
            priority
          />
        </Link>
        <nav className="hidden items-center gap-6 text-sm font-medium text-neutral-700 dark:text-neutral-200 md:flex">
          <Link href="#how-it-works" className="hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-400">
            How It Works
          </Link>
          <Link href="#features" className="hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-400">
            Features
          </Link>
          <Link href="#testimonials" className="hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-400">
            Testimonials
          </Link>
          <Link href="#get-started" className="hover:text-rose-500 dark:text-rose-300 dark:hover:text-rose-400">
            Get Started
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          
          {mounted && status === 'authenticated' ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard" 
                className="text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400 dark:hover:text-rose-400 transition-colors hidden sm:block"
              >
                Dashboard
              </Link>
              <Button 
                variant="secondary" 
                onClick={() => signOut({ callbackUrl: '/' })}
                className="px-5 py-2 text-sm"
              >
                Sign Out
              </Button>
            </div>
          ) : mounted && status === 'unauthenticated' ? (
            <>
              <Link 
                href="/sign-in" 
                className="text-sm font-medium text-neutral-600 hover:text-rose-500 dark:text-neutral-400 dark:hover:text-rose-400 transition-colors hidden sm:block"
              >
                Sign In
              </Link>
              <Link href="/sign-up" className="hidden sm:block">
                <Button variant="primary" className="px-5 py-2 text-sm shadow-rose-200 dark:shadow-rose-900/20">
                  Start Free
                </Button>
              </Link>
            </>
          ) : (
            <div className="h-10 w-24 animate-pulse bg-neutral-100 dark:bg-neutral-800 rounded-xl hidden sm:block" />
          )}
        </div>
      </Container>
    </header>
  );
}
