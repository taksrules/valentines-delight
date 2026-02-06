'use client';

import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export default function PreviewNotFound() {
  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="relative">
          <div className="w-24 h-24 bg-neutral-900 rounded-3xl flex items-center justify-center mx-auto border border-white/5 shadow-2xl">
            <Search className="w-10 h-10 text-neutral-700" />
          </div>
          <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-rose-500 rounded-full flex items-center justify-center border-4 border-neutral-950">
            <span className="text-white text-xs font-bold">?</span>
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-white tracking-tight">Journey Missing</h1>
          <p className="text-neutral-500">
            We couldn't find the journey you're trying to preview. It might have been deleted.
          </p>
        </div>

        <Link 
          href="/dashboard"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl font-semibold transition-all border border-white/10"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
