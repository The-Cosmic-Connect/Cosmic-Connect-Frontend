import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Get real IP — handle proxies/load balancers
    const forwarded = req.headers['x-forwarded-for']
    const ip =
      (Array.isArray(forwarded) ? forwarded[0] : forwarded?.split(',')[0]) ||
      req.socket.remoteAddress ||
      ''

    // Skip geo lookup for localhost during development
    if (ip === '127.0.0.1' || ip === '::1' || ip.startsWith('192.168') || ip.startsWith('10.')) {
      return res.status(200).json({ country: 'IN', ip, dev: true })
    }

    // ipapi.co — free tier, 30k requests/month, no API key needed
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { 'User-Agent': 'thecosmicconnect.com' },
    })
    const data = await geoRes.json()

    res.status(200).json({
      country: data.country_code || 'IN',
      country_name: data.country_name || 'India',
      city: data.city || '',
      ip,
    })
  } catch (err) {
    // Safe fallback — default to India
    res.status(200).json({ country: 'IN', fallback: true })
  }
}
