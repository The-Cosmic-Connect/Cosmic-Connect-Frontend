// pages/shop/crystals.tsx — "Shop by Crystal" landing (ISR-rendered)
//
// Data is fetched at build time (and re-generated every 10 minutes) on the
// Vercel server, then the fully-rendered HTML is served from the edge. Users
// see the tiles instantly — no spinner, no client-side fetch.
import { useMemo, useState } from 'react'
import type { GetStaticProps } from 'next'
import { Search, X } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import BrowseTiles, { BrowseTile } from '@/components/shop/BrowseTiles'
import { toSlug } from '@/lib/shopTaxonomy'
import { isCrystalTag, crystalCoverUrl } from '@/lib/crystalData'

interface Props { tiles: BrowseTile[] }

export default function CrystalsPage({ tiles }: Props) {
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return q ? tiles.filter((t) => t.name.toLowerCase().includes(q)) : tiles
  }, [tiles, search])

  return (
    <Layout
      title="Shop by Crystal | The Cosmic Connect"
      description="Browse authentic healing crystals by stone — Amethyst, Rose Quartz, Citrine, Tiger Eye and more. Cleansed and energized by Reiki Grand Masters."
      canonical="/shop/crystals"
    >
      <section className="relative pt-36 pb-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Shop by Crystal ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Browse <span className="text-gradient-gold">By Crystal</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto mb-8">
            Find your stone — each one cleansed &amp; energized before it reaches you
          </p>
          <div className="flex items-center gap-0 max-w-md mx-auto border border-cosmic-gold/30 bg-cosmic-black/40 backdrop-blur-sm">
            <Search size={15} className="ml-4 text-cosmic-cream/30 shrink-0" />
            <input type="text" placeholder="Search crystals..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25 outline-none px-3 py-3 tracking-wide" />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="px-3 text-cosmic-cream/30 hover:text-cosmic-gold transition-colors">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex items-center justify-between">
          <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest">
            {`${filtered.length} crystal${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <section className="py-12 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-cinzel text-cosmic-cream/40 text-sm mb-2">No crystals found</p>
              <button onClick={() => setSearch('')} className="btn-outline text-xs mt-4">Clear Search</button>
            </div>
          ) : (
            <BrowseTiles tiles={filtered} />
          )}
        </div>
      </section>
    </Layout>
  )
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Walk the paginated /products endpoint server-side once at build/revalidate.
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
    console.error('getStaticProps /shop/crystals: fetch failed', e)
  }

  const map: Record<string, { count: number; image: string }> = {}
  for (const p of products) {
    for (const tag of p.tags || []) {
      if (!isCrystalTag(tag)) continue
      const key = (tag || '').trim()
      if (!map[key]) map[key] = { count: 0, image: '' }
      map[key].count++
      if (!map[key].image && p.images?.[0]) map[key].image = p.images[0]
    }
  }

  const tiles: BrowseTile[] = Object.entries(map)
    .map(([name, v]) => ({
      name,
      count: v.count,
      image: crystalCoverUrl(name),
      fallback: v.image,
      href: `/shop/crystal/${toSlug(name)}`,
      icon: '💎',
    }))
    .sort((a, b) => b.count - a.count)

  return {
    props: { tiles },
    revalidate: 600,   // refresh once every 10 minutes
  }
}
