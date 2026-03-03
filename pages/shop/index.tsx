import { useState, useEffect, useRef } from 'react'
import { Search, SlidersHorizontal, X, ShoppingCart } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import ProductCard, { Product } from '@/components/shop/ProductCard'
import CartDrawer from '@/components/shop/CartDrawer'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'

// ── Category list scraped from thecosmicconnect.com/our-shop ────────────────
export const CATEGORIES = [
  { slug: 'all', label: 'All Products' },
  { slug: 'bracelets', label: 'Bracelets' },
  { slug: 'zodiac-bracelets', label: 'Zodiac Bracelets' },
  { slug: 'therapy-bracelets', label: 'Therapy Bracelets' },
  { slug: 'raw-rough-stones', label: 'Raw / Rough Stones' },
  { slug: 'tumble-stones', label: 'Tumble Stones' },
  { slug: 'crystal-clusters', label: 'Crystal Clusters' },
  { slug: 'towers-wands', label: 'Towers, Wands & Pencils' },
  { slug: 'balls-spheres', label: 'Balls & Spheres' },
  { slug: 'pyramids', label: 'Pyramids' },
  { slug: 'puffy-hearts', label: 'Puffy Hearts' },
  { slug: 'palm-stones', label: 'Palm Stones' },
  { slug: 'crystal-tree', label: 'Crystal Tree' },
  { slug: 'rollers-gua-sha', label: 'Rollers & Gua Sha' },
  { slug: 'pendants-jewellery', label: 'Pendants & Jewellery' },
  { slug: 'angels', label: 'Angels' },
  { slug: 'idols-figurines', label: 'Idols & Figurines' },
  { slug: 'evil-eye', label: 'Evil Eye Products' },
  { slug: 'jap-mala', label: 'Jap Mala' },
  { slug: 'rudraksh', label: 'Rudraksh' },
  { slug: 'feng-shui', label: 'Feng Shui' },
  { slug: 'dowsers', label: 'Dowsers' },
  { slug: 'energy-generator-orgones', label: 'Energy Generator Orgones' },
  { slug: 'intention-coin', label: 'Intention Coin' },
  { slug: 'sage-incense', label: 'Sage & Incense' },
  { slug: 'cleansing-charging', label: 'Cleansing & Charging' },
  { slug: 'meditation-essentials', label: 'Meditation Essentials' },
  { slug: 'energized-water', label: 'Energized Water' },
  { slug: 'lamp', label: 'Lamp' },
]

const SORT_OPTIONS = [
  { value: 'default', label: 'Featured' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc', label: 'Name: A–Z' },
]

function sortProducts(products: Product[], sort: string, isIndia: boolean): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc') return (isIndia ? a.priceINR : a.priceUSD) - (isIndia ? b.priceINR : b.priceUSD)
    if (sort === 'price-desc') return (isIndia ? b.priceINR : b.priceUSD) - (isIndia ? a.priceINR : a.priceUSD)
    if (sort === 'name-asc') return a.name.localeCompare(b.name)
    return 0
  })
}

export default function ShopPage() {
  const { totalItems } = useCart()
  const { isIndia, symbol, loading: geoLoading } = useGeo()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('default')
  const [cartOpen, setCartOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Fetch products from backend
  useEffect(() => {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
    fetch(`${backendUrl}/products`)
      .then(r => r.json())
      .then(data => { setProducts(data.products || []); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  // Filtered & sorted products
  const filtered = sortProducts(
    products.filter(p => {
      const matchCat = activeCategory === 'all' || p.categorySlug === activeCategory
      const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase())
      return matchCat && matchSearch
    }),
    sort,
    isIndia
  )

  const activeCategoryLabel = CATEGORIES.find(c => c.slug === activeCategory)?.label || 'All Products'

  return (
    <>
      <Layout
        title="Crystal & Healing Products Shop | The Cosmic Connect"
        description="Shop 100% authentic crystals, healing bracelets, malas, yantras and spiritual tools. Cleansed and energized by Reiki Grand Masters. Free shipping above ₹1999."
        canonical="/shop"
      >
        {/* Hero banner */}
        <section className="relative pt-36 pb-10 px-4 bg-cosmic-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,44,138,0.2), transparent 70%)' }}
          />
          <div className="container-cosmic relative z-10 text-center">
            <p className="ornament text-xs tracking-[0.5em] mb-3">✦ ✦ ✦</p>
            <h1 className="font-cinzel font-bold text-cosmic-cream mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Healing <span className="text-gradient-gold">Crystal Shop</span>
            </h1>
            <p className="font-cormorant italic text-cosmic-cream/60 text-lg max-w-xl mx-auto">
              100% authentic crystals, cleansed &amp; energized by Reiki Grand Masters
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {[
                '✦ Authentic & Certified',
                '✦ Reiki Energized',
                '✦ Free Shipping ₹1999+',
                '✦ 50,000+ Happy Customers',
              ].map(b => (
                <span key={b} className="font-raleway text-cosmic-cream/40 text-xs tracking-widest">{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Sticky toolbar */}
        <div className="sticky top-16 z-30 bg-cosmic-deepPurple/95 backdrop-blur-md border-b border-cosmic-gold/10">
          <div className="container-cosmic py-3 flex items-center gap-3">
            {/* Search */}
            <div className="flex-1 flex items-center gap-2 border border-cosmic-gold/20 px-3 max-w-xs">
              <Search size={14} className="text-cosmic-cream/30 shrink-0" />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="bg-transparent font-raleway text-xs text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-2 w-full"
              />
              {search && (
                <button onClick={() => setSearch('')} className="text-cosmic-cream/30 hover:text-cosmic-gold">
                  <X size={13} />
                </button>
              )}
            </div>

            {/* Sort */}
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="bg-cosmic-deepPurple border border-cosmic-gold/20 text-cosmic-cream/70 font-raleway text-xs tracking-wider py-2 px-3 outline-none hover:border-cosmic-gold/40 transition-colors"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>

            {/* Filter toggle (mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 border border-cosmic-gold/20 px-3 py-2 text-cosmic-cream/60 hover:text-cosmic-gold hover:border-cosmic-gold/40 transition-colors lg:hidden"
            >
              <SlidersHorizontal size={13} />
              <span className="font-raleway text-xs tracking-widest">Filter</span>
            </button>

            {/* Cart button */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-1.5 border border-cosmic-gold/30 px-3 py-2 text-cosmic-cream/70 hover:text-cosmic-gold hover:border-cosmic-gold transition-colors ml-auto"
            >
              <ShoppingCart size={14} />
              <span className="font-raleway text-xs tracking-widest hidden sm:block">Cart</span>
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-cosmic-gold text-cosmic-black text-xs font-bold font-raleway rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Result count */}
          {!loading && (
            <div className="container-cosmic pb-2">
              <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} in {activeCategoryLabel}
                {search && ` matching "${search}"`}
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <section className="section bg-cosmic-section pt-8">
          <div className="container-cosmic">
            <div className="flex gap-8">

              {/* Sidebar categories */}
              <aside className={`w-56 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                <p className="font-cinzel text-cosmic-cream/50 text-xs tracking-widest uppercase mb-4">
                  Categories
                </p>
                <div className="space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.slug}
                      onClick={() => { setActiveCategory(cat.slug); setShowFilters(false) }}
                      className={`w-full text-left px-3 py-2 font-raleway text-xs tracking-wide transition-all duration-200 ${
                        activeCategory === cat.slug
                          ? 'text-cosmic-gold bg-cosmic-gold/10 border-l-2 border-cosmic-gold pl-4'
                          : 'text-cosmic-cream/50 hover:text-cosmic-cream/80 border-l-2 border-transparent'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </aside>

              {/* Product grid */}
              <div className="flex-1">
                {loading || geoLoading ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {[...Array(8)].map((_, i) => (
                      <div key={i} className="cosmic-card animate-pulse">
                        <div className="aspect-square bg-cosmic-gold/5" />
                        <div className="p-4 space-y-2">
                          <div className="h-3 bg-cosmic-gold/5 rounded w-1/2" />
                          <div className="h-4 bg-cosmic-gold/8 rounded" />
                          <div className="h-4 bg-cosmic-gold/5 rounded w-3/4" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filtered.length === 0 ? (
                  <div className="text-center py-24">
                    <span className="text-6xl block mb-4">🔮</span>
                    <p className="font-cinzel text-cosmic-cream/40 text-sm">No products found</p>
                    <p className="font-cormorant text-cosmic-cream/30 italic mt-1">
                      Try a different category or search term
                    </p>
                    <button
                      onClick={() => { setActiveCategory('all'); setSearch('') }}
                      className="btn-outline mt-6 text-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map((product, i) => (
                      <ProductCard key={product.id} product={product} index={i} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </Layout>

      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
