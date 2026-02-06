import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET /api/v1/journeys/[id]/responses
// Fetch all answers for a journey - Creator only
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Verify ownership
  const journey = await prisma.journey.findUnique({
    where: { id },
    select: { creatorId: true }
  });

  if (!journey) {
    return NextResponse.json({ error: 'Journey not found' }, { status: 404 });
  }

  if (journey.creatorId !== session.user.id) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const answers = await prisma.journeyAnswer.findMany({
    where: { journeyId: id },
    include: {
      question: {
        select: {
          questionText: true,
          questionOrder: true,
        }
      }
    },
    orderBy: {
      question: {
        questionOrder: 'asc'
      }
    }
  });

  // Mark as seen when creator fetches them
  await prisma.journeyAnswer.updateMany({
    where: { journeyId: id, viewerHasSeen: false },
    data: { viewerHasSeen: true }
  });

  return NextResponse.json(answers);
}

// POST /api/v1/journeys/[id]/responses
// Save a response to a question - Public (for recipient)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { questionId, answerText } = await request.json();

  if (!questionId || !answerText) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // Verify journey exists and is published
  const journey = await prisma.journey.findUnique({
    where: { id, status: 'published' }
  });

  if (!journey) {
    return NextResponse.json({ error: 'Journey not found or not published' }, { status: 404 });
  }

  // Upsert the answer (replace if exists for this session/recipient)
  // For simplicity since we don't have recipient auth, we'll just upsert by journeyId+questionId
  // In a more complex setup, we might use a sessionId
  const answer = await prisma.journeyAnswer.upsert({
    where: {
      id: `${id}-${questionId}` // Consistent ID for this Q in this J
    },
    update: {
      answerText,
      answeredAt: new Date(),
      viewerHasSeen: false // Reset unseen status for creator
    },
    create: {
      id: `${id}-${questionId}`,
      journeyId: id,
      questionId,
      answerText,
    }
  });

  // Mark that responses are available
  await prisma.journey.update({
    where: { id },
    data: { responsesAvailable: true }
  });

  return NextResponse.json(answer);
}
