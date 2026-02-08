'use client';

import Link from 'next/link';
import { SearchX } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function JourneyNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-4xl">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-rose-500/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-md w-full text-center space-y-10 relative z-10">
        {/* Icon */}
        <div className="relative inline-block">
          <div className="absolute -inset-4 bg-rose-500/10 rounded-full blur-xl animate-pulse" />
          <div className="relative w-24 h-24 bg-neutral-900 border border-neutral-800 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <SearchX className="w-12 h-12 text-rose-500" />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold text-white tracking-tight">
            Journey Not Found
          </h1>
          <div className="space-y-2">
            <p className="text-neutral-400 text-lg leading-relaxed font-medium">
              This journey doesn't exist or isn't available yet.
            </p>
            <p className="text-neutral-500 text-sm italic">
              (Private drafts are hidden for recipient privacy)
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="pt-4 space-y-6">
          <div className="space-y-2">
            <p className="text-sm font-bold text-rose-500/80 uppercase tracking-widest">
              Ready to create your own?
            </p>
          </div>
          
          <Link href="/create" className="block">
            <Button variant="primary" className="w-full py-4 text-lg font-bold shadow-lg shadow-rose-500/20 active:scale-[0.98] transition-transform">
              Create Your Journey
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
