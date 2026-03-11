import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { Search, ShoppingCart, X } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CartDrawer from '@/components/shop/CartDrawer'
import { useCart } from '@/context/CartContext'
import { useRouter } from 'next/router'
// Remove the Product interface definition, replace with:
import type { Product } from '@/types/product'
// Keep the export for backwards compat:
export type { Product }

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Category icons mapping — emoji fallback
const CATEGORY_ICONS: Record<string, string> = {
  'Bracelets': '📿',
  'Zodiac Bracelets': '♈',
  'Therapy Bracelets': '💚',
  'Raw / Rough Stones': '🪨',
  'Tumble Stones': '💎',
  'Crystal Clusters': '✨',
  'Towers, Wands & Pencils': '🔮',
  'Balls & Spheres': '🔵',
  'Pyramids': '🔺',
  'Puffy Hearts': '💜',
  'Palm Stones': '🖐️',
  'Crystal Tree': '🌳',
  'Rollers & Gua Sha': '🌿',
  'Pendants & Jewellery': '💍',
  'Angels': '👼',
  'Idols & Figurines': '🪷',
  'Evil Eye Products': '🧿',
  'Jap Mala': '📿',
  'Rudraksh': '🌰',
  'Feng Shui': '☯️',
  'Dowsers': '🌀',
  'Energy Generator Orgones': '⚡',
  'Intention Coin': '🪙',
  'Sage & Incense': '🌿',
  'Cleansing & Charging': '🌙',
  'Meditation Essentials': '🧘',
  'Energized Water': '💧',
  'Lamp': '🕯️',
}

interface CategoryData {
  name: string
  count: number
  image: string   // first product image in that collection
  slug: string
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function CategoryCard({ cat, index }: { cat: CategoryData; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

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
        transition: `opacity 0.55s ease ${(index % 8) * 0.06}s, transform 0.55s ease ${(index % 8) * 0.06}s`,
      }}
    >
      <Link href={`/shop/collection/${cat.slug}`} className="group block">
        <div className="relative overflow-hidden rounded-sm border border-cosmic-gold/10 bg-cosmic-deepPurple
          hover:border-cosmic-gold/40 transition-all duration-400 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(201,168,76,0.12)]">

          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            {cat.image ? (
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-5xl"
                style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.4), rgba(10,7,8,0.8))' }}>
                {icon}
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 via-cosmic-black/20 to-transparent" />

            {/* Product count badge */}
            <div className="absolute top-3 right-3 bg-cosmic-black/60 backdrop-blur-sm border border-cosmic-gold/30
              px-2 py-0.5 rounded-sm">
              <span className="font-raleway text-cosmic-gold text-xs tracking-widest">{cat.count}</span>
            </div>

            {/* Category name overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <p className="font-raleway text-cosmic-gold/70 text-xs tracking-[0.2em] uppercase mb-1">
                {icon} Collection
              </p>
              <h3 className="font-cinzel text-cosmic-cream font-semibold text-sm leading-snug
                group-hover:text-cosmic-gold transition-colors duration-300">
                {cat.name}
              </h3>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-cosmic-gold/10">
            <span className="font-cormorant text-cosmic-cream/50 text-sm italic">
              {cat.count} products
            </span>
            <span className="font-raleway text-cosmic-gold text-xs tracking-widest uppercase
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Shop →
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

export default function ShopPage() {
  const { totalItems } = useCart()
  const router = useRouter()
  const [categories, setCategories]   = useState<CategoryData[]>([])
  const [loading,    setLoading]      = useState(true)
  const [search,     setSearch]       = useState('')
  const [cartOpen,   setCartOpen]     = useState(false)

  useEffect(() => {
    // Fetch collections + first batch of products to build category tiles
    async function load() {
      try {
        // Get collections list
        const colRes  = await fetch(`${API}/collections`)
        const colData = await colRes.json()
        const cols: string[] = colData.collections || []

        // Get first page of products to extract images per collection
        const prodRes  = await fetch(`${API}/products?limit=200`)
        const prodData = await prodRes.json()
        const products = prodData.products || []

        // Build category data
        const catMap: Record<string, { count: number; image: string }> = {}

        // Count all products per collection using total scan
        // We use the products we have to get images, and collections API for names
        products.forEach((p: any) => {
          p.collections?.forEach((col: string) => {
            if (!catMap[col]) catMap[col] = { count: 0, image: '' }
            catMap[col].count++
            if (!catMap[col].image && p.images?.[0]) {
              catMap[col].image = p.images[0]
            }
          })
        })

        // Merge with full collections list
        const cats: CategoryData[] = cols
          .filter(c => catMap[c])
          .map(name => ({
            name,
            count: catMap[name]?.count || 0,
            image: catMap[name]?.image || '',
            slug:  toSlug(name),
          }))
          .sort((a, b) => b.count - a.count)

        setCategories(cats)
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = search
    ? categories.filter(c => c.name.toLowerCase().includes(search.toLowerCase()))
    : categories

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    // If search matches exactly one category, go there
    if (filtered.length === 1) {
      router.push(`/shop/collection/${filtered[0].slug}`)
    }
  }

  return (
    <>
      <Layout
        title="Crystal & Healing Products Shop | The Cosmic Connect"
        description="Shop 100% authentic crystals, healing bracelets, malas, yantras and spiritual tools. Cleansed and energized by Reiki Grand Masters. Free shipping above ₹1999."
        canonical="/shop"
      >
        {/* Hero */}
        <section className="relative pt-36 pb-16 px-4 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, #1A0A2E 0%, #0A0708 100%)' }}>
          {/* Radial glow */}
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.07), transparent 70%)' }} />

          {/* Decorative corner lines */}
          <div className="absolute top-24 left-8 w-16 h-16 border-l border-t border-cosmic-gold/20 hidden lg:block" />
          <div className="absolute top-24 right-8 w-16 h-16 border-r border-t border-cosmic-gold/20 hidden lg:block" />

          <div className="container-cosmic relative z-10 text-center">
            <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Our Collections ✦</p>
            <h1 className="font-cinzel font-bold text-cosmic-cream mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Healing <span className="text-gradient-gold">Crystal Shop</span>
            </h1>
            <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto mb-8">
              Handpicked crystals, cleansed &amp; energized by Reiki Grand Masters
            </p>

            {/* Search bar */}
            <form onSubmit={handleSearch}
              className="flex items-center gap-0 max-w-md mx-auto border border-cosmic-gold/30 bg-cosmic-black/40 backdrop-blur-sm">
              <Search size={15} className="ml-4 text-cosmic-cream/30 shrink-0" />
              <input
                type="text"
                placeholder="Search collections..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25
                  outline-none px-3 py-3 tracking-wide"
              />
              {search && (
                <button type="button" onClick={() => setSearch('')}
                  className="px-3 text-cosmic-cream/30 hover:text-cosmic-gold transition-colors">
                  <X size={14} />
                </button>
              )}
            </form>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {['✦ Authentic & Certified', '✦ Reiki Energized', '✦ Free Shipping ₹1999+', '✦ 50,000+ Happy Customers'].map(b => (
                <span key={b} className="font-raleway text-cosmic-cream/35 text-xs tracking-widest">{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Toolbar */}
        <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
          <div className="container-cosmic py-3 flex items-center justify-between">
            <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest">
              {loading ? 'Loading...' : `${filtered.length} collection${filtered.length !== 1 ? 's' : ''}`}
            </p>
            <div className="flex items-center gap-3">
              <Link href="/shop/all" className="font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-xs tracking-widest uppercase transition-colors">
                View All Products
              </Link>
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex items-center gap-1.5 border border-cosmic-gold/30 px-3 py-2
                  text-cosmic-cream/70 hover:text-cosmic-gold hover:border-cosmic-gold transition-colors"
              >
                <ShoppingCart size={14} />
                <span className="font-raleway text-xs tracking-widest hidden sm:block">Cart</span>
                {totalItems > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-cosmic-gold text-cosmic-black text-xs
                    font-bold font-raleway rounded-full w-4 h-4 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Category Grid */}
        <section className="py-12 px-4" style={{ background: '#0A0708' }}>
          <div className="container-cosmic">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(12)].map((_, i) => (
                  <div key={i} className="animate-pulse rounded-sm border border-cosmic-gold/5 bg-cosmic-deepPurple/30">
                    <div className="aspect-[4/3] bg-cosmic-gold/5" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-cosmic-gold/5 rounded w-3/4" />
                      <div className="h-3 bg-cosmic-gold/5 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-cinzel text-cosmic-cream/40 text-sm mb-2">No collections found</p>
                <button onClick={() => setSearch('')} className="btn-outline text-xs mt-4">Clear Search</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filtered.map((cat, i) => (
                  <CategoryCard key={cat.name} cat={cat} index={i} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Bottom CTA */}
        {!loading && (
          <section className="py-12 text-center border-t border-cosmic-gold/10"
            style={{ background: 'linear-gradient(180deg, #0A0708 0%, #1A0A2E 100%)' }}>
            <p className="font-cormorant text-cosmic-cream/50 italic text-lg mb-4">
              Can't find what you're looking for?
            </p>
            <Link href="/shop/all" className="btn-primary">
              Browse All {categories.reduce((s, c) => s + c.count, 0).toLocaleString()} Products
            </Link>
          </section>
        )}
      </Layout>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}