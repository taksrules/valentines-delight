import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth-helpers';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const profileSchema = z.object({
  name: z.string().min(2).max(50).optional(),
  image: z.string().url().optional().or(z.literal('')),
});

export async function PATCH(request: Request) {
  try {
    const { error, session } = await requireAuth();
    if (error) return error;

    const body = await request.json();
    const validatedData = profileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session!.user!.id },
      data: {
        name: validatedData.name,
        image: validatedData.image || null,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: updatedUser,
    });
  } catch (error:any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'VALIDATION_ERROR', details: error?.issues },
        { status: 400 }
      );
    }

    console.error('[User Profile API] Error updating profile:', error);
    return NextResponse.json(
      { success: false, error: 'INTERNAL_ERROR', message: 'Failed to update profile' },
      { status: 500 }
    );
  }
}
