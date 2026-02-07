"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import FloatingHearts from "@/components/ui/FloatingHearts";
import ThemeToggle from "@/components/ui/ThemeToggle";

import { GeistSans } from 'geist/font/sans';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";
  const logoSrc = isDark ? "/images/TenderlyDark.png" : "/images/tenderlyLight.png";

  return (
    <div className={`${GeistSans.className} min-h-screen relative flex items-center justify-center p-4 bg-gradient-to-br from-cream-50 via-rose-50 to-pink-50 dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-900 overflow-hidden`}>
      {/* Background gradient overlays */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-radial from-rose-100/30 via-transparent to-transparent opacity-50 dark:from-neutral-800/30" />
        <div className="absolute top-0 right-0 -translate-y-1/3 translate-x-1/3 w-[600px] h-[600px] bg-rose-200/20 dark:bg-rose-900/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 translate-y-1/3 -translate-x-1/3 w-[600px] h-[600px] bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl" />
      </div>

      <FloatingHearts count={8} />

      {/* Theme toggle - top right */}
      <div className="absolute top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Card */}
        <div className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-rose-100 dark:border-neutral-800 shadow-2xl dark:shadow-neutral-900/50 rounded-3xl p-8 md:p-10">
          {/* Logo header */}
          <div className="flex flex-col items-center mb-8">
            <Link href="/" className="mb-4 transition-transform hover:scale-105 duration-300">
              <Image
                src={logoSrc}
                alt="Tenderly"
                width={160}
                height={45}
                priority
                className={!mounted ? "opacity-0" : "opacity-100 transition-opacity duration-300"}
              />
            </Link>
            <p className="text-neutral-500 dark:text-neutral-400 text-sm">
              Create moments that last forever
            </p>
          </div>
          {children}
        </div>

        {/* Back to home link */}
        <div className="text-center mt-6">
          <Link 
            href="/" 
            className="text-sm text-neutral-500 dark:text-neutral-400 hover:text-rose-500 dark:hover:text-rose-400 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
