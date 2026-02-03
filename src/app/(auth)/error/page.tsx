"use client";

export const dynamic = 'force-dynamic';

import React from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ErrorContent() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-200 dark:border-rose-800">
        <span className="text-4xl">⚠️</span>
      </div>
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Something went wrong</h2>
      <p className="text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
        {error === "Configuration" 
          ? "There is a problem with the server configuration. Please check your environment variables." 
          : error === "AccessDenied"
          ? "Access denied. You do not have permission to sign in."
          : error === "Verification"
          ? "The verification link has expired or has already been used."
          : "An unexpected error occurred during authentication. Please try again."}
      </p>

      <div className="mt-10">
        <Link 
          href="/sign-in" 
          className="inline-flex items-center justify-center w-full py-3.5 px-6 bg-rose-500 hover:bg-rose-600 dark:bg-rose-400 dark:hover:bg-rose-500 rounded-full text-white dark:text-neutral-950 font-semibold shadow-lg shadow-rose-200 dark:shadow-rose-900/30 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Try Again
        </Link>
      </div>

      <div className="mt-6">
        <Link 
          href="/" 
          className="text-neutral-500 dark:text-neutral-400 font-medium hover:text-rose-500 dark:hover:text-rose-400 text-sm transition-colors"
        >
          ← Back to home
        </Link>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="text-center py-20">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600 dark:text-neutral-300">Loading...</p>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
