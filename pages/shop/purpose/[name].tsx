// pages/shop/purpose/[name].tsx — products for a single purpose
// Same ISR pattern as the crystal page — see that file's header comment.
import type { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import TagListing from '@/components/shop/TagListing'
import { PURPOSES } from '@/lib/crystalData'
import { toSlug } from '@/lib/shopTaxonomy'
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Props {
  purposeKey:  string
  purposeIcon: string
  slug:        string
  products:    Product[]
}

export default function PurposeListingPage({ purposeKey, purposeIcon, slug, products }: Props) {
  const title = purposeKey || (slug ? slug.replace(/-/g, ' ') : 'Purpose')

  return (
    <Layout
      title={`${title} | Shop by Purpose | The Cosmic Connect`}
      description={`Shop crystals and healing products for ${title}, cleansed and energized by Reiki Grand Masters.`}
      canonical={`/shop/purpose/${slug}`}
    >
      {purposeKey ? (
        <TagListing
          tag={purposeKey}
          title={purposeKey}
          eyebrow="Purpose"
          icon={purposeIcon}
          backHref="/shop/purposes"
          backLabel="All Purposes"
          initialProducts={products}
        />
      ) : (
        <div className="pt-40 pb-24 text-center container-cosmic">
          <p className="font-cinzel text-cosmic-cream/40">Purpose not found.</p>
        </div>
      )}
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  // Only 10 purposes — cheap to pre-build all of them at deploy time, unlike
  // the 250+ crystal pages. Still keep fallback:'blocking' as a safety net
  // in case a new purpose is added without a redeploy.
  const paths = PURPOSES.map((p) => ({ params: { name: toSlug(p.key) } }))
  return { paths, fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps<Props> = async (ctx) => {
  const slug  = typeof ctx.params?.name === 'string' ? ctx.params.name : ''
  const match = PURPOSES.find((p) => toSlug(p.key) === slug)

  if (!match) {
    return { props: { purposeKey: '', purposeIcon: '', slug, products: [] }, revalidate: 60 }
  }

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
    console.error(`getStaticProps /shop/purpose/${slug}: products fetch failed`, e)
  }

  const want = match.key.trim().toLowerCase()
  const matched = products.filter((p) =>
    (p.tags || []).some((t) => (t || '').trim().toLowerCase() === want),
  )

  return {
    props: { purposeKey: match.key, purposeIcon: match.icon, slug, products: matched },
    revalidate: 600,
  }
}
