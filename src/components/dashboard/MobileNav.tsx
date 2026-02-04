'use client';

import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ThemeToggle from '@/components/ui/ThemeToggle';

export default function MobileNav() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';
  const logoSrc = isDark ? '/images/TenderlyDark.png' : '/images/tenderlyLight.png';

  return (
    <div className="lg:hidden sticky top-0 z-10 flex items-center justify-between h-16 px-4 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
      <Link href="/dashboard" className="flex items-center gap-2">
        {mounted ? (
          <Image
            src={logoSrc}
            alt="Emotional Moments"
            width={120}
            height={28}
            className="h-7 w-auto"
            priority
          />
        ) : (
          <div className="h-7 w-24 bg-neutral-100 dark:bg-neutral-800 animate-pulse rounded" />
        )}
      </Link>
      <ThemeToggle />
    </div>
  );
}
