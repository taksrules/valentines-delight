"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Check for verified=true in URL params
  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setSuccessMessage("Email verified successfully! You can now sign in.");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      // In NextAuth v5, for credentials provider, it's often more reliable 
      // to let the server handle the redirect to ensure cookies are set correctly
      const result = await signIn("credentials", {
        email,
        password,
        redirect: true,
        callbackUrl: "/dashboard",
      });

      console.log("Sign in result:", result);

      if (result?.error) {
        console.error("Sign in error:", result.error);
        if (result.error === "CredentialsSignin") {
          setError("Invalid email or password");
        } else if (result.error === "EmailNotVerified") {
          setError("Please verify your email address before signing in. Check your inbox for the verification link.");
        } else {
          setError(result.error);
        }
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {successMessage && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm flex items-center gap-2 text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800"
        >
          <span>✓</span>
          {successMessage}
        </motion.div>
      )}

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 ml-1">
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-cream-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />
      </div>

      <div>
        <label htmlFor="password" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 ml-1">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-cream-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
        />
      </div>

      <div className="flex items-center justify-between px-1">
        <label className="flex items-center gap-2 text-sm">
          <input 
            type="checkbox" 
            className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 accent-rose-500" 
          />
          <span className="text-neutral-500 dark:text-neutral-400">Remember me</span>
        </label>
        <Link 
          href="/forgot-password" 
          className="text-sm text-rose-500 dark:text-rose-400 hover:underline"
        >
          Forgot password?
        </Link>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 text-sm flex items-center gap-2 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-200 dark:border-rose-800"
        >
          <span>⚠️</span>
          {error}
        </motion.div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3.5 px-6 bg-rose-500 hover:bg-rose-600 dark:bg-rose-400 dark:hover:bg-rose-500 rounded-full text-white dark:text-neutral-950 font-semibold shadow-lg shadow-rose-200 dark:shadow-rose-900/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none disabled:hover:scale-100"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Signing in...
          </span>
        ) : (
          "Sign In"
        )}
      </button>
    </form>
  );
}
