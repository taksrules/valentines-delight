import React, { Suspense } from "react";
import Link from "next/link";
import SignInForm from "@/components/auth/SignInForm";

function SignInFormWrapper() {
  return <SignInForm />;
}

export default function SignInPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">Welcome back</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Sign in to your account
        </p>
      </div>

      <Suspense fallback={
        <div className="flex justify-center py-8">
          <div className="animate-spin h-8 w-8 border-4 border-rose-500 border-t-transparent rounded-full" />
        </div>
      }>
        <SignInFormWrapper />
      </Suspense>

      <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Don&apos;t have an account?{" "}
        <Link 
          href="/sign-up" 
          className="text-rose-500 dark:text-rose-400 font-medium hover:underline"
        >
          Sign up
        </Link>
      </div>
    </>
  );
}
