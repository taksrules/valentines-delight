'use client';

import Container from './Container';
import Link from 'next/link';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Footer() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/TenderlyDark.png' : '/images/tenderlyLight.png';

  return (
    <footer className="bg-white dark:bg-neutral-950 border-t border-neutral-100 dark:border-neutral-900 py-12 md:py-16">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="inline-block">
              {mounted ? (
                <Image
                  src={logoSrc}
                  alt="Tenderly"
                  width={140}
                  height={32}
                  className="h-8 w-auto"
                />
              ) : (
                <div className="h-8 w-32 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded" />
              )}
            </Link>
            <p className="text-neutral-600 dark:text-neutral-400 max-w-sm leading-relaxed">
              Create and share beautiful emotional journeys with the ones you love. 
              Small moments, lasting memories. 💕
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6">Product</h4>
            <ul className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <li><Link href="#how-it-works" className="hover:text-rose-500 transition-colors">How It Works</Link></li>
              <li><Link href="#features" className="hover:text-rose-500 transition-colors">Features</Link></li>
              <li><Link href="/create" className="hover:text-rose-500 transition-colors">Create Yours</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-bold text-neutral-900 dark:text-neutral-100 mb-6">Legal</h4>
            <ul className="space-y-4 text-neutral-600 dark:text-neutral-400">
              <li><Link href="/privacy" className="hover:text-rose-500 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-rose-500 transition-colors">Terms of Service</Link></li>
              <li><Link href="/cookies" className="hover:text-rose-500 transition-colors">Cookie Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-100 dark:border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-neutral-500 dark:text-neutral-500 text-sm">
            © {new Date().getFullYear()} Tenderly. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <span className="text-neutral-400 dark:text-neutral-600 text-sm italic">
              Made with love for special moments. ✨
            </span>
          </div>
        </div>
      </Container>
    </footer>
  );
}
