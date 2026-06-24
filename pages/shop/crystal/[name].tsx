// pages/shop/crystal/[name].tsx — products for a single crystal
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import TagListing from '@/components/shop/TagListing'
import { CRYSTALS } from '@/lib/crystalData'
import { toSlug } from '@/lib/shopTaxonomy'

export default function CrystalListingPage() {
  const router = useRouter()
  const slug = typeof router.query.name === 'string' ? router.query.name : ''
  const crystal = CRYSTALS.find((c) => toSlug(c) === slug) || ''
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
        />
      ) : (
        <div className="pt-40 pb-24 text-center container-cosmic">
          <p className="font-cinzel text-cosmic-cream/40">Crystal not found.</p>
        </div>
      )}
    </Layout>
  )
}
