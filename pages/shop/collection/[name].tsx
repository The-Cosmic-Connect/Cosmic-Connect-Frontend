import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Search, X, SlidersHorizontal, ArrowLeft } from 'lucide-react'
import type { GetStaticPaths, GetStaticProps } from 'next'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const PAGE_SIZE = 48

// Which spec titles to surface as filter groups (in this order). The titles are
// matched against product.specs[].title. Leave this array empty ([]) to instead
// auto-show every spec that has more than one distinct value.
const SPEC_FILTERS_WHITELIST: string[] = ['Beads Size', 'Design & Shape', 'Quality']

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

// ---------------------------------------------------------------------------
// Faceting helpers
// ---------------------------------------------------------------------------

type FacetOption = { value: string; count: number }
type SpecGroup   = { title: string; options: FacetOption[] }

// `brand` lives on products coming from the API but isn't in the shared Product
// type, so read it defensively.
function getBrand(p: Product): string | undefined {
  const b = (p as any).brand
  return typeof b === 'string' && b.trim() ? b.trim() : undefined
}

// Migrated data sometimes stores spec titles/values as HTML strings
// (e.g. "<p><span>10-15 grams approx.</span></p>"). Strip the markup and
// normalise so equivalent values collapse into one filter option.
function stripHtml(raw: string): string {
  if (!raw) return ''
  return raw
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&quot;/gi, '"')
    .replace(/<[^>]*>/g, ' ')   // remove all tags
    .replace(/\s+/g, ' ')        // collapse whitespace
    .trim()
}

function cleanSpecValue(raw: string): string {
  // also drop a single trailing period so "approx" and "approx." merge
  return stripHtml(raw).replace(/\.\s*$/, '').trim()
}

function specValues(p: Product, title: string): string[] {
  const want = stripHtml(title).toLowerCase()
  return (p.specs || [])
    .filter(s => stripHtml(s?.title || '').toLowerCase() === want)
    .map(s => cleanSpecValue(s?.value || ''))
    .filter(Boolean)
}

function tally(products: Product[], pick: (p: Product) => string[]): FacetOption[] {
  const map = new Map<string, number>()
  for (const p of products) {
    const seen = new Set<string>()
    for (const raw of pick(p)) {
      const v = (raw || '').trim()
      if (!v || seen.has(v)) continue
      seen.add(v)
      map.set(v, (map.get(v) || 0) + 1)
    }
  }
  const num = (v: string) => {
    const m = v.match(/^(\d+(?:\.\d+)?)/)
    return m ? parseFloat(m[1]) : NaN
  }
  return Array.from(map.entries())
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => {
      if (b.count !== a.count) return b.count - a.count
      const na = num(a.value), nb = num(b.value)
      if (!isNaN(na) && !isNaN(nb) && na !== nb) return na - nb
      return a.value.localeCompare(b.value)
    })
}

function buildSpecGroups(products: Product[]): SpecGroup[] {
  // discover all spec titles present
  const titles: string[] = []
  for (const p of products) {
    for (const s of (p.specs || [])) {
      const t = stripHtml(s?.title || '')
      if (t && !titles.find(x => x.toLowerCase() === t.toLowerCase())) titles.push(t)
    }
  }

  let chosen = titles
  if (SPEC_FILTERS_WHITELIST.length) {
    const wl = SPEC_FILTERS_WHITELIST.map(w => w.toLowerCase())
    const matched = SPEC_FILTERS_WHITELIST
      .map(w => titles.find(t => t.toLowerCase() === w.toLowerCase()))
      .filter(Boolean) as string[]
    chosen = matched.length ? matched : titles // fall back to auto if none match
  }

  return chosen
    .map(title => ({ title, options: tally(products, p => specValues(p, title)) }))
    .filter(g => g.options.length > 1)
}

// ---------------------------------------------------------------------------
// ProductCard  (unchanged from your existing page)
// ---------------------------------------------------------------------------

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
        hover:border-cosmic-gold/30 hover:shadow-[0_8px_24px_rgb(var(--cosmic-gold) / 0.1)]">
        <div className="relative aspect-square overflow-hidden">
          {image ? (
            <img src={image} alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-cosmic-gold text-4xl"
              style={{ background: 'linear-gradient(135deg, rgb(var(--cosmic-violet) / 0.4), rgb(var(--cosmic-black) / 0.8))' }}>✦</div>
          )}
          {product.ribbon && (
            <span className="absolute top-2 left-2 bg-cosmic-gold text-cosmic-ink text-xs font-bold font-raleway px-2 py-0.5 tracking-wide uppercase">
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
                hover:bg-cosmic-gold hover:text-cosmic-ink border-t border-cosmic-gold/20">
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

// ---------------------------------------------------------------------------
// Sidebar building blocks
// ---------------------------------------------------------------------------

function FilterSection({ title, children, defaultOpen = true }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div className="border-b border-cosmic-gold/15 py-4">
      <button type="button" onClick={() => setOpen(o => !o)} aria-expanded={open}
        className="flex w-full items-center justify-between text-left font-raleway text-xs font-semibold uppercase tracking-widest text-cosmic-cream/90 hover:text-cosmic-gold transition-colors">
        <span>{title}</span>
        <span className="text-lg leading-none text-cosmic-gold/70">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  )
}

function CheckRow({ label, count, checked, onToggle }: {
  label: string; count?: number; checked: boolean; onToggle: () => void
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 font-cormorant text-[15px] text-cosmic-cream/80 hover:text-cosmic-cream transition-colors">
      <input type="checkbox" checked={checked} onChange={onToggle}
        className="h-4 w-4 shrink-0 cursor-pointer accent-cosmic-gold" />
      <span className="flex-1 leading-snug">{label}</span>
      {typeof count === 'number' && (
        <span className="font-raleway text-xs text-cosmic-cream/40">({count})</span>
      )}
    </label>
  )
}

function CheckList({ options, selected, onToggle }: {
  options: FacetOption[]; selected: string[]; onToggle: (v: string) => void
}) {
  const scrollable = options.length > 8
  return (
    <div className={scrollable ? 'max-h-56 overflow-y-auto pr-1 cosmic-scroll' : undefined}>
      {options.map(opt => (
        <CheckRow key={opt.value} label={opt.value} count={opt.count}
          checked={selected.includes(opt.value)} onToggle={() => onToggle(opt.value)} />
      ))}
    </div>
  )
}

function PriceSlider({ min, max, value, step, symbol, onChange }: {
  min: number; max: number; value: [number, number]; step: number; symbol: string
  onChange: (v: [number, number]) => void
}) {
  const [lo, hi] = value
  const range = Math.max(1, max - min)
  const pctLo = ((lo - min) / range) * 100
  const pctHi = ((hi - min) / range) * 100
  const fmt = (n: number) => (n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}k` : `${n}`)

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <input type="number" value={lo} min={min} max={max} placeholder="Min"
          onChange={e => onChange([Math.min(Number(e.target.value || min), hi), hi])}
          className="w-full rounded-md border border-cosmic-gold/30 bg-cosmic-black/40 px-2.5 py-1.5 font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/40 outline-none focus:border-cosmic-gold" />
        <span className="text-cosmic-cream/40">–</span>
        <input type="number" value={hi} min={min} max={max} placeholder="Max"
          onChange={e => onChange([lo, Math.max(Number(e.target.value || max), lo)])}
          className="w-full rounded-md border border-cosmic-gold/30 bg-cosmic-black/40 px-2.5 py-1.5 font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/40 outline-none focus:border-cosmic-gold" />
      </div>

      <div className="relative h-5">
        <div className="absolute top-1/2 h-1 w-full -translate-y-1/2 rounded-full bg-cosmic-gold/15" />
        <div className="absolute top-1/2 h-1 -translate-y-1/2 rounded-full bg-cosmic-gold"
          style={{ left: `${pctLo}%`, right: `${100 - pctHi}%` }} />
        <input type="range" min={min} max={max} step={step} value={lo}
          onChange={e => onChange([Math.min(Number(e.target.value), hi), hi])}
          aria-label="Minimum price"
          className="price-thumb pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent" />
        <input type="range" min={min} max={max} step={step} value={hi}
          onChange={e => onChange([lo, Math.max(Number(e.target.value), lo)])}
          aria-label="Maximum price"
          className="price-thumb pointer-events-none absolute top-0 h-5 w-full appearance-none bg-transparent" />
      </div>

      <div className="mt-1 flex justify-between font-raleway text-xs text-cosmic-cream/50">
        <span>{symbol}{fmt(min)}</span>
        <span>{symbol}{fmt(max)}</span>
      </div>

      <style jsx global>{`
        .price-thumb::-webkit-slider-thumb {
          pointer-events: auto; appearance: none; height: 16px; width: 16px;
          border-radius: 9999px; background: rgb(var(--cosmic-gold)); border: 2px solid rgb(var(--cosmic-deep-purple));
          cursor: pointer; box-shadow: 0 0 6px rgb(var(--cosmic-gold) / 0.6);
        }
        .price-thumb::-moz-range-thumb {
          pointer-events: auto; height: 16px; width: 16px; border-radius: 9999px;
          background: rgb(var(--cosmic-gold)); border: 2px solid rgb(var(--cosmic-deep-purple)); cursor: pointer;
        }
        .cosmic-scroll::-webkit-scrollbar { width: 6px; }
        .cosmic-scroll::-webkit-scrollbar-thumb { background: rgb(var(--cosmic-gold) / 0.4); border-radius: 9999px; }
        .cosmic-scroll::-webkit-scrollbar-track { background: transparent; }
      `}</style>
    </div>
  )
}

// ---------------------------------------------------------------------------
// The sidebar (used in the desktop column and the mobile drawer)
// ---------------------------------------------------------------------------

interface SidebarProps {
  symbol: string
  maxPrice: number
  priceRange: [number, number]
  setPriceRange: (v: [number, number]) => void
  onSaleOnly: boolean;  setOnSaleOnly: (v: boolean) => void;  onSaleCount: number
  inStockOnly: boolean; setInStockOnly: (v: boolean) => void; inStockCount: number
  collectionFacet: FacetOption[]; selectedCollections: string[]; toggleCollection: (v: string) => void
  brandFacet: FacetOption[];      selectedBrands: string[];      toggleBrand: (v: string) => void
  specGroups: SpecGroup[];        selectedSpecs: Record<string, string[]>; toggleSpec: (title: string, v: string) => void
}

function FiltersSidebar(p: SidebarProps) {
  return (
    <div className="font-raleway">
      <FilterSection title="Price">
        <PriceSlider min={0} max={p.maxPrice} step={500} value={p.priceRange}
          symbol={p.symbol} onChange={p.setPriceRange} />
      </FilterSection>

      <FilterSection title="Availability">
        <CheckRow label="In Stock" count={p.inStockCount}
          checked={p.inStockOnly} onToggle={() => p.setInStockOnly(!p.inStockOnly)} />
        {p.onSaleCount > 0 && (
          <CheckRow label="On Sale" count={p.onSaleCount}
            checked={p.onSaleOnly} onToggle={() => p.setOnSaleOnly(!p.onSaleOnly)} />
        )}
      </FilterSection>

      {p.collectionFacet.length > 0 && (
        <FilterSection title="Collections">
          <CheckList options={p.collectionFacet} selected={p.selectedCollections} onToggle={p.toggleCollection} />
        </FilterSection>
      )}

      {p.brandFacet.length > 0 && (
        <FilterSection title="Brands">
          <CheckList options={p.brandFacet} selected={p.selectedBrands} onToggle={p.toggleBrand} />
        </FilterSection>
      )}

      {p.specGroups.map(group => (
        <FilterSection key={group.title} title={group.title}>
          <CheckList options={group.options}
            selected={p.selectedSpecs[group.title] || []}
            onToggle={(v) => p.toggleSpec(group.title, v)} />
        </FilterSection>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function CollectionPage({ initialProducts, initialTitle }: {
  initialProducts?: Product[]
  initialTitle?: string
}) {
  const router = useRouter()
  const { name: nameSlug } = router.query as { name: string }

  const { isIndia, symbol, loading: geoLoading } = useGeo()

  // Seed from ISR-rendered props when present, so the first paint already
  // has real data — no skeleton grid on a cold/SEO visit.
  const [allProducts, setAllProducts] = useState<Product[]>(initialProducts || [])
  const [loading,     setLoading]     = useState(!(initialProducts && initialProducts.length > 0))
  const [search,      setSearch]      = useState('')
  const [sort,        setSort]        = useState('featured')
  const [page,        setPage]        = useState(1)
  const [onSaleOnly,  setOnSaleOnly]  = useState(false)
  const [inStockOnly, setInStockOnly] = useState(false)
  const [priceRange,  setPriceRange]  = useState<[number, number]>([0, 100000])
  const [maxPrice,    setMaxPrice]    = useState(100000)
  const [pageTitle,   setPageTitle]   = useState(initialTitle || 'Collection')
  const [mobileOpen,  setMobileOpen]  = useState(false)

  // new facet selections
  const [selectedCollections, setSelectedCollections] = useState<string[]>([])
  const [selectedBrands,      setSelectedBrands]      = useState<string[]>([])
  const [selectedSpecs,       setSelectedSpecs]       = useState<Record<string, string[]>>({})

  const isAll = nameSlug === 'all'

  useEffect(() => {
    if (!nameSlug) return

    // If ISR already delivered this exact page's products via props, skip
    // the client fetch entirely on first mount. Client-side navigation
    // between two different collection pages still re-fetches (initialProducts
    // won't match the new nameSlug in that case — see the dependency below).
    if (initialProducts && initialProducts.length > 0) {
      setAllProducts(initialProducts)
      setPageTitle(initialTitle || pageTitle)
      setLoading(false)
      const prices = initialProducts.map(p => isIndia ? p.priceINR : p.priceUSD).filter(Boolean)
      const max = Math.ceil(Math.max(...prices, 1000) / 500) * 500
      setMaxPrice(max)
      setPriceRange([0, max])
      return
    }

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

  // reset to first page whenever any filter changes
  useEffect(() => { setPage(1) }, [
    search, sort, onSaleOnly, inStockOnly, priceRange,
    selectedCollections, selectedBrands, selectedSpecs,
  ])

  const price     = (p: Product) => isIndia ? p.priceINR         : p.priceUSD
  const origPrice = (p: Product) => isIndia ? p.originalPriceINR : p.originalPriceUSD

  // search defines the "scope" that the facet counts are computed from
  const searched = useMemo(() =>
    allProducts.filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      (p.description || '').toLowerCase().includes(search.toLowerCase())
    ), [allProducts, search])

  const collectionFacet = useMemo(() => tally(searched, p => p.collections || []), [searched])
  const brandFacet      = useMemo(() => tally(searched, p => { const b = getBrand(p); return b ? [b] : [] }), [searched])
  const specGroups      = useMemo(() => buildSpecGroups(searched), [searched])
  const inStockCount    = useMemo(() => searched.filter(p => p.inStock).length, [searched])
  const onSaleCount     = useMemo(() => searched.filter(p => origPrice(p) > 0 && origPrice(p) > price(p)).length, [searched, isIndia])

  const filtered = useMemo(() => sortProducts(
    searched.filter(p => {
      const pr = price(p)
      if (onSaleOnly  && !(origPrice(p) > 0 && origPrice(p) > pr)) return false
      if (inStockOnly && !p.inStock) return false
      if (pr < priceRange[0] || pr > priceRange[1]) return false
      if (selectedCollections.length && !(p.collections || []).some(c => selectedCollections.includes(c))) return false
      if (selectedBrands.length) { const b = getBrand(p); if (!b || !selectedBrands.includes(b)) return false }
      for (const title of Object.keys(selectedSpecs)) {
        const sel = selectedSpecs[title]
        if (!sel || !sel.length) continue
        const vals = specValues(p, title)
        if (!sel.some(v => vals.includes(v))) return false
      }
      return true
    }),
    sort, isIndia
  ), [searched, onSaleOnly, inStockOnly, priceRange, selectedCollections, selectedBrands, selectedSpecs, sort, isIndia])

  const paginated = filtered.slice(0, page * PAGE_SIZE)
  const hasMore   = paginated.length < filtered.length

  const activeFiltersCount =
    (onSaleOnly ? 1 : 0) +
    (inStockOnly ? 1 : 0) +
    ((priceRange[0] > 0 || priceRange[1] < maxPrice) ? 1 : 0) +
    selectedCollections.length +
    selectedBrands.length +
    Object.values(selectedSpecs).reduce((n, arr) => n + arr.length, 0)

  const toggleIn = (arr: string[], v: string) =>
    arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v]

  const toggleCollection = (v: string) => setSelectedCollections(a => toggleIn(a, v))
  const toggleBrand      = (v: string) => setSelectedBrands(a => toggleIn(a, v))
  const toggleSpec       = (title: string, v: string) =>
    setSelectedSpecs(prev => ({ ...prev, [title]: toggleIn(prev[title] || [], v) }))

  function clearAll() {
    setOnSaleOnly(false)
    setInStockOnly(false)
    setPriceRange([0, maxPrice])
    setSelectedCollections([])
    setSelectedBrands([])
    setSelectedSpecs({})
    setSearch('')
  }

  const sidebarProps: SidebarProps = {
    symbol, maxPrice, priceRange, setPriceRange,
    onSaleOnly, setOnSaleOnly, onSaleCount,
    inStockOnly, setInStockOnly, inStockCount,
    collectionFacet, selectedCollections, toggleCollection,
    brandFacet, selectedBrands, toggleBrand,
    specGroups, selectedSpecs, toggleSpec,
  }

  return (
    <Layout
      title={`${pageTitle} | The Cosmic Connect Shop`}
      description={`Shop authentic ${pageTitle} — crystals, healing tools and spiritual products energized by Reiki Grand Masters.`}
      canonical={`/shop/collection/${nameSlug}`}
    >
      {/* Hero */}
      <section className="relative pt-32 pb-10 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 50% 60% at 50% 0%, rgb(var(--cosmic-gold) / 0.06), transparent 70%)' }} />
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

      {/* Sticky toolbar: search + sort + mobile filter button */}
      <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex items-center gap-3">
          <div className="flex items-center gap-2 border border-cosmic-gold/20 px-3 flex-1 max-w-xs">
            <Search size={13} className="text-cosmic-cream/30 shrink-0" />
            <input type="text" placeholder={`Search ${pageTitle}...`} value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent font-raleway text-xs text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-2 w-full" />
            {search && (
              <button onClick={() => setSearch('')} className="text-cosmic-cream/30 hover:text-cosmic-gold"><X size={12} /></button>
            )}
          </div>

          <select value={sort} onChange={e => setSort(e.target.value)}
            className="bg-cosmic-deepPurple border border-cosmic-gold/20 text-cosmic-cream/70 font-raleway text-xs tracking-wider py-2 px-3 outline-none hover:border-cosmic-gold/40 transition-colors">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* Mobile filters trigger */}
          <button onClick={() => setMobileOpen(true)}
            className={`lg:hidden flex items-center gap-1.5 border px-3 py-2 font-raleway text-xs tracking-widest transition-colors ${
              activeFiltersCount > 0 ? 'border-cosmic-gold text-cosmic-gold' : 'border-cosmic-gold/20 text-cosmic-cream/60'
            }`}>
            <SlidersHorizontal size={12} />
            <span>Filter{activeFiltersCount > 0 ? ` (${activeFiltersCount})` : ''}</span>
          </button>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <section className="py-10 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-32">
              <div className="flex items-center justify-between mb-2">
                <h2 className="font-cinzel text-xl text-cosmic-cream">Filters</h2>
                {activeFiltersCount > 0 && (
                  <button onClick={clearAll}
                    className="font-raleway text-xs uppercase tracking-wider text-cosmic-cream/40 hover:text-cosmic-gold transition-colors">
                    Clear all
                  </button>
                )}
              </div>
              <FiltersSidebar {...sidebarProps} />
            </div>
          </aside>

          {/* Grid */}
          <div className="min-w-0 flex-1">
            {loading || geoLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[...Array(9)].map((_, i) => (
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
                <button onClick={clearAll} className="btn-outline mt-6 text-xs">Clear All Filters</button>
              </div>
            ) : (
              <>
                <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest mb-5">
                  Showing {paginated.length} of {filtered.length} product{filtered.length !== 1 ? 's' : ''}
                  {search ? ` for “${search}”` : ''}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {paginated.map(product => <ProductCard key={product.id} product={product} />)}
                </div>
                {hasMore && (
                  <div className="text-center mt-12">
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
        </div>
      </section>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-cosmic-black/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-[85%] max-w-sm overflow-y-auto bg-cosmic-deepPurple p-5 cosmic-scroll">
            <div className="flex items-center justify-between mb-2">
              <span className="font-cinzel text-xl text-cosmic-cream">Filters</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close filters"
                className="text-2xl leading-none text-cosmic-cream/70 hover:text-cosmic-gold">×</button>
            </div>
            <FiltersSidebar {...sidebarProps} />
            <div className="mt-6 flex gap-3">
              <button onClick={clearAll} className="btn-outline flex-1">Clear</button>
              <button onClick={() => setMobileOpen(false)} className="btn-primary flex-1">Show {filtered.length}</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

// ISR: pre-build nothing at deploy time (28+ collections, plus 'all'); every
// path is generated on first visit via fallback:'blocking' and cached from
// then on, re-validated every 10 minutes. Same pattern as the crystal/purpose
// pages — see pages/shop/crystal/[name].tsx for the full rationale.
export const getStaticPaths: GetStaticPaths = async () => {
  return { paths: [], fallback: 'blocking' }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  const nameSlug = typeof ctx.params?.name === 'string' ? ctx.params.name : ''
  const isAll = nameSlug === 'all'

  let resolvedName = nameSlug
  let initialTitle = 'All Products'

  try {
    if (!isAll) {
      const colRes  = await fetch(`${API}/collections`)
      const colData = await colRes.json()
      const cols: string[] = colData.collections || []
      resolvedName = cols.find((c) => toSlug(c) === nameSlug) || nameSlug
      initialTitle = resolvedName
    }
  } catch (e) {
    console.error(`getStaticProps /shop/collection/${nameSlug}: collections fetch failed`, e)
  }

  let initialProducts: Product[] = []
  try {
    let url = `${API}/products?limit=500`
    if (!isAll) url += `&collection=${encodeURIComponent(resolvedName)}`

    let lastKey: any = null
    do {
      const pageUrl = lastKey ? `${url}&last_key=${encodeURIComponent(JSON.stringify(lastKey))}` : url
      const res  = await fetch(pageUrl)
      if (!res.ok) break
      const data = await res.json()
      initialProducts = [...initialProducts, ...(data.products || [])]
      lastKey = data.nextKey || null
    } while (lastKey)
  } catch (e) {
    console.error(`getStaticProps /shop/collection/${nameSlug}: products fetch failed`, e)
  }

  return {
    props: { initialProducts, initialTitle },
    revalidate: 600,
  }
}
