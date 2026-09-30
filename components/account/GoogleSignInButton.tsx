import { useEffect, useRef, useState } from 'react'
import Script from 'next/script'

// NOTE: this comment exists solely to force a cache-busting rebuild on
// Vercel (1 Oct 2026) — a prior deploy reused a cached build whose compiled
// output was missing NEXT_PUBLIC_GOOGLE_CLIENT_ID even after the env var was
// added. A genuine source diff forces Next.js to recompile this file's
// chunk with the current env value. Safe to remove once confirmed working.

// Google Identity Services (GIS) — the modern replacement for the old
// gapi.auth2 library. This renders Google's own button (styling controlled
// via the options below, not by us) and hands back a signed ID token
// ("credential") the moment someone completes the Google flow. That token
// is verified server-side in POST /auth/google (utils/auth.py::
// verify_google_id_token) — this component never trusts it itself, it just
// relays it upward.
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string
            callback: (response: { credential: string }) => void
          }) => void
          renderButton: (parent: HTMLElement, options: Record<string, unknown>) => void
        }
      }
    }
  }
}

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || ''

interface GoogleSignInButtonProps {
  onCredential: (credential: string) => void
  onError?: (message: string) => void
  /** 'signin_with' | 'signup_with' | 'continue_with' — Google's own copy on the button */
  text?: 'signin_with' | 'signup_with' | 'continue_with'
}

export default function GoogleSignInButton({
  onCredential, onError, text = 'continue_with',
}: GoogleSignInButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)

  useEffect(() => {
    if (!scriptLoaded || !GOOGLE_CLIENT_ID || !buttonRef.current || !window.google) return
    try {
      window.google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: (response) => onCredential(response.credential),
      })
      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: 'filled_black',
        size: 'large',
        width: 320,
        text,
        shape: 'rectangular',
        logo_alignment: 'center',
      })
    } catch {
      onError?.('Could not load Google Sign-In right now')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scriptLoaded])

  // Not configured yet (NEXT_PUBLIC_GOOGLE_CLIENT_ID unset) — render
  // nothing rather than a broken/inert button. Email + password sign-in
  // works fully without this; see auth-deploy-guide.md to enable it.
  if (!GOOGLE_CLIENT_ID) return null

  return (
    <>
      <Script
        src="https://accounts.google.com/gsi/client"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />
      <div ref={buttonRef} className="flex justify-center" />
    </>
  )
}
