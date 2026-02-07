'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-1/3 left-1/3 w-72 h-72 bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/3 w-72 h-72 bg-blue-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        {/* Logo/Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-white/5 rounded-full blur-xl" />
          <div className="relative w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <span className="text-4xl font-black text-rose-500">404</span>
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Page Not Found
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-medium">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* CTA Section */}
        <div className="pt-4">
          <Link href="/" className="block">
            <Button variant="primary" className="w-full py-4 text-lg font-bold shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              Go Home
            </Button>
          </Link>
          
          <p className="mt-8 text-neutral-500 text-sm">
            Lost? <Link href="/contact" className="text-rose-500/80 hover:text-rose-400 font-medium">Tell us what's missing</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
