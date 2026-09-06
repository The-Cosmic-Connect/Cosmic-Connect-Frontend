// ============================================================
// TEMPORARY SITE PASSWORD GATE — REMOVE BEFORE GOING LIVE
// Part of the temp gate along with /middleware.ts and /pages/site-password.tsx
// ============================================================
import type { NextApiRequest, NextApiResponse } from 'next'

const SITE_PASSWORD = 'Pm@9891261848'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method not allowed' })
  }

  const { password } = req.body || {}

  if (password === SITE_PASSWORD) {
    res.setHeader(
      'Set-Cookie',
      `site_access=granted; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
    )
    return res.status(200).json({ ok: true })
  }

  return res.status(401).json({ ok: false, error: 'Incorrect password' })
}
