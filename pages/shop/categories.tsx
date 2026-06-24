// pages/shop/categories.tsx — "Shop by Category" landing (ISR-rendered)
import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'
import type { GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import { useRouter } from 'next/router'
import {
  CATEGORY_ICONS,
  groupCategories,
  toSlug,
  categoryCoverUrl,
} from '@/lib/shopTaxonomy'

interface CategoryData {
  name: string
  count: number
  image: string    // product-photo fallback
  cover: string    // resolved cover URL (may be '')
  slug: string
}

interface Props { categories: CategoryData[] }

function CategoryCard({ cat, index }: { cat: CategoryData; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const sources = [cat.cover, cat.image].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const icon = CATEGORY_ICONS[cat.name] || '✦'

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.55s ease ${(index % 8) * 0.05}s, transform 0.55s ease ${(index % 8) * 0.05}s`,
      }}
    >
      <Link href={`/shop/collection/${cat.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-sm border border-cosmic-gold/10 bg-cosmic-deepPurple
          hover:border-cosmic-gold/40 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(var(--cosmic-gold)/0.12)]">
          <div className="relative aspect-[4/3] overflow-hidden">
            {src ? (
              <img src={src} alt={cat.name}
                onError={() => setIdx((i) => i + 1)}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg, rgb(var(--cosmic-violet) / 0.4), rgb(var(--cosmic-black) / 0.8))' }}>
                {icon}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 via-cosmic-black/20 to-transparent" />
            <div className="absolute top-3 right-3 bg-cosmic-black/60 backdrop-blur-sm border border-cosmic-gold/30 px-2 py-0.5 rounded-sm">
              <span className="font-raleway text-cosmic-gold text-xs tracking-widest">{cat.count}</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-raleway text-cosmic-gold/70 text-xs tracking-[0.2em] uppercase mb-1">{icon} Collection</p>
              <h3 className="font-cinzel text-cosmic-cream font-semibold text-sm leading-snug group-hover:text-cosmic-gold transition-colors duration-300">
                {cat.name}
              </h3>
            </div>
          </div>
          <div className="px-4 py-3 flex items-center justify-between border-t border-cosmic-gold/10">
            <span className="font-cormorant text-cosmic-cream/50 text-sm italic">{cat.count} products</span>
            <span className="font-raleway text-cosmic-gold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Shop →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function CategoriesPage({ categories }: Props) {
  const router = useRouter()
  const [search, setSearch] = useState('')

  const isSearching = search.trim().length > 0
  const filtered = isSearching
    ? categories.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories
  const grouped = groupCategories(filtered)
  const totalProducts = categories.reduce((s, c) => s + c.count, 0)

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    if (filtered.length === 1) router.push(`/shop/collection/${filtered[0].slug}`)
  }

  return (
    <Layout
      title="Shop by Category | The Cosmic Connect"
      description="Browse healing crystals, bracelets, pyramids, malas and more by category. Cleansed and energized by Reiki Grand Masters."
      canonical="/shop/categories"
    >
      <section className="relative pt-36 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <Link href="/shop" className="inline-block font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-5 transition-colors">
            ← Shop Home
          </Link>
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Shop by Category ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
            Healing <span className="text-gradient-gold">Crystal Shop</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto mb-8">
            Handpicked crystals, cleansed &amp; energized by Reiki Grand Masters
          </p>
          <form onSubmit={handleSearch}
            className="flex items-center gap-0 max-w-md mx-auto border border-cosmic-gold/30 bg-cosmic-black/40 backdrop-blur-sm">
            <Search size={15} className="ml-4 text-cosmic-cream/30 shrink-0" />
            <input type="text" placeholder="Search collections..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25 outline-none px-3 py-3 tracking-wide" />
            {search && (
              <button type="button" onClick={() => setSearch('')} className="px-3 text-cosmic-cream/30 hover:text-cosmic-gold transition-colors">
                <X size={14} />
              </button>
            )}
          </form>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex items-center justify-between">
          <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest">
            {`${filtered.length} collection${filtered.length !== 1 ? 's' : ''}`}
          </p>
          <Link href="/shop/collection/all"
            className="font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-xs tracking-widest uppercase transition-colors">
            View All Products
          </Link>
        </div>
      </div>

      <section className="py-12 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic">
          {filtered.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-cinzel text-cosmic-cream/40 text-sm mb-2">No collections found</p>
              <button onClick={() => setSearch('')} className="btn-outline text-xs mt-4">Clear Search</button>
            </div>
          ) : isSearching ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((cat, i) => <CategoryCard key={cat.name} cat={cat} index={i} />)}
            </div>
          ) : (
            <div className="space-y-14">
              {grouped.map((group) => (
                <div key={group.title}>
                  <div className="flex items-center gap-3 mb-5">
                    <span className="text-xl">{group.icon}</span>
                    <h2 className="font-cinzel text-cosmic-cream text-xl md:text-2xl">{group.title}</h2>
                    <span className="font-raleway text-cosmic-cream/30 text-xs tracking-widest">
                      {group.items.length} {group.items.length === 1 ? 'collection' : 'collections'}
                    </span>
                    <div className="flex-1 h-px bg-cosmic-gold/10" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {group.items.map((cat, i) => <CategoryCard key={cat.name} cat={cat} index={i} />)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-12 text-center border-t border-cosmic-gold/10"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-black)) 0%, rgb(var(--cosmic-deep-purple)) 100%)' }}>
        <p className="font-cormorant text-cosmic-cream/50 italic text-lg mb-4">Can't find what you're looking for?</p>
        <Link href="/shop/collection/all" className="btn-primary">
          Browse All {totalProducts.toLocaleString()} Products
        </Link>
      </section>
    </Layout>
  )
}

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export const getStaticProps: GetStaticProps<Props> = async () => {
  let cols: string[] = []
  let products: any[] = []
  try {
    const colRes = await fetch(`${API}/collections`)
    const colData = await colRes.json()
    cols = colData.collections || []

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
    console.error('getStaticProps /shop/categories: fetch failed', e)
  }

  const catMap: Record<string, { count: number; image: string }> = {}
  products.forEach((p: any) => {
    p.collections?.forEach((col: string) => {
      if (!catMap[col]) catMap[col] = { count: 0, image: '' }
      catMap[col].count++
      if (!catMap[col].image && p.images?.[0]) catMap[col].image = p.images[0]
    })
  })

  const categories: CategoryData[] = cols
    .filter((c) => catMap[c])
    .map((name) => ({
      name,
      count: catMap[name]?.count || 0,
      image: catMap[name]?.image || '',
      cover: categoryCoverUrl(name),
      slug: toSlug(name),
    }))

  return { props: { categories }, revalidate: 600 }
}
