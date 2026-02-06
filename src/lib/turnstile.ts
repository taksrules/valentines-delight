/**
 * Cloudflare Turnstile verification utilities
 * CRITICAL: Always verify server-side, never trust client
 */

interface TurnstileVerification {
  success: boolean
  error?: string
}

/**
 * Verify Turnstile token with Cloudflare API
 * @param token - Token from client-side Turnstile widget
 * @param ip - Client IP address (optional but recommended)
 * @returns Promise with success status
 */
export async function verifyTurnstileToken(
  token: string,
  ip?: string
): Promise<TurnstileVerification> {
  
  // Validate token exists
  if (!token || typeof token !== 'string') {
    return { 
      success: false, 
      error: 'No verification token provided' 
    }
  }

  const SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

  if (!SECRET_KEY) {
    console.error('[SECURITY] TURNSTILE_SECRET_KEY not configured')
    return { 
      success: false, 
      error: 'Server configuration error' 
    }
  }

  try {
    const response = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          secret: SECRET_KEY,
          response: token,
          remoteip: ip, // Optional but recommended
        }),
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error('[TURNSTILE] API error:', data)
      return { 
        success: false, 
        error: 'Verification service unavailable' 
      }
    }

    if (data.success !== true) {
      console.warn('[TURNSTILE] Verification failed:', data['error-codes'])
      return { 
        success: false, 
        error: 'Verification failed. Please try again.' 
      }
    }

    // Success
    console.log('[TURNSTILE] ✅ Verification passed')
    return { success: true }

  } catch (error) {
    console.error('[TURNSTILE] Verification error:', error)
    return { 
      success: false, 
      error: 'Verification error. Please try again.' 
    }
  }
}

/**
 * Extract client IP address from request headers
 * @param request - Next.js Request object
 * @returns IP address string
 */
export function getClientIP(request: Request): string {
  return (
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    request.headers.get('x-real-ip') ||
    'unknown'
  )
}
