import React from "react";
import Link from "next/link";

export default function VerifyRequestPage() {
  return (
    <div className="text-center">
      <div className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-200 dark:border-rose-800">
        <span className="text-4xl">✉️</span>
      </div>
      <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">Check your email</h2>
      <p className="text-neutral-500 dark:text-neutral-400 mt-4 leading-relaxed">
        A magic link has been sent to your email address. 
        Please click the link to sign in securely.
      </p>
      
      <div className="mt-10 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300">
        <p><strong>Note:</strong> If you don&apos;t see the email, please check your spam folder.</p>
      </div>

      <div className="mt-8">
        <Link 
          href="/sign-in" 
          className="text-rose-500 dark:text-rose-400 font-medium hover:underline text-sm"
        >
          ← Back to sign in
        </Link>
      </div>
    </div>
  );
}
