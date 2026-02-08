'use client';

import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function PreviewNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-1/2 translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-rose-500/5 rounded-full blur-xl" />
          <div className="relative w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Search className="w-12 h-12 text-rose-500" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center border-4 border-neutral-950">
              <span className="text-white text-xs font-bold">?</span>
            </div>
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Preview Missing
          </h1>
          <p className="text-neutral-400 text-lg leading-relaxed font-medium">
            We couldn't find the journey you're trying to preview. It might have been deleted or the link is invalid.
          </p>
        </div>

        {/* Action Section */}
        <div className="pt-4 space-y-4">
          <Link href="/dashboard" className="block">
            <Button variant="outline" className="w-full py-4 border-neutral-800 text-neutral-400 hover:text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <ArrowLeft className="w-5 h-5" />
              Back to Dashboard
            </Button>
          </Link>
          
          <Link 
            href="/" 
            className="inline-block text-neutral-500 hover:text-white transition-colors text-sm font-medium"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
