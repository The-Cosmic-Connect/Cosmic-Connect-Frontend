/**
 * Usage: buildBreadcrumbJsonLd([
 *   { name: 'Shop', url: '/shop' },
 *   { name: 'Bracelets', url: '/shop/collection/bracelets' },
 *   { name: 'Green Jade Bracelet', url: '/shop/green-jade-bracelet' },
 * ])
 */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecosmicconnect.in'

export function buildBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  }
}