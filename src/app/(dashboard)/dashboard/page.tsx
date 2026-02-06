import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import DashboardClient from './DashboardClient';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Dashboard - Emotional Moments',
  description: 'Manage your emotional journeys'
};

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
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
      <DashboardClient user={session.user} />
    </Suspense>
  );
}
