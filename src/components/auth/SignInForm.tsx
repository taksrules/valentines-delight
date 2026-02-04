"use client";

import React, { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import Button from "@/components/ui/Button";

export default function SignInForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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
        <div className="relative group">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            required
            autoComplete="current-password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-cream-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-neutral-700/50"
          >
            {showPassword ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
              </svg>
            )}
          </button>
        </div>
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

      <Button
        type="submit"
        isLoading={isLoading}
        fullWidth
      >
        Sign In
      </Button>

      <div className="pt-4 text-center">
        <p className="text-xs text-neutral-400 dark:text-neutral-500 px-6 leading-relaxed">
          By signing in, you agree to our{" "}
          <Link href="/terms" className="text-rose-400/80 hover:text-rose-500 transition-colors decoration-rose-400/30 underline underline-offset-4">Terms</Link>
          {" "}and{" "}
          <Link href="/privacy" className="text-rose-400/80 hover:text-rose-500 transition-colors decoration-rose-400/30 underline underline-offset-4">Privacy Policy</Link>.
        </p>
      </div>
    </form>
  );
}
