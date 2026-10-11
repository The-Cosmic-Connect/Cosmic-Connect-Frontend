// lib/listingProduct.ts
//
// Slim a product down to what a product GRID needs (ProductCard + the tag /
// category / price filters). Used in getStaticProps of the crystal and purpose
// listing pages so Next doesn't embed every product's long description, specs,
// options and full image gallery in the page data (it was 3–5 MB per page).
//
// The full product is still loaded on the product detail page, and the client
// product cache (lib/fetchProducts.ts) is unaffected.
//
// Keys are kept (blank) so the object still satisfies the Product type, and
// nothing is `undefined` because getStaticProps props must be JSON-serialisable.
import type { Product } from '@/types/product'

export function toListingProduct(p: Product): Product {
  return {
    id:               p.id,
    name:             p.name,
    slug:             p.slug,
    sku:              '',
    description:      '',
    collections:      p.collections || [],
    priceINR:         p.priceINR ?? 0,
    priceUSD:         p.priceUSD ?? 0,
    originalPriceINR: p.originalPriceINR ?? 0,
    originalPriceUSD: p.originalPriceUSD ?? 0,
    discountValue:    p.discountValue ?? 0,
    ribbon:           p.ribbon || '',
    images:           (p.images || []).slice(0, 1),   // card shows only the first
    specs:            [],
    options:          [],
    tags:             p.tags || [],
    inStock:          !!p.inStock,
    stock:            p.stock ?? 0,
    published:        !!p.published,
    featured:         !!p.featured,
  }
}
