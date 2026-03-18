/**
 * Drop this into pages/shop/[slug].tsx:
 *
 * import { buildProductJsonLd } from '@/components/ProductJsonLd'
 *
 * Then in <Layout jsonLd={buildProductJsonLd(product)} ...>
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecosmicconnect.in'

export function buildProductJsonLd(product: any, isIndia = true) {
  const price    = isIndia ? product.priceINR    : product.priceUSD
  const currency = isIndia ? 'INR' : 'USD'
  const origPrice = isIndia ? product.originalPriceINR : product.originalPriceUSD
  const hasDiscount = origPrice > 0 && origPrice > price

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images || [],
    sku: product.sku || product.id,
    brand: {
      '@type': 'Brand',
      name: product.brand || 'The Cosmic Connect',
    },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}/shop/${product.slug}`,
      priceCurrency: currency,
      price: price,
      ...(hasDiscount && { priceValidUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] }),
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
      seller: {
        '@type': 'Organization',
        name: 'The Cosmic Connect',
      },
    },
  }
}