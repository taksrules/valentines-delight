'use client'

import { Turnstile, TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef, useEffect } from 'react'

interface InvisibleTurnstileProps {
  onVerify: (token: string) => void
  onError?: (error: string) => void
  action?: string
}

/**
 * Invisible Turnstile CAPTCHA component
 * Shows no UI to legitimate users, only challenges suspected bots
 */
export function InvisibleTurnstile({ 
  onVerify, 
  onError,
  action = 'submit'
}: InvisibleTurnstileProps) {
  const turnstileRef = useRef<TurnstileInstance>(null)

  // Auto-execute on mount
  useEffect(() => {
    turnstileRef.current?.execute()
  }, [])

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  if (!siteKey) {
    console.error('[TURNSTILE] Site key not configured')
    return null
  }

  return (
    <Turnstile
      ref={turnstileRef}
      siteKey={siteKey}
      options={{
        action: action,
        theme: 'light',
        size: 'invisible', // CRITICAL: invisible mode
        execution: 'render',
      }}
      onSuccess={(token) => {
        console.log('[TURNSTILE] ✅ Verified')
        onVerify(token)
      }}
      onError={(error) => {
        console.error('[TURNSTILE] ❌ Error:', error)
        onError?.('Verification failed. Please refresh and try again.')
      }}
      onExpire={() => {
        console.warn('[TURNSTILE] ⏰ Token expired, retrying...')
        // Auto-retry on expiry
        turnstileRef.current?.reset()
        turnstileRef.current?.execute()
      }}
    />
  )
}
