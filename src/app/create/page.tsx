import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import BuilderClient from './BuilderClient';

export const metadata = {
  title: 'Create Journey - Emotional Moments',
  description: 'Create a beautiful emotional journey for someone special'
};

export const dynamic = 'force-dynamic';

export default async function CreatePage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <Suspense fallback={
      <div className="py-20 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <BuilderClient user={session.user} />
    </Suspense>
  );
}
