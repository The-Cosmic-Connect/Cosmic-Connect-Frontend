import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const PAGE_SIZE = 48

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

const SORT_OPTIONS = [
  { value: 'featured',    label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
  { value: 'newest',     label: 'Newest First' },
]

function sortProducts(products: Product[], sort: string, isIndia: boolean): Product[] {
  return [...products].sort((a, b) => {
    if (sort === 'price-asc')  return (isIndia ? a.priceINR : a.priceUSD) - (isIndia ? b.priceINR : b.priceUSD)
    if (sort === 'price-desc') return (isIndia ? b.priceINR : b.priceUSD) - (isIndia ? a.priceINR : a.priceUSD)
    if (sort === 'name-asc')   return a.name.localeCompare(b.name)
    if (sort === 'newest')     return (b.createdAt || '').localeCompare(a.createdAt || '')
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    return 0
  })
}

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
      <div className="overflow-hidden border border-cosmic-gold/10 bg-cosmic-deepPurple
        transition-all duration-300 group-hover:-translate-y-1
        hover:border-cosmic-gold/30 hover:shadow-[0_8px_24px_rgba(201,168,76,0.1)]">
        <div className="relative aspect-square overflow-hidden">
          {image ? (
            <img src={image} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cosmic-gold text-4xl"
              style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.4), rgba(10,7,8,0.8))' }}>✦</div>
          )}
          {product.ribbon && (
            <span className="absolute top-2 left-2 bg-cosmic-gold text-cosmic-black text-xs font-bold font-raleway px-2 py-0.5 tracking-wide uppercase">
              {product.ribbon}
            </span>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-cosmic-black/60 flex items-center justify-center">
              <span className="font-raleway text-xs text-cosmic-cream/60 tracking-widest uppercase">Out of Stock</span>
            </div>
          )}
          {product.inStock && (
            <button onClick={handleAdd}
              className="absolute bottom-0 left-0 right-0 py-2.5 bg-cosmic-black/85 backdrop-blur-sm
                text-cosmic-gold font-raleway text-xs tracking-widest uppercase
                opacity-0 group-hover:opacity-100 transition-opacity duration-200
                hover:bg-cosmic-gold hover:text-cosmic-black border-t border-cosmic-gold/20">
              {added ? '✓ Added to Cart' : '+ Quick Add'}
            </button>
          )}
        </div>
        <div className="p-3">
          {product.collections.length > 0 && (
            <p className="font-raleway text-cosmic-gold/50 text-xs tracking-widest uppercase mb-1 truncate">
              {product.collections[0]}
            </p>
          )}
          <h3 className="font-cormorant text-cosmic-cream text-sm leading-snug mb-2 line-clamp-2 group-hover:text-cosmic-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="font-raleway text-cosmic-cream font-semibold text-sm">{symbol}{price.toLocaleString()}</span>
            {hasDiscount && (
              <>
                <span className="font-raleway text-cosmic-cream/30 text-xs line-through">{symbol}{originalPrice.toLocaleString()}</span>
                <span className="font-raleway text-green-400 text-xs font-semibold">{discountPct}% off</span>
              </>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}

export default function CollectionPage() {
  const router = useRouter()
  const { name: nameSlug } = router.query as { name: string }

  const { isIndia, symbol, loading: geoLoading } = useGeo()

  const [allProducts, setAllProducts] = useState<Product[]>([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState('')
  const [sort,        setSort]        = useState('featured')
  const [showFilters, setShowFilters] = useState(false)
  const [page,        setPage]        = useState(1)
  const [onSaleOnly,  setOnSaleOnly]  = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange,  setPriceRange]  = useState<[number, number]>([0, 100000])
  const [maxPrice,    setMaxPrice]    = useState(100000)
  const [pageTitle,   setPageTitle]   = useState('Collection')

  const isAll = nameSlug === 'all'

  useEffect(() => {
    if (!nameSlug) return
    setLoading(true)
    setPage(1)

    async function fetchAll() {
      try {
        const colRes  = await fetch(`${API}/collections`)
        const colData = await colRes.json()
        const cols: string[] = colData.collections || []

        const resolvedName = isAll ? 'all' : (cols.find(c => toSlug(c) === nameSlug) || nameSlug)
        setPageTitle(isAll ? 'All Products' : resolvedName)

        let url = `${API}/products?limit=500`
        if (!isAll) url += `&collection=${encodeURIComponent(resolvedName)}`

        let products: Product[] = []
        let lastKey: any = null
        do {
          const pageUrl = lastKey ? `${url}&last_key=${encodeURIComponent(JSON.stringify(lastKey))}` : url
          const res  = await fetch(pageUrl)
          const data = await res.json()
          products = [...products, ...(data.products || [])]
          lastKey  = data.nextKey || null
        } while (lastKey)

        setAllProducts(products)
        const prices = products.map(p => isIndia ? p.priceINR : p.priceUSD).filter(Boolean)
        const max = Math.ceil(Math.max(...prices, 1000) / 500) * 500
        setMaxPrice(max)
        setPriceRange([0, max])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }

    fetchAll()
  }, [nameSlug, isAll])

  useEffect(() => {
    if (!allProducts.length) return
    const prices = allProducts.map(p => isIndia ? p.priceINR : p.priceUSD).filter(Boolean)
    const max = Math.ceil(Math.max(...prices, 1000) / 500) * 500
    setMaxPrice(max)
    setPriceRange([0, max])
  }, [isIndia])

  const price    = (p: Product) => isIndia ? p.priceINR    : p.priceUSD
  const origPrice = (p: Product) => isIndia ? p.originalPriceINR : p.originalPriceUSD

  const filtered = sortProducts(
    allProducts.filter(p => {
      const pr = price(p)
      return (!search || p.name.toLowerCase().includes(search.toLowerCase()) || p.description?.toLowerCase().includes(search.toLowerCase()))
        && (!onSaleOnly  || (origPrice(p) > 0 && origPrice(p) > pr))
        && (!inStockOnly || p.inStock)
        && pr >= priceRange[0] && pr <= priceRange[1]
    }),
    sort, isIndia
  )

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore   = paginated.length < filtered.length
  const activeFiltersCount = [onSaleOnly, inStockOnly, priceRange[0] > 0 || priceRange[1] < maxPrice].filter(Boolean).length

  return (
    <Layout
      title={`${pageTitle} | The Cosmic Connect Shop`}
      description={`Shop authentic ${pageTitle} — crystals, healing tools and spiritual products energized by Reiki Grand Masters.`}
      canonical={`/shop/collection/${nameSlug}`}
    >
      {/* Hero */}
      <section className="relative pt-32 pb-10 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1A0A2E 0%, #0A0708 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgba(201,168,76,0.06), transparent 70%)' }} />
        <div className="container-cosmic relative z-10">
          <Link href="/shop"
            className="inline-flex items-center gap-2 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-6 transition-colors">
            <ArrowLeft size={12} /> All Collections
          </Link>
          <div className="flex items-end justify-between flex-wrap gap-4">
            <div>
              <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.4em] uppercase mb-2">Collection</p>
              <h1 className="font-cinzel font-bold text-cosmic-cream" style={{ fontSize: 'clamp(1.75rem, 4vw, 2.75rem)' }}>
                {pageTitle}
              </h1>
            </div>
            {!loading && (
              <p className="font-cormorant text-cosmic-cream/40 italic text-lg">
                {filtered.length} product{filtered.length !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 border border-cosmic-gold/20 px-3 flex-1 max-w-xs">
            <Search size={13} className="text-cosmic-cream/30 shrink-0" />
            <input type="text" placeholder={`Search ${pageTitle}...`} value={search}
              onChange={e => { setSearch(e.target.value); setPage(1) }}
              className="bg-transparent font-raleway text-xs text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-2 w-full" />
            {search && (
              <button onClick={() => setSearch('')} className="text-cosmic-cream/30 hover:text-cosmic-gold"><X size={12} /></button>
            )}
          </div>

          <select value={sort} onChange={e => { setSort(e.target.value); setPage(1) }}
            className="bg-cosmic-deepPurple border border-cosmic-gold/20 text-cosmic-cream/70 font-raleway text-xs tracking-wider py-2 px-3 outline-none hover:border-cosmic-gold/40 transition-colors hidden sm:block">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-1.5 border px-3 py-2 font-raleway text-xs tracking-widest transition-colors ${
              showFilters || activeFiltersCount > 0
                ? 'border-cosmic-gold text-cosmic-gold'
                : 'border-cosmic-gold/20 text-cosmic-cream/60 hover:text-cosmic-gold hover:border-cosmic-gold/40'
            }`}>
            <SlidersHorizontal size={12} />
            <span>Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
          </button>
        </div>

        {showFilters && (
          <div className="border-t border-cosmic-gold/10 bg-cosmic-black/80">
            <div className="container-cosmic py-4 flex flex-wrap items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer group">
                <div onClick={() => { setOnSaleOnly(!onSaleOnly); setPage(1) }}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors cursor-pointer ${
                    onSaleOnly ? 'border-cosmic-gold bg-cosmic-gold' : 'border-cosmic-gold/30 group-hover:border-cosmic-gold/60'
                  }`}>
                  {onSaleOnly && <span className="text-cosmic-black text-xs font-bold">✓</span>}
                </div>
                <span className="font-raleway text-cosmic-cream/60 text-xs tracking-widest">On Sale</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer group">
                <div onClick={() => { setInStockOnly(!inStockOnly); setPage(1) }}
                  className={`w-4 h-4 border flex items-center justify-center transition-colors cursor-pointer ${
                    inStockOnly ? 'border-cosmic-gold bg-cosmic-gold' : 'border-cosmic-gold/30 group-hover:border-cosmic-gold/60'
                  }`}>
                  {inStockOnly && <span className="text-cosmic-black text-xs font-bold">✓</span>}
                </div>
                <span className="font-raleway text-cosmic-cream/60 text-xs tracking-widest">In Stock Only</span>
              </label>

              <div className="flex items-center gap-3">
                <span className="font-raleway text-cosmic-cream/40 text-xs tracking-widest">Price:</span>
                <span className="font-raleway text-cosmic-gold text-xs">{symbol}{priceRange[0].toLocaleString()}</span>
                <input type="range" min={0} max={maxPrice} step={500} value={priceRange[1]}
                  onChange={e => { setPriceRange([priceRange[0], Number(e.target.value)]); setPage(1) }}
                  className="w-28 accent-cosmic-gold" />
                <span className="font-raleway text-cosmic-gold text-xs">{symbol}{priceRange[1].toLocaleString()}</span>
              </div>

              {activeFiltersCount > 0 && (
                <button onClick={() => { setOnSaleOnly(false); setInStockOnly(false); setPriceRange([0, maxPrice]); setPage(1) }}
                  className="font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest underline underline-offset-2 transition-colors ml-auto">
                  Clear filters
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Products */}
      <section className="py-10 px-4" style={{ background: '#0A0708' }}>
        <div className="container-cosmic">
          {loading || geoLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse border border-cosmic-gold/5 bg-cosmic-deepPurple/30">
                  <div className="aspect-square bg-cosmic-gold/5" />
                  <div className="p-3 space-y-2">
                    <div className="h-2 bg-cosmic-gold/5 rounded w-1/2" />
                    <div className="h-3 bg-cosmic-gold/8 rounded" />
                    <div className="h-3 bg-cosmic-gold/5 rounded w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-5xl block mb-4">🔮</span>
              <p className="font-cinzel text-cosmic-cream/40 text-sm mb-1">No products found</p>
              <p className="font-cormorant text-cosmic-cream/30 italic">Try adjusting your filters or search</p>
              <button onClick={() => { setSearch(''); setOnSaleOnly(false); setInStockOnly(false); setPriceRange([0, maxPrice]) }}
                className="btn-outline mt-6 text-xs">Clear All Filters</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
              {hasMore && (
                <div className="text-center mt-12">
                  <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest mb-4">
                    Showing {paginated.length} of {filtered.length} products
                  </p>
                  <button onClick={() => setPage(p => p + 1)} className="btn-outline">Load More</button>
                </div>
              )}
              {!hasMore && filtered.length > PAGE_SIZE && (
                <p className="text-center font-raleway text-cosmic-cream/20 text-xs tracking-widest mt-10">
                  All {filtered.length} products shown
                </p>
              )}
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}