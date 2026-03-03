import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { amountINR, items, coupon, customerEmail, customerName, customerPhone } = req.body
  if (!amountINR || !items?.length) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    const r = await fetch(`${backendUrl}/orders/phonepe/initiate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amountINR, items, coupon, customerEmail, customerName, customerPhone }),
    })
    const data = await r.json()
    res.status(r.status).json(data)
  } catch {
    res.status(503).json({ error: 'Could not reach backend' })
  }
}
