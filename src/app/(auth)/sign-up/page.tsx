import React from "react";
import Link from "next/link";
import SignUpForm from "@/components/auth/SignUpForm";

export default function SignUpPage() {
  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-neutral-800 dark:text-neutral-100">Create an account</h2>
        <p className="text-neutral-500 dark:text-neutral-400 mt-2">
          Start creating emotional journeys today
        </p>
      </div>

      <SignUpForm />

      <div className="mt-8 text-center text-sm text-neutral-500 dark:text-neutral-400">
        Already have an account?{" "}
        <Link 
          href="/sign-in" 
          className="text-rose-500 dark:text-rose-400 font-medium hover:underline"
        >
          Sign in
        </Link>
      </div>
    </>
  );
}
