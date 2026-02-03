import { auth } from '@/lib/auth';
import { NextResponse } from 'next/server';

/**
 * Get the current session in API routes
 * Returns the session or null if not authenticated
 */
export async function getSession() {
  try {
    const session = await auth();
    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Middleware to check authentication in API routes
 * Returns error response if not authenticated, otherwise returns session
 */
export async function requireAuth() {
  const session = await getSession();
  
  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { success: false, error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      ),
      session: null
    };
  }
  
  return { error: null, session };
}
