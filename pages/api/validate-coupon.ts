import type { NextApiRequest, NextApiResponse } from "next"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code, items } = req.body
  if (!code) return res.status(400).json({ error: 'No coupon code provided' })

  const backendUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

  // Temporary debug — remove after fixing
  console.log('Backend URL:', backendUrl)
  console.log('Fetching:', `${backendUrl}/coupons/validate`)

  try {
    const r = await fetch(`${backendUrl}/coupons/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      // `items` (cart contents — id + collections per line) is optional and
      // lets the backend enforce/report per-product or per-product-type
      // coupon restrictions. Omitted entirely if not an array so older
      // callers of this route keep working unchanged.
      body: JSON.stringify({
        code: code.toUpperCase().trim(),
        ...(Array.isArray(items) ? { items } : {}),
      }),
    })
    const data = await r.json()
    res.status(r.status).json(data)
  } catch (err: any) {
    console.error('Fetch error:', err.message)
    res.status(503).json({ error: 'Could not reach backend', detail: err.message, url: backendUrl })
  }
}