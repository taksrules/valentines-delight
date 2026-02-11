"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import StepIndicator from "@/components/ui/StepIndicator";
import Button from "@/components/ui/Button";
import { InvisibleTurnstile } from "@/components/ui/InvisibleTurnstile";

const STEPS = [
  { label: "Your details", description: "Name, email & password" },
  { label: "Verify email", description: "Check inbox" },
];

export default function SignUpForm() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(0);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showTurnstile, setShowTurnstile] = useState(false);
  const turnstileTokenRef = React.useRef<string | null>(null);
  const hasErroredRef = React.useRef(false); // Track if widget gave an error

  // Emergency: Log every state change to isLoading
  useEffect(() => {
    console.error(`[REGISTER] UI State Update - isLoading: ${isLoading}, showTurnstile: ${showTurnstile}`);
  }, [isLoading, showTurnstile]);

  // Sync ref with state for use in timeouts
  useEffect(() => {
    turnstileTokenRef.current = turnstileToken;
  }, [turnstileToken]);

  // Removed brittle useEffect timeout to unify with handleSubmit logic

  const handleSubmit = async (e: React.FormEvent, token?: string) => {
    console.error("[REGISTER] handleSubmit starting. Token passed directly:", !!token);
    e?.preventDefault();
    setError(null);
    hasErroredRef.current = false;

    // 1. Basic Validation First (Instant Feedback)
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    // 2. Set Loading State Immediately
    setIsLoading(true);

    // 3. Security Check (Turnstile)
    if (!token && !turnstileToken) {
      console.error("[REGISTER] Security check: No token, showing Turnstile widget...");
      setShowTurnstile(true);
      
      // Safety net: check the Ref (latest value) after 15s
      setTimeout(() => {
        if (!turnstileTokenRef.current && !token && !hasErroredRef.current) {
          console.error("[REGISTER] ❌ Security check timed out after 15s");
          setError("Security verification is taking too long. Please refresh.");
          setIsLoading(false);
          setShowTurnstile(false);
        } else if (hasErroredRef.current) {
          console.log("[REGISTER] Timeout suppressed: Widget already reported an error.");
        } else {
          console.log("[REGISTER] Timeout cleared: Token exists in Ref.");
        }
      }, 15000);
      return;
    }

    try {
      console.log("[REGISTER] Starting API submission for:", email);
      
      const registerPromise = fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
          name,
          turnstileToken: token || turnstileToken
        }),
      });

      // Add a timeout to prevent infinite loader (matching login timeout)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("REGISTER_TIMEOUT")), 20000)
      );

      const response = await Promise.race([registerPromise, timeoutPromise]) as Response;
      const data = await response.json();

      console.log("[REGISTER] API result:", response.status, data);

      if (!response.ok) {
        console.error("[REGISTER] Registration failed status:", response.status);
        if (response.status === 409) {
          setError("An account with this email already exists. Try signing in or use a different email.");
        } else if (response.status === 429) {
          setError(data.error || "Too many attempts. Please wait a moment before trying again.");
        } else {
          setError(data.error || "Registration failed. Please try again.");
        }
        setTurnstileToken(null);
        setShowTurnstile(false);
        return;
      }

      // Success - move to step 2
      console.log("[REGISTER] Success! Moving to verification step.");
      setCurrentStep(1);
    } catch (err: any) {
      console.error("[REGISTER] Exception during submission:", err);
      if (err.message === "REGISTER_TIMEOUT") {
        setError("Registration timed out. Please check your connection and try again.");
      } else {
        setError("Something went wrong. Please try again.");
      }
      setTurnstileToken(null);
      setShowTurnstile(false);
    } finally {
      setIsLoading(false);
      console.log("[REGISTER] Flow finished");
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to resend verification email");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step Indicator */}
      <StepIndicator steps={STEPS} currentStep={currentStep} />

      <AnimatePresence mode="wait">
        {currentStep === 0 ? (
          <motion.form
            key="step-1"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            onSubmit={handleSubmit}
            className="space-y-5"
          >
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 ml-1">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-cream-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500"
              />
            </div>

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
                  autoComplete="new-password"
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
              <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1 ml-1">
                Must be at least 8 characters
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-neutral-700 dark:text-neutral-200 mb-1.5 ml-1">
                Confirm Password
              </label>
              <div className="relative group">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-cream-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-500 dark:focus:ring-rose-400 focus:border-transparent transition-all text-neutral-800 dark:text-neutral-100 placeholder:text-neutral-400 dark:placeholder:text-neutral-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-neutral-400 hover:text-rose-500 dark:text-neutral-500 dark:hover:text-rose-400 transition-colors rounded-xl hover:bg-rose-50 dark:hover:bg-neutral-700/50"
                >
                  {showConfirmPassword ? (
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

            <div className="flex items-start gap-2 px-1">
              <input 
                id="terms" 
                type="checkbox" 
                required
                className="mt-1 w-4 h-4 rounded text-rose-500 focus:ring-rose-500 border-neutral-300 dark:border-neutral-600 dark:bg-neutral-800 accent-rose-500" 
              />
              <label htmlFor="terms" className="text-xs text-neutral-500 dark:text-neutral-400">
                I agree to the <Link href="/terms" className="text-rose-400/80 hover:text-rose-500 transition-colors decoration-rose-400/30 underline underline-offset-4">Terms</Link> and <Link href="/privacy" className="text-rose-400/80 hover:text-rose-500 transition-colors decoration-rose-400/30 underline underline-offset-4">Privacy Policy</Link>
              </label>
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
              Create Account
            </Button>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200 dark:border-neutral-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-neutral-900 text-neutral-500">Or continue with</span>
              </div>
            </div>

            <Button
              type="button"
              variant="secondary"
              fullWidth
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="flex items-center justify-center gap-3 py-3"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Sign up with Google
            </Button>
          </motion.form>
        ) : (
          <motion.div
            key="step-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
            className="text-center py-4"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15 }}
              className="w-20 h-20 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-200 dark:border-rose-800"
            >
              <span className="text-4xl">✉️</span>
            </motion.div>

            <h3 className="text-xl font-semibold text-neutral-800 dark:text-neutral-100 mb-2">
              Verify your email
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400 mb-6">
              We sent a verification link to<br />
              <strong className="text-neutral-700 dark:text-neutral-200">{email}</strong>
            </p>

            <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-200 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300 mb-6">
              <p>Click the link in your email to verify your account. Check spam if you don&apos;t see it.</p>
            </div>

            <div className="space-y-3">
              <button
                type="button"
                onClick={handleResendVerification}
                disabled={isLoading}
                className="text-sm text-rose-500 dark:text-rose-400 hover:underline disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Resend verification email"}
              </button>

              <div className="block">
                <Link
                  href="/sign-in"
                  className="text-sm text-neutral-500 dark:text-neutral-400 hover:underline"
                >
                  Continue to sign in →
                </Link>
              </div>

              <button
                type="button"
                onClick={() => {
                  setCurrentStep(0);
                  setError(null);
                  setPassword("");
                  setConfirmPassword("");
                }}
                className="text-sm text-neutral-400 dark:text-neutral-500 hover:underline"
              >
                ← Use a different email
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Invisible Turnstile */}
      {showTurnstile && (
        <InvisibleTurnstile
          action="signup"
          onVerify={(token: string) => {
            console.log("[REGISTER] Turnstile verified successfully.");
            setTurnstileToken(token);
            setShowTurnstile(false);
            const fakeEvent = { preventDefault: () => {} } as React.FormEvent;
            handleSubmit(fakeEvent, token);
          }}
          onError={(error: string) => {
            console.error("[REGISTER] Turnstile error:", error);
            hasErroredRef.current = true;
            setError(error);
            setShowTurnstile(false);
            setIsLoading(false);
          }}
        />
      )}
    </div>
  );
}
