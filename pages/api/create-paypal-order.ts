import type { NextApiRequest, NextApiResponse } from 'next'

// Get PayPal access token
async function getPayPalToken(): Promise<string> {
  const clientId = process.env.PAYPAL_CLIENT_ID!
  const secret = process.env.PAYPAL_SECRET!
  const base = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'

  const r = await fetch(`${base}/v1/oauth2/token`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString('base64')}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })
  const data = await r.json()
  return data.access_token
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { amountUSD, items, coupon, customerEmail } = req.body
  if (!amountUSD || !items?.length) return res.status(400).json({ error: 'Missing required fields' })

  try {
    const token = await getPayPalToken()
    const base = process.env.PAYPAL_BASE_URL || 'https://api-m.sandbox.paypal.com'
    const returnUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/shop/order-success`
    const cancelUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/shop/cart`

    const r = await fetch(`${base}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: 'USD',
              value: amountUSD.toFixed(2),
            },
            description: 'The Cosmic Connect — Crystal & Healing Products',
          },
        ],
        application_context: {
          return_url: returnUrl,
          cancel_url: cancelUrl,
          brand_name: 'The Cosmic Connect',
          user_action: 'PAY_NOW',
        },
      }),
    })

    const data = await r.json()
    if (!r.ok) return res.status(r.status).json(data)

    // Save order to backend
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    await fetch(`${backendUrl}/orders/paypal/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paypalOrderId: data.id, amountUSD, items, coupon, customerEmail }),
    }).catch(() => {}) // Non-blocking — don't fail checkout if this fails

    const approveUrl = data.links?.find((l: any) => l.rel === 'approve')?.href
    res.status(200).json({ orderId: data.id, approveUrl })
  } catch (err) {
    res.status(500).json({ error: 'PayPal order creation failed' })
  }
}
