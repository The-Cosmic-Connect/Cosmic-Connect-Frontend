// lib/legacyRedirect.ts
// ---------------------------------------------------------------------------
// Helpers for the old Wix URLs (/our-product/<slug>, /post/<slug>, ...) that
// Google and customers still have. Used only from getServerSideProps in the
// tiny redirect pages, so lookups run server-side (no CORS, no client JS).
// Every helper degrades to a sensible landing page instead of throwing.
// ---------------------------------------------------------------------------

const API = process.env.NEXT_PUBLIC_API_URL || 'https://xxuelki3p7.execute-api.ap-south-1.amazonaws.com'

async function getJson(path: string, ms = 4000): Promise<any | null> {
  const ctrl = new AbortController()
  const timer = setTimeout(() => ctrl.abort(), ms)
  try {
    const res = await fetch(`${API}${path}`, { signal: ctrl.signal })
    if (!res.ok) return null
    return await res.json()
  } catch {
    return null
  } finally {
    clearTimeout(timer)
  }
}

const STOP = new Set(['for', 'and', 'the', 'of', 'with', 'to', 'a', 'in', 'amp', 'reiki', 'charged', 'by', 'on'])

function tokens(s: string): string[] {
  return s.toLowerCase().split(/[^a-z0-9]+/).filter(t => t && !STOP.has(t))
}

function jaccard(a: string[], b: string[]): number {
  const A = new Set(a)
  const B = new Set(b)
  let inter = 0
  A.forEach(t => { if (B.has(t)) inter++ })
  const union = A.size + B.size - inter
  return union === 0 ? 0 : inter / union
}

/** Old Wix product slug -> new /shop/<slug> path (exact match, then closest match, else /shop). */
export async function resolveLegacyProduct(slug: string): Promise<string> {
  const clean = decodeURIComponent(slug || '').toLowerCase()
  if (!clean) return '/shop'

  const exact = await getJson(`/products/slug/${encodeURIComponent(clean)}`)
  const exactSlug = exact?.slug || exact?.product?.slug
  if (exactSlug) return `/shop/${exactSlug}`

  const want = tokens(clean)
  if (want.length === 0) return '/shop'
  const q = want.slice(0, 3).join(' ')
  const found = await getJson(`/products?search=${encodeURIComponent(q)}&limit=40`)
  const list: any[] = found?.products || []

  let best: { slug: string; score: number } | null = null
  for (const p of list) {
    if (!p?.slug) continue
    const score = Math.max(jaccard(want, tokens(p.slug)), jaccard(want, tokens(p.name || '')))
    if (!best || score > best.score) best = { slug: p.slug, score }
  }
  return best && best.score >= 0.5 ? `/shop/${best.slug}` : '/shop'
}

/** Old Wix blog post slug -> /blog/<slug> if that post exists on the new site, else /blog. */
export async function resolveLegacyPost(slug: string): Promise<string> {
  const clean = decodeURIComponent(slug || '').toLowerCase()
  if (!clean) return '/blog'
  const hit = await getJson(`/blog/slug/${encodeURIComponent(clean)}`)
  const found = hit?.slug || hit?.post?.slug
  return found ? `/blog/${found}` : '/blog'
}
