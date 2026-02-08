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

  useEffect(() => {
    const keySource = isKeyValid ? 'ENV' : (rawKey ? 'INVALID_STRING' : 'MISSING');
    const keyPreview = siteKey.substring(0, 6) + '...' + siteKey.substring(siteKey.length - 4);
    console.error(`[TURNSTILE] Initializing widget. Host: ${window.location.hostname}, isLocal: ${isLocal}, KeySource: ${keySource}, Key: ${keyPreview}`);
    
    // Auto-execute
    if (turnstileRef.current) {
      console.log("[TURNSTILE] Found ref, executing...");
      turnstileRef.current.execute();
    }
  }, [isLocal, siteKey]);

  return (
    <div className="flex flex-col items-center gap-3 my-6 p-4 border-2 border-dashed border-rose-200 dark:border-rose-900 rounded-2xl bg-rose-50/50 dark:bg-rose-950/20">
      <div className="text-[10px] font-mono text-rose-500 dark:text-rose-400 text-center space-y-1">
        <p>DIAGNOSTIC MODE: {isLocal ? 'DEVELOPMENT' : 'PRODUCTION'}</p>
        <p>HOST: {typeof window !== 'undefined' ? window.location.hostname : 'N/A'}</p>
        {!isKeyValid && !isLocal && (
          <p className="font-bold text-rose-600 animate-pulse">⚠️ CONFIG ERROR: INVALID SITE KEY FOUND</p>
        )}
        <p>KEY: {siteKey.substring(0, 10)}... (Source: {isKeyValid ? 'VALID_ENV' : 'FORCED_TEST_KEY'})</p>
      </div>

      <Turnstile
        ref={turnstileRef}
        siteKey={siteKey}
        options={{
          action: action,
          theme: 'light',
          size: 'normal',
          execution: 'render',
        }}
        onSuccess={(token) => {
          console.log('[TURNSTILE] ✅ Verified')
          onVerify(token)
        }}
        onError={(error) => {
          console.error('[TURNSTILE] ❌ Error:', error)
          // Don't just show a generic error, show the raw Cloudflare code if available
          const errorMsg = typeof error === 'string' ? error : 'Check your Cloudflare Dashboard (Domain may not be allowed)';
          onError?.(`Verification failed: ${errorMsg}`)
        }}
        onExpire={() => {
          console.warn('[TURNSTILE] ⏰ Token expired, retrying...')
          turnstileRef.current?.reset()
          turnstileRef.current?.execute()
        }}
      />
      
      <div className="flex flex-col items-center gap-2">
        <button 
          type="button"
          onClick={() => {
            console.error("[TURNSTILE] Manual reset triggered");
            turnstileRef.current?.reset();
            turnstileRef.current?.execute();
          }}
          className="text-sm font-medium text-rose-500 hover:text-rose-600 underline underline-offset-4"
        >
          Can't see the checkmark? Click to retry.
        </button>
        <p className="text-[10px] text-neutral-400 px-4 text-center">
          Security by Cloudflare. If you use a strict Ad-Blocker or Brave browser, you may need to disable it for this site.
        </p>
      </div>
    </div>
  )
}
