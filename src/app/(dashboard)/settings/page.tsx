import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth';
import SettingsClient from './SettingsClient';
import Container from '@/components/ui/Container';

export const metadata = {
  title: 'Settings - Tenderly',
  description: 'Manage your account and profile settings'
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const session = await auth();

  if (!session) {
    redirect('/sign-in');
  }

  return (
    <div className="py-10">
      <Container>
        <Suspense fallback={<div className="animate-pulse bg-neutral-100 dark:bg-neutral-800 h-96 rounded-2xl" />}>
          <SettingsClient user={session.user} />
        </Suspense>
      </Container>
    </div>
  );
}
