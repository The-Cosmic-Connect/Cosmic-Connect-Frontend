// pages/shop/purposes.tsx — "Shop by Purpose" landing (ISR-rendered)
import type { GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import BrowseTiles, { BrowseTile } from '@/components/shop/BrowseTiles'
import { toSlug } from '@/lib/shopTaxonomy'
import { PURPOSES, purposeCoverUrl } from '@/lib/crystalData'

interface Props { tiles: BrowseTile[] }

export default function PurposesPage({ tiles }: Props) {
  return (
    <Layout
      title="Shop by Purpose | The Cosmic Connect"
      description="Find crystals by what you need — abundance, love, protection, healing, calm, confidence and more. Cleansed and energized by Reiki Grand Masters."
      canonical="/shop/purposes"
    >
      <section className="relative pt-36 pb-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Shop by Purpose ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Browse <span className="text-gradient-gold">By Purpose</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto">
            What are you seeking? Let your intention guide your crystal.
          </p>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic">
          <BrowseTiles tiles={tiles} />
        </div>
      </section>
    </Layout>
  )
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const getStaticProps: GetStaticProps<Props> = async () => {
  let products: any[] = []
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
    console.error('getStaticProps /shop/purposes: fetch failed', e)
  }

  const map: Record<string, { count: number; image: string }> = {}
  for (const p of products) {
    const tags = (p.tags || []).map((t: string) => (t || '').trim().toLowerCase())
    for (const purpose of PURPOSES) {
      if (tags.includes(purpose.key.toLowerCase())) {
        if (!map[purpose.key]) map[purpose.key] = { count: 0, image: '' }
        map[purpose.key].count++
        if (!map[purpose.key].image && p.images?.[0]) map[purpose.key].image = p.images[0]
      }
    }
  }

  const tiles: BrowseTile[] = PURPOSES
    .filter((p) => map[p.key])
    .map((p) => ({
      name: p.key,
      count: map[p.key].count,
      image: purposeCoverUrl(p.key),
      fallback: map[p.key].image,
      href: `/shop/purpose/${toSlug(p.key)}`,
      icon: p.icon,
    }))
    .sort((a, b) => b.count - a.count)

  return { props: { tiles }, revalidate: 600 }
}
