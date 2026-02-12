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
    console.error("[TURNSTILE] InvisibleTurnstile mounted. Executing widget...");
    turnstileRef.current?.execute()
  }, [])

  // Improved local detection for dev environments
  const isLocal = typeof window !== 'undefined' && (
      window.location.hostname === 'localhost' || 
      window.location.hostname === '127.0.0.1' ||
      window.location.hostname.endsWith('.local') ||
      !window.location.hostname.includes('.')
    )
  
  // CRITICAL: Ensure siteKey matches the logic in lib/turnstile.ts
  const rawKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const isKeyValid = rawKey?.startsWith('0x');
  
  const siteKey = (isKeyValid && !isLocal)
    ? rawKey!
    : '1x00000000000000000000AA' // Cloudflare "Always Pass" Testing Key

  const keySource = isKeyValid ? 'ENV' : (rawKey ? 'INVALID_STRING' : 'MISSING');
  
  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{
          action: action,
          theme: 'light',
          size: 'normal',
        }}
        onSuccess={(token) => {
          onVerify(token)
        }}
        onError={(error) => {
          console.error('[TURNSTILE] ❌ Error:', error)
          onError?.('Verification failed. Please check your connection or try again.')
        }}
        onExpire={() => {
          turnstileRef.current?.reset()
          turnstileRef.current?.execute()
        }}
      />
      
      {!isLocal && !isKeyValid && (
        <p className="text-[10px] text-rose-500 font-medium">
          ⚠️ Configuration error. Please contact support.
        </p>
      )}

      <p className="text-[10px] text-neutral-400 px-4 text-center">
        Security check by Cloudflare
      </p>
    </div>
  )
}
