'use client';

import Link from 'next/link';
import { SearchX } from 'lucide-react';

export default function JourneyNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto border border-neutral-800 shadow-2xl">
          <SearchX className="w-12 h-12 text-neutral-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-bold text-white tracking-tight">Journey Not Found</h1>
          <p className="text-neutral-400 text-lg">
            This journey doesn't exist or isn't available yet. 
            <span className="block text-sm mt-2 opacity-60 italic">Private drafts are hidden for privacy.</span>
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Link 
            href="/create"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-rose-500 hover:bg-rose-600 text-white rounded-2xl font-bold transition-all shadow-lg shadow-rose-500/20 active:scale-[0.98]"
          >
            Create Your Own Magic
          </Link>
          <Link 
            href="/"
            className="text-sm text-neutral-500 hover:text-white transition-colors"
          >
            Back to tenderly.space
          </Link>
        </div>
      </div>
    </div>
  );
}
