"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export default function AuthErrorPage() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");

  const errors: Record<string, string> = {
    Configuration: "There is a problem with the server configuration. Check if your AUTH_SECRET and provider credentials are correct.",
    AccessDenied: "You do not have permission to sign in.",
    Verification: "The verification link has expired or has already been used.",
    Default: "An unexpected authentication error occurred.",
  };

  const errorMessage = error && errors[error] ? errors[error] : errors.Default;

  return (
    <Container className="flex items-center justify-center min-h-[70vh]">
      <div className="max-w-md w-full bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-200 dark:border-neutral-800 shadow-xl text-center">
        <div className="w-16 h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-2">
          Authentication Error
        </h1>
        
        <p className="text-neutral-600 dark:text-neutral-400 mb-8 italic">
          Error code: <code className="bg-neutral-100 dark:bg-neutral-800 px-1 rounded">{error || "Unknown"}</code>
        </p>
        
        <div className="p-4 bg-rose-50 dark:bg-rose-900/20 rounded-2xl border border-rose-100 dark:border-rose-800 text-sm text-rose-700 dark:text-rose-300 mb-8 text-left">
          <p>{errorMessage}</p>
        </div>

        <div className="space-y-4">
          <Link href="/sign-in" className="block">
            <Button fullWidth variant="primary">
              Back to Sign In
            </Button>
          </Link>
          <Link href="/" className="block">
            <Button fullWidth variant="secondary">
              Go to Homepage
            </Button>
          </Link>
        </div>
      </div>
    </Container>
  );
}
