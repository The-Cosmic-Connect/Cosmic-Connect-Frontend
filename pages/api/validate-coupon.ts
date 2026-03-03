import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'No coupon code provided' })

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const r = await fetch(`${backendUrl}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: code.toUpperCase().trim() }),
    })
    const data = await r.json()
    res.status(r.status).json(data)
  } catch {
    res.status(503).json({ error: 'Could not reach backend' })
  }
}
