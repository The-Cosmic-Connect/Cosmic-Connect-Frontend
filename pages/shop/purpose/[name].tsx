// pages/shop/purpose/[name].tsx — products for a single purpose
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import TagListing from '@/components/shop/TagListing'
import { PURPOSES } from '@/lib/crystalData'
import { toSlug } from '@/lib/shopTaxonomy'

export default function PurposeListingPage() {
  const router = useRouter()
  const slug = typeof router.query.name === 'string' ? router.query.name : ''
  const match = PURPOSES.find((p) => toSlug(p.key) === slug)
  const title = match?.key || (slug ? slug.replace(/-/g, ' ') : 'Purpose')

  return (
    <Layout
      title={`${title} | Shop by Purpose | The Cosmic Connect`}
      description={`Shop crystals and healing products for ${title}, cleansed and energized by Reiki Grand Masters.`}
      canonical={`/shop/purpose/${slug}`}
    >
      {match ? (
        <TagListing
          tag={match.key}
          title={match.key}
          eyebrow="Purpose"
          icon={match.icon}
          backHref="/shop/purposes"
          backLabel="All Purposes"
        />
      ) : (
        <div className="pt-40 pb-24 text-center container-cosmic">
          <p className="font-cinzel text-cosmic-cream/40">Purpose not found.</p>
        </div>
      )}
    </Layout>
  )
}
