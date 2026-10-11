// ============================================================
// SITE PASSWORD GATE — DISABLED (site is live)
//
// The gate is commented out below so every page is public. To bring it back,
// uncomment the block and remove the early `return NextResponse.next()`
// (or set the Vercel env var SITE_GATE and restore the original logic).
// pages/site-password.tsx and pages/api/site-password.ts are left in place
// but are no longer reachable through a redirect.
// ============================================================
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// const COOKIE_NAME = 'site_access'
// const COOKIE_VALUE = 'granted'
//
// // GO-LIVE SWITCH: the gate was ON for every hostname until the Vercel env
// // var SITE_GATE was set to "off". Now disabled in code instead.
// const GATE_OFF = process.env.SITE_GATE === 'off'

export function middleware(_req: NextRequest) {
  return NextResponse.next()

  // ---- original gate logic (disabled) ----
  // const { pathname } = req.nextUrl
  //
  // if (GATE_OFF) return NextResponse.next()
  //
  // const isBypassed =
  //   pathname.startsWith('/site-password') ||
  //   // All API routes bypass the gate — they're POST/JSON endpoints (payment
  //   // initiation, coupon checks, etc), not pages.
  //   pathname.startsWith('/api/') ||
  //   pathname.startsWith('/_next') ||
  //   pathname.startsWith('/favicon')
  //
  // if (isBypassed) return NextResponse.next()
  //
  // const cookie = req.cookies.get(COOKIE_NAME)?.value
  // if (cookie === COOKIE_VALUE) return NextResponse.next()
  //
  // const url = req.nextUrl.clone()
  // url.pathname = '/site-password'
  // url.searchParams.set('redirect', pathname)
  // return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
