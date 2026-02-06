import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// POST /api/v1/journeys/[id]/complete
// Mark journey as completed by recipient
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const journey = await prisma.journey.findUnique({
    where: { id, status: 'published' }
  });

  if (!journey) {
    return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
  }

  const updatedJourney = await prisma.journey.update({
    where: { id },
    data: {
      status: 'completed',
      completedAt: new Date(),
    }
  });

  // TODO: Trigger email notification to creator here
  // sendCompletionEmail(journey.creatorId, journey.recipientName);

  return NextResponse.json({ success: true, status: updatedJourney.status });
}
