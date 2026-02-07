'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('[Global Error Boundary]:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-rose-500/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-neutral-500/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
      </div>

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-rose-500/10 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-neutral-900 border border-rose-500/20 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <AlertCircle className="w-12 h-12 text-rose-500" />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Something Went Wrong
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-medium">
            We're sorry, an unexpected error occurred. Our team has been notified.
          </p>
          {error.digest && (
            <p className="text-neutral-600 font-mono text-[10px] tracking-widest uppercase">
              ID: {error.digest}
            </p>
          )}
        </div>

        {/* Action Section */}
        <div className="pt-4 space-y-4">
          <Button 
            variant="primary" 
            onClick={() => reset()}
            className="w-full py-4 text-lg font-bold shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Try Again
          </Button>
          
          <Link href="/" className="block">
            <Button variant="outline" className="w-full py-4 border-neutral-800 text-neutral-400 hover:text-white hover:bg-white/5 transition-all">
              Go Home
            </Button>
          </Link>
        </div>

        <p className="text-neutral-600 text-xs">
          If the problem persists, please <Link href="/support" className="text-rose-500/60 hover:text-rose-500 underline underline-offset-4">contact support</Link>.
        </p>
      </div>
    </div>
  );
}
