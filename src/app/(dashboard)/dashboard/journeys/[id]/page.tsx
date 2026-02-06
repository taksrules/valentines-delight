import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import JourneyDetailClient from '@/components/dashboard/JourneyDetailClient';
import { Suspense } from 'react';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JourneyDetailPage({ params }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const { id } = await params;

  const journey = await prisma.journey.findUnique({
    where: { id },
  });

  if (!journey) {
    notFound();
  }

  if (journey.creatorId !== session.user.id) {
    redirect('/dashboard');
  }

  return (
    <JourneyDetailClient 
      isLoading={false}
      journey={{
        id: journey.id,
        recipientName: journey.recipientName,
        status: journey.status,
        uniqueSlug: journey.uniqueSlug,
        createdAt: journey.createdAt.toISOString(),
        viewCount: journey.viewCount,
        responsesAvailable: journey.responsesAvailable,
      }} 
    />
  );
}
