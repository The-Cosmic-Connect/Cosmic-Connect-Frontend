import { useState, useEffect } from 'react'
import { Search, SlidersHorizontal, X, ShoppingCart } from 'lucide-react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import CartDrawer from '@/components/shop/CartDrawer'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// ── Product type matching new DynamoDB schema ─────────────────────────────
export interface Product {
  id:               string
  name:             string
  slug:             string
  sku:              string
  description:      string
  collections:      string[]   // array e.g. ["Bracelets", "Therapy"]
  priceINR:         number
  priceUSD:         number
  originalPriceINR: number
  originalPriceUSD: number
  discountValue:    number
  ribbon:           string
  images:           string[]
  specs:            { title: string; value: string }[]
  inStock:          boolean
  published:        boolean
  featured:         boolean
}

const SORT_OPTIONS = [
  { value: 'default',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
]

function sortProducts(products: Product[], sort: string, isIndia: boolean): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc')  return (isIndia ? a.priceINR : a.priceUSD) - (isIndia ? b.priceINR : b.priceUSD)
    if (sort === 'price-desc') return (isIndia ? b.priceINR : b.priceUSD) - (isIndia ? a.priceINR : a.priceUSD)
    if (sort === 'name-asc')   return a.name.localeCompare(b.name)
    // default: featured first, then by name
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return 0
  })
}

// ── Product Card ──────────────────────────────────────────────────────────
function ProductCard({ product }: { product: Product }) {
  const { isIndia, symbol } = useGeo()
  const { addToCart }       = useCart()
  const [added, setAdded]   = useState(false)

  const price         = isIndia ? product.priceINR         : product.priceUSD
  const originalPrice = isIndia ? product.originalPriceINR : product.originalPriceUSD
  const hasDiscount   = originalPrice > 0 && originalPrice > price
  const discountPct   = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0
  const image         = product.images?.[0] || ''

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    addToCart({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <Link href={`/shop/${product.slug}`} className="group block">
      <div className="cosmic-card overflow-hidden transition-transform duration-300 group-hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-square bg-cosmic-deepPurple overflow-hidden">
          {image ? (
            <img
              src={image}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cosmic-gold text-4xl">✦</div>
          )}

          {/* Ribbon badge */}
          {product.ribbon && (
            <span className="absolute top-2 left-2 bg-cosmic-gold text-cosmic-black text-xs font-bold font-raleway px-2 py-0.5 tracking-wide uppercase">
              {product.ribbon}
            </span>
          )}

          {/* Out of stock overlay */}
          {!product.inStock && (
            <div className="absolute inset-0 bg-cosmic-black/60 flex items-center justify-center">
              <span className="font-raleway text-xs text-cosmic-cream/60 tracking-widest uppercase">Out of Stock</span>
            </div>
          )}

          {/* Quick add button */}
          {product.inStock && (
            <button
              onClick={handleAdd}
              className="absolute bottom-2 left-2 right-2 py-2 bg-cosmic-black/80 backdrop-blur-sm
                text-cosmic-gold font-raleway text-xs tracking-widest uppercase
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-cosmic-gold hover:text-cosmic-black"
            >
              {added ? '✓ Added' : 'Quick Add'}
            </button>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          {/* Collection tag */}
          {product.collections.length > 0 && (
            <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase mb-1 truncate">
              {product.collections[0]}
            </p>
          )}

          {/* Name */}
          <h3 className="font-cormorant text-cosmic-cream text-sm leading-snug mb-2 line-clamp-2 group-hover:text-cosmic-gold transition-colors">
            {product.name}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-raleway text-cosmic-cream font-semibold text-sm">
              {symbol}{price.toLocaleString()}
            </span>
            {hasDiscount && (
              <>
                <span className="font-raleway text-cosmic-cream/30 text-xs line-through">
                  {symbol}{originalPrice.toLocaleString()}
                </span>
                <span className="font-raleway text-cosmic-gold text-xs font-semibold">
                  {discountPct}% off
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function ShopPage() {
  const { totalItems }  = useCart()
  const { isIndia, loading: geoLoading } = useGeo()

  const [products,        setProducts]        = useState<Product[]>([])
  const [collections,     setCollections]     = useState<string[]>([])
  const [loading,         setLoading]         = useState(true)
  const [activeCollection,setActiveCollection]= useState('all')
  const [search,          setSearch]          = useState('')
  const [sort,            setSort]            = useState('default')
  const [cartOpen,        setCartOpen]        = useState(false)
  const [showFilters,     setShowFilters]     = useState(false)

  // Fetch products
  useEffect(() => {
    fetch(`${API}/products`)
      .then(r => r.json())
      .then(data => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  // Derive collections from products (sorted alphabetically)
  useEffect(() => {
    if (!products.length) return
    const seen = new Set<string>()
    products.forEach(p => p.collections?.forEach(c => seen.add(c)))
    setCollections(['All Products', ...Array.from(seen).sort()])
  }, [products])

  // Filter + sort
  const filtered = sortProducts(
    products.filter(p => {
      const matchCollection = activeCollection === 'all' ||
        p.collections?.some(c => c.toLowerCase() === activeCollection.toLowerCase())
      const matchSearch = !search ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description?.toLowerCase().includes(search.toLowerCase())
      return matchCollection && matchSearch
    }),
    sort,
    isIndia
  )

  const activeLabel = activeCollection === 'all'
    ? 'All Products'
    : collections.find(c => c.toLowerCase() === activeCollection.toLowerCase()) || activeCollection

  return (
    <>
      <Layout
        title="Crystal & Healing Products Shop | The Cosmic Connect"
        description="Shop 100% authentic crystals, healing bracelets, malas, yantras and spiritual tools. Cleansed and energized by Reiki Grand Masters."
        canonical="/shop"
      >
        {/* Hero */}
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
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {['✦ Authentic & Certified', '✦ Reiki Energized', '✦ Free Shipping ₹1999+', '✦ 50,000+ Happy Customers'].map(b => (
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

            {/* Filter toggle mobile */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-1.5 border border-cosmic-gold/20 px-3 py-2 text-cosmic-cream/60 hover:text-cosmic-gold hover:border-cosmic-gold/40 transition-colors lg:hidden"
            >
              <SlidersHorizontal size={13} />
              <span className="font-raleway text-xs tracking-widest">Filter</span>
            </button>

            {/* Cart */}
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
                {filtered.length} product{filtered.length !== 1 ? 's' : ''} in {activeLabel}
                {search && ` matching "${search}"`}
              </p>
            </div>
          )}
        </div>

        {/* Main content */}
        <section className="section bg-cosmic-section pt-8">
          <div className="container-cosmic">
            <div className="flex gap-8">

              {/* Sidebar — collections from DB */}
              <aside className={`w-56 shrink-0 ${showFilters ? 'block' : 'hidden'} lg:block`}>
                <p className="font-cinzel text-cosmic-cream/50 text-xs tracking-widest uppercase mb-4">
                  Collections
                </p>
                <div className="space-y-0.5">
                  {collections.map(col => {
                    const slug    = col === 'All Products' ? 'all' : col.toLowerCase()
                    const isActive= activeCollection === slug
                    return (
                      <button
                        key={col}
                        onClick={() => { setActiveCollection(slug); setShowFilters(false) }}
                        className={`w-full text-left px-3 py-2 font-raleway text-xs tracking-wide transition-all duration-200 ${
                          isActive
                            ? 'text-cosmic-gold bg-cosmic-gold/10 border-l-2 border-cosmic-gold pl-4'
                            : 'text-cosmic-cream/50 hover:text-cosmic-cream/80 border-l-2 border-transparent'
                        }`}
                      >
                        {col}
                      </button>
                    )
                  })}
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
                      Try a different collection or search term
                    </p>
                    <button
                      onClick={() => { setActiveCollection('all'); setSearch('') }}
                      className="btn-outline mt-6 text-xs"
                    >
                      Clear Filters
                    </button>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                    {filtered.map(product => (
                      <ProductCard key={product.id} product={product} />
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