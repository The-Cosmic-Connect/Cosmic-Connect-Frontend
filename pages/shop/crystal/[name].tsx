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

  // Server-side tag filter: the backend's FilterExpression does the work
  // during the DynamoDB scan, so this returns only the ~10-50 products that
  // actually match this crystal — NOT the full 2,000+ catalog. This is the
  // fix for the 15-20s cold-render delay that plain `?limit=500` pagination
  // caused (it had to walk every page of the entire catalog on every
  // cache-miss render, compounding with Lambda cold starts).
  let products: Product[] = []
  try {
    let lastKey: any = null
    do {
      const params = new URLSearchParams({ tag: crystal, limit: '500' })
      if (lastKey) params.set('last_key', JSON.stringify(lastKey))
      const res = await fetch(`${API}/products?${params}`)
      if (!res.ok) break
      const data = await res.json()
      products = products.concat(data.products || [])
      lastKey = data.nextKey || null
    } while (lastKey)
  } catch (e) {
    console.error(`getStaticProps /shop/crystal/${slug}: products fetch failed`, e)
  }

  return {
    props: { crystal, slug, products },
    revalidate: 600,   // 10 minutes, same cadence as /shop
  }
}
