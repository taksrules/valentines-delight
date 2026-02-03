import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';

// POST /api/v1/journeys/[id]/questions - Add/update questions
export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const { id } = await params;

    const journey = await prisma.journey.findUnique({
      where: { id }
    });

    if (!journey) {
      return NextResponse.json(
        { success: false, error: { code: 'NOT_FOUND', message: 'Journey not found' } },
        { status: 404 }
      );
    }

    if (journey.creatorId !== session!.user!.id) {
      return NextResponse.json(
        { success: false, error: { code: 'FORBIDDEN', message: 'Not authorized' } },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { questions } = body;

    if (!Array.isArray(questions) || questions.length !== 4) {
      return NextResponse.json(
        { success: false, error: { code: 'VALIDATION_ERROR', message: 'Exactly 4 questions required' } },
        { status: 422 }
      );
    }

    // Delete existing questions
    await prisma.journeyQuestion.deleteMany({
      where: { journeyId: id }
    });

    // Create new questions
    await prisma.journeyQuestion.createMany({
      data: questions.map((q: any, index: number) => ({
        journeyId: id,
        questionOrder: index + 1,
        questionText: q.questionText,
        option1: q.option1,
        option2: q.option2,
        option3: q.option3,
        option4: q.option4 || null,
        acknowledgmentText: q.acknowledgmentText,
      }))
    });

    return NextResponse.json({
      success: true,
      message: 'Questions saved successfully'
    });
  } catch (error) {
    console.error('Error saving questions:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: 'Failed to save questions'
        }
      },
      { status: 500 }
    );
  }
}
