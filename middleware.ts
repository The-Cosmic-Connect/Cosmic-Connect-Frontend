// ============================================================
// TEMPORARY SITE PASSWORD GATE — REMOVE BEFORE GOING LIVE
// Delete this file + pages/site-password.tsx + pages/api/site-password.ts
// to fully remove the gate.
// ============================================================
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const COOKIE_NAME = 'site_access'
const COOKIE_VALUE = 'granted'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const isBypassed =
    pathname.startsWith('/site-password') ||
    // All API routes bypass the gate — they're POST/JSON endpoints (payment
    // initiation, coupon checks, etc), not pages. A missing site_access
    // cookie must never redirect an API call to the (page-only, GET)
    // /site-password route — that redirect breaks the API call outright
    // (Vercel returns a bare 400 for a POST to a page route, before the
    // route's own handler ever runs).
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/favicon')

  if (isBypassed) return NextResponse.next()

  const cookie = req.cookies.get(COOKIE_NAME)?.value
  if (cookie === COOKIE_VALUE) return NextResponse.next()

  const url = req.nextUrl.clone()
  url.pathname = '/site-password'
  url.searchParams.set('redirect', pathname)
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
