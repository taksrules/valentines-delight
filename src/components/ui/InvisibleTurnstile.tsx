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
  const siteKey = (process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && !isLocal)
    ? process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
    : '1x00000000000000000000AA' // Cloudflare "Always Pass" Testing Key

  useEffect(() => {
    const keySource = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ? 'ENV' : 'MISSING';
    const keyPreview = siteKey.substring(0, 6) + '...' + siteKey.substring(siteKey.length - 4);
    console.error(`[TURNSTILE] Initializing widget. Host: ${window.location.hostname}, isLocal: ${isLocal}, KeySource: ${keySource}, Key: ${keyPreview}`);
    
    // Auto-execute
    if (turnstileRef.current) {
      console.log("[TURNSTILE] Found ref, executing...");
      turnstileRef.current.execute();
    }
  }, [isLocal, siteKey]);

  return (
    <div className="flex flex-col items-center gap-2 my-4">
      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{
          action: action,
          theme: 'light',
          size: 'normal', // TEMPORARILY VISIBLE for debugging production failures
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
    <button 
      type="button"
      onClick={() => {
        console.error("[TURNSTILE] Manual reset triggered");
        turnstileRef.current?.reset();
        turnstileRef.current?.execute();
      }}
      className="text-xs text-rose-400 hover:text-rose-500 underline underline-offset-4"
    >
      Problems verifying? Click to reload security.
    </button>
  </div>
  )
}
