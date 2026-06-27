// pages/shop/crystal/[name].tsx — products for a single crystal
//
// ISR with fallback: 'blocking'. No paths are pre-built at deploy time (250+
// crystals would make builds slow for pages that mostly get long-tail SEO
// traffic). Instead: the FIRST visitor to any given crystal page triggers a
// server-side render, which Next.js then caches as static HTML for everyone
// after — and re-validates in the background every 10 minutes. This is what
// actually fixes the "3-5s cold load" problem: the expensive product-list
// fetch happens once per revalidation window, not once per visitor.
import type { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import TagListing from '@/components/shop/TagListing'
import { CRYSTALS } from '@/lib/crystalData'
import { toSlug } from '@/lib/shopTaxonomy'
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Props {
  crystal:  string
  slug:     string
  products: Product[]
}

export default function CrystalListingPage({ crystal, slug, products }: Props) {
  const title = crystal || (slug ? slug.replace(/-/g, ' ') : 'Crystal')

  return (
    <Layout
      title={`${title} | Shop by Crystal | The Cosmic Connect`}
      description={`Shop authentic ${title} crystals and healing products, cleansed and energized by Reiki Grand Masters.`}
      canonical={`/shop/crystal/${slug}`}
    >
      {crystal ? (
        <TagListing
          tag={crystal}
          title={crystal}
          eyebrow="Crystal"
          icon="💎"
          backHref="/shop/crystals"
          backLabel="All Crystals"
          initialProducts={products}
        />
      ) : (
        <div className="pt-40 pb-24 text-center container-cosmic">
          <p className="font-cinzel text-cosmic-cream/40">Crystal not found.</p>
        </div>
      )}
    </Layout>
  )
}

// Pre-build nothing at deploy time; every path is generated on first request
// and cached from then on. Keeps `next build` fast regardless of catalog size.
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug = typeof ctx.params?.name === 'string' ? ctx.params.name : ''
  const crystal = CRYSTALS.find((c) => toSlug(c) === slug) || ''

  if (!crystal) {
    // Unknown slug — render the "not found" state but still return 200 so it
    // doesn't loop in fallback:'blocking'. revalidate short so a typo'd URL
    // doesn't stay cached as "not found" for long if the crystal list changes.
    return { props: { crystal: '', slug, products: [] }, revalidate: 60 }
  }

  // Plain server-side fetch — deliberately NOT using lib/fetchProducts.ts,
  // which depends on localStorage/window and only works client-side.
  let products: Product[] = []
  try {
    let lastKey: any = null
    do {
      const url = lastKey
        ? `${API}/products?limit=500&last_key=${encodeURIComponent(JSON.stringify(lastKey))}`
        : `${API}/products?limit=500`
      const res = await fetch(url)
      if (!res.ok) break
      const data = await res.json()
      products = products.concat(data.products || [])
      lastKey = data.nextKey || null
    } while (lastKey)
  } catch (e) {
    console.error(`getStaticProps /shop/crystal/${slug}: products fetch failed`, e)
  }

  // Pre-filter to just this crystal's tag server-side. Keeps the pre-rendered
  // HTML small — TagListing still does category/price filtering client-side,
  // but doesn't need the full 2000+ catalog to do it.
  const want = crystal.trim().toLowerCase()
  const matched = products.filter((p) =>
    (p.tags || []).some((t) => (t || '').trim().toLowerCase() === want),
  )

  return {
    props: { crystal, slug, products: matched },
    revalidate: 600,   // 10 minutes, same cadence as /shop
  }
}
