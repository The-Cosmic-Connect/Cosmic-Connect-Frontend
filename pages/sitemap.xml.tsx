import { GetServerSideProps } from 'next'

const SITE_URL = 'https://www.thecosmicconnect.in'
const API      = process.env.NEXT_PUBLIC_API_URL || 'https://xxuelki3p7.execute-api.ap-south-1.amazonaws.com'

function generateSitemap(staticPages: string[], products: any[], collections: string[]): string {
  const now = new Date().toISOString()

  const staticUrls = staticPages.map(path => `
  <url>
    <loc>${SITE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${path === '/' ? 'weekly' : 'monthly'}</changefreq>
    <priority>${path === '/' ? '1.0' : path.startsWith('/shop') ? '0.9' : '0.7'}</priority>
  </url>`).join('')

  const collectionUrls = collections.map(col => {
    const slug = col.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `
  <url>
    <loc>${SITE_URL}/shop/collection/${slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
  }).join('')

  const productUrls = products.map(p => `
  <url>
    <loc>${SITE_URL}/shop/${p.slug}</loc>
    <lastmod>${p.updatedAt || now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${collectionUrls}
${productUrls}
</urlset>`
}

export default function Sitemap() { return null }

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const staticPages = [
    '/', '/shop', '/services', '/courses', '/about', '/videos', '/blog', '/book',
  ]

  let products: any[]   = []
  let collections: string[] = []

  try {
    // Fetch collections
    const colRes  = await fetch(`${API}/collections`)
    const colData = await colRes.json()
    collections   = colData.collections || []

    // Fetch all product slugs (lightweight — only need slug + updatedAt)
    let lastKey: any = null
    do {
      const url  = `${API}/products?limit=500${lastKey ? `&last_key=${encodeURIComponent(JSON.stringify(lastKey))}` : ''}`
      const data = await fetch(url).then(r => r.json())
      products   = [...products, ...(data.products || []).map((p: any) => ({ slug: p.slug, updatedAt: p.updatedAt }))]
      lastKey    = data.nextKey || null
    } while (lastKey)
  } catch (e) {
    console.error('Sitemap fetch error:', e)
  }

  const sitemap = generateSitemap(staticPages, products, collections)

  res.setHeader('Content-Type', 'text/xml')
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate')
  res.write(sitemap)
  res.end()

  return { props: {} }
}