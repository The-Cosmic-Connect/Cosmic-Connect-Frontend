// pages/shop/index.tsx — Shop chooser landing
//
// Two horizontal carousels (Featured + Bestsellers) sit above the chooser
// tiles. Both are pre-rendered server-side via ISR (revalidate every 10 min)
// so the user gets fully-baked HTML on first paint — no client fetch, no
// loading state. The "Bestsellers" list is sourced from the admin-toggleable
// mode (manual = bestseller flag, auto = sales-derived top sellers).
import Link from 'next/link'
import type { GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import FeaturedCarousel from '@/components/shop/FeaturedCarousel'
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Mode {
  href: string; icon: string; title: string; tagline: string
  description: string; highlights: string[]; cta: string
}

const MODES: Mode[] = [
  {
    href: '/shop/purposes',
    icon: '✨',
    title: 'Shop by Purpose',
    tagline: 'Start with what you need',
    description: 'New to crystals or have something specific in mind? Tell us your intention — love, abundance, calm, protection — and we\'ll guide you to the right stones.',
    highlights: ['Love & Relationships', 'Abundance & Wealth', 'Calm & Stress Relief', 'Protection & Cleansing'],
    cta: 'Find by intention',
  },
  {
    href: '/shop/crystals',
    icon: '💎',
    title: 'Shop by Crystal',
    tagline: 'Already know the stone?',
    description: 'Browse by crystal name — Amethyst, Rose Quartz, Tiger Eye and more. Perfect when you already know what you\'re looking for.',
    highlights: ['250+ crystal varieties', 'Real photos for every stone', 'Filter within each crystal'],
    cta: 'Browse by stone',
  },
  {
    href: '/shop/categories',
    icon: '🗂',
    title: 'Shop by Category',
    tagline: 'Browse the whole shop',
    description: 'Bracelets, raw stones, pyramids, malas, jewellery and more — explore by product type, the way a physical store is laid out.',
    highlights: ['28 collections', 'Bracelets & Malas', 'Shapes & Figures', 'Home & Vaastu'],
    cta: 'Browse categories',
  },
]

interface Props {
  featured:    Product[]
  bestsellers: Product[]
}

export default function ShopChooserPage({ featured, bestsellers }: Props) {
  return (
    <Layout
      title="Crystal & Healing Products Shop | The Cosmic Connect"
      description="Shop 100% authentic crystals, healing bracelets, malas, yantras and spiritual tools. Browse by purpose, crystal or category."
      canonical="/shop"
    >
      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-cosmic-gold/20 hidden lg:block" />
        <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-cosmic-gold/20 hidden lg:block" />
        <div className="container-cosmic relative z-10 text-center">
          <p className="font-script text-cosmic-gold text-2xl mb-2">The Cosmic Shop</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            How would you like to <span className="text-gradient-gold">shop today?</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-2xl mx-auto">
            Three ways in — pick what feels right.
          </p>
          <div className="flex flex-wrap justify-center gap-6 mt-8">
            {['✦ Authentic & Certified', '✦ Reiki Energized', '✦ Free Shipping ₹1999+', '✦ 50,000+ Happy Customers'].map((b) => (
              <span key={b} className="font-raleway text-cosmic-cream/35 text-xs tracking-widest">{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Featured + Bestseller carousels (only render when there's content) */}
      {featured.length > 0 && (
        <div style={{ background: 'rgb(var(--cosmic-black))' }}>
          <FeaturedCarousel
            eyebrow="Hand-picked by us"
            title="Featured"
            products={featured}
          />
        </div>
      )}

      {bestsellers.length > 0 && (
        <div style={{ background: 'rgb(var(--cosmic-black))', borderTop: featured.length > 0 ? '1px solid rgb(var(--cosmic-gold) / 0.08)' : undefined }}>
          <FeaturedCarousel
            eyebrow="What people are loving"
            title="Bestsellers"
            products={bestsellers}
          />
        </div>
      )}

      {/* Three big mode tiles */}
      <section className="py-14 px-4" style={{ background: 'rgb(var(--cosmic-black))', borderTop: '1px solid rgb(var(--cosmic-gold) / 0.08)' }}>
        <div className="container-cosmic grid grid-cols-1 md:grid-cols-3 gap-6">
          {MODES.map((m) => (
            <Link key={m.href} href={m.href}
              className="group relative flex flex-col p-7 border border-cosmic-gold/20 bg-cosmic-deepPurple/40
                hover:border-cosmic-gold/60 hover:bg-cosmic-deepPurple hover:-translate-y-1
                transition-all duration-400 hover:shadow-[0_12px_40px_rgb(var(--cosmic-gold)/0.15)]">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cosmic-gold/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div className="text-5xl mb-5">{m.icon}</div>
              <p className="font-raleway text-cosmic-gold/60 text-[10px] tracking-[0.3em] uppercase mb-2">{m.tagline}</p>
              <h2 className="font-cinzel text-cosmic-cream text-xl md:text-2xl mb-3 group-hover:text-cosmic-gold transition-colors duration-300">
                {m.title}
              </h2>
              <p className="font-cormorant italic text-cosmic-cream/65 text-base leading-relaxed mb-5">
                {m.description}
              </p>

              <ul className="space-y-1.5 mb-6">
                {m.highlights.map((h) => (
                  <li key={h} className="font-raleway text-cosmic-cream/55 text-[13px] flex items-center gap-2">
                    <span className="text-cosmic-gold/70">✦</span>{h}
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-4 border-t border-cosmic-gold/15 flex items-center justify-between">
                <span className="font-raleway text-cosmic-gold text-xs tracking-widest uppercase">{m.cta}</span>
                <span className="font-raleway text-cosmic-gold text-lg transition-transform duration-300 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* View all products escape hatch */}
      <section className="py-12 text-center border-t border-cosmic-gold/10"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-black)) 0%, rgb(var(--cosmic-deep-purple)) 100%)' }}>
        <p className="font-cormorant text-cosmic-cream/50 italic text-lg mb-4">
          Just want to see everything?
        </p>
        <Link href="/shop/collection/all" className="btn-primary">View All Products</Link>
      </section>
    </Layout>
  )
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  const FEATURED_LIMIT     = 12
  const BESTSELLER_LIMIT   = 12

  // Walk the paginated /products endpoint server-side to get the full catalog,
  // then filter for featured. Doing the filter server-side keeps the pre-rendered
  // HTML small (carousel data is only the 12 cards, not 2300).
  let products: any[] = []
  try {
    let lastKey: any = null
    do {
      const url = lastKey
        ? `${API}/products?limit=500&last_key=${encodeURIComponent(JSON.stringify(lastKey))}`
        : `${API}/products?limit=500`
      const res  = await fetch(url)
      if (!res.ok) break
      const data = await res.json()
      products = products.concat(data.products || [])
      lastKey  = data.nextKey || null
    } while (lastKey)
  } catch (e) {
    console.error('getStaticProps /shop: products fetch failed', e)
  }

  const byId = new Map<string, any>(products.filter((p) => p.id).map((p) => [p.id, p]))

  // Featured: client-side filter is fine because we already have the full list.
  // Ordered newest first; cap at FEATURED_LIMIT.
  const featured = products
    .filter((p) => p.featured && p.inStock !== false)
    .sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
    .slice(0, FEATURED_LIMIT)

  // Bestsellers: ask the backend for the ranked id list — it knows whether
  // we're in 'manual' mode (admin-flagged) or 'auto' (sales-derived from orders).
  let bestsellerIds: string[] = []
  try {
    const res = await fetch(`${API}/products/bestseller-ids?limit=${BESTSELLER_LIMIT}`)
    if (res.ok) {
      const data = await res.json()
      bestsellerIds = Array.isArray(data?.ids) ? data.ids : []
    }
  } catch (e) {
    console.error('getStaticProps /shop: bestsellers fetch failed', e)
  }

  // Hydrate to full product objects, preserving the ranked order. If the cache
  // somehow missing a referenced product (rare), drop it silently.
  const bestsellers = bestsellerIds
    .map((id) => byId.get(id))
    .filter(Boolean)
    .slice(0, BESTSELLER_LIMIT)

  return {
    props: { featured, bestsellers },
    revalidate: 600,   // every 10 minutes
  }
}
