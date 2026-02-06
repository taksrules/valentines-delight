'use client';

import Link from 'next/link';
import { Lock, LayoutDashboard } from 'lucide-react';

export default function PreviewUnauthorized() {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div className="w-24 h-24 bg-rose-500/10 rounded-[2rem] flex items-center justify-center mx-auto border border-rose-500/20 shadow-2xl shadow-rose-500/5 transition-transform hover:scale-105 duration-500">
          <Lock className="w-12 h-12 text-rose-500" />
        </div>
        
        <div className="space-y-3">
          <h1 className="text-3xl font-black text-white tracking-tight">Access Denied</h1>
          <p className="text-neutral-400 text-lg">
            This preview is restricted exclusively to the creator.
          </p>
          <p className="text-sm text-neutral-500 bg-neutral-900/50 py-2 px-4 rounded-xl border border-white/5 inline-block">
            Sign in to the correct account to view your draft.
          </p>
        </div>

        <div className="flex flex-col gap-3 pt-4">
          <Link 
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-black rounded-2xl font-bold transition-all hover:bg-neutral-200 active:scale-[0.98] shadow-xl shadow-white/5"
          >
            <LayoutDashboard className="w-4 h-4" />
            Go to Dashboard
          </Link>
          <Link 
            href="/sign-in"
            className="text-sm font-bold text-rose-500 hover:text-rose-400 transition-colors py-2"
          >
            Switch Account
          </Link>
        </div>
      </div>
    </div>
  );
}
