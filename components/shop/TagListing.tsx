// components/shop/TagListing.tsx
// A product listing filtered by a single tag (a crystal or a purpose), with a
// light filter sidebar: category facet (checkboxes) + price range slider.
//
// All filtering is client-side: we fetch all products once, narrow by the tag,
// then apply category/price filters in-memory. Reads category facets only from
// the products actually matching the tag, so people never see filters that
// would yield zero results.
import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, SlidersHorizontal, X } from 'lucide-react'
import { useGeo } from '@/context/GeoContext'
import ProductCard from '@/components/shop/ProductCard'
import { fetchAllProducts, getCachedProducts } from '@/lib/fetchProducts'
import type { Product } from '@/types/product'

const SORTS = [
  { value: 'featured',   label: 'Featured' },
  { value: 'price-asc',  label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'name-asc',   label: 'Name: A–Z' },
]

interface Props {
  tag: string                 // exact tag value to filter by
  title: string               // display title
  eyebrow: string             // small label above title
  backHref: string            // e.g. /shop/crystals
  backLabel: string           // e.g. All Crystals
  icon?: string
}

interface FiltersState {
  categories: string[]
  priceMin: number | null
  priceMax: number | null
}

const EMPTY_FILTERS: FiltersState = { categories: [], priceMin: null, priceMax: null }

export default function TagListing({
  tag, title, eyebrow, backHref, backLabel, icon,
}: Props) {
  const { isIndia, symbol } = useGeo()
  // Hydrate from cache synchronously on mount — no loading flash when warm.
  const [all, setAll]         = useState<Product[]>(() => getCachedProducts() || [])
  const [loading, setLoading] = useState<boolean>(() => !getCachedProducts())
  const [sort, setSort]       = useState('featured')
  const [filters, setFilters] = useState<FiltersState>(EMPTY_FILTERS)
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false)

  useEffect(() => {
    // If we already had cached data at mount, skip the fetch entirely —
    // fetchAllProducts() would just return the same array.
    if (getCachedProducts()) return
    let on = true
    setLoading(true)
    fetchAllProducts()
      .then((p) => on && setAll(p))
      .finally(() => on && setLoading(false))
    return () => { on = false }
  }, [])

  // Reset filters whenever the tag changes (e.g. clicking another crystal)
  useEffect(() => { setFilters(EMPTY_FILTERS) }, [tag])

  const price = (p: Product) => (isIndia ? p.priceINR : p.priceUSD)

  // 1) Products that match the *tag* (before category/price filters).
  const tagMatched = useMemo(() => {
    const want = tag.trim().toLowerCase()
    return all.filter((p) =>
      (p.tags || []).some((t) => (t || '').trim().toLowerCase() === want),
    )
  }, [all, tag])

  // 2) Category facets — only show categories that actually appear in tagMatched,
  //    with live counts so the sidebar is never misleading.
  const categoryFacets = useMemo(() => {
    const counts: Record<string, number> = {}
    for (const p of tagMatched) {
      for (const c of p.collections || []) {
        counts[c] = (counts[c] || 0) + 1
      }
    }
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
  }, [tagMatched])

  // 3) Price bounds from tagMatched (drives the slider extremes & placeholders).
  const priceBounds = useMemo(() => {
    if (tagMatched.length === 0) return { min: 0, max: 0 }
    let min = Infinity, max = -Infinity
    for (const p of tagMatched) {
      const v = price(p)
      if (typeof v === 'number' && !Number.isNaN(v)) {
        if (v < min) min = v
        if (v > max) max = v
      }
    }
    if (!Number.isFinite(min)) return { min: 0, max: 0 }
    return { min: Math.floor(min), max: Math.ceil(max) }
  }, [tagMatched, isIndia])

  // 4) Apply category + price filters and sort.
  const filteredSorted = useMemo(() => {
    const lo = filters.priceMin ?? -Infinity
    const hi = filters.priceMax ?? Infinity
    const cats = new Set(filters.categories)
    const out = tagMatched.filter((p) => {
      if (cats.size > 0 && !(p.collections || []).some((c) => cats.has(c))) return false
      const v = price(p)
      if (typeof v === 'number' && (v < lo || v > hi)) return false
      return true
    })
    if (sort === 'price-asc')      out.sort((a, b) => price(a) - price(b))
    else if (sort === 'price-desc') out.sort((a, b) => price(b) - price(a))
    else if (sort === 'name-asc')   out.sort((a, b) => a.name.localeCompare(b.name))
    else                            out.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1))
    return out
  }, [tagMatched, filters, sort, isIndia])

  const activeFilterCount =
    filters.categories.length + (filters.priceMin != null ? 1 : 0) + (filters.priceMax != null ? 1 : 0)

  function toggleCategory(name: string) {
    setFilters((f) => ({
      ...f,
      categories: f.categories.includes(name)
        ? f.categories.filter((c) => c !== name)
        : [...f.categories, name],
    }))
  }

  function clearFilters() { setFilters(EMPTY_FILTERS) }

  // ── Sidebar (used desktop + mobile drawer) ────────────────────────────────
  const Sidebar = (
    <aside className="space-y-7">
      <div className="flex items-center justify-between">
        <h2 className="font-cinzel text-cosmic-gold text-sm tracking-widest uppercase">Filters</h2>
        {activeFilterCount > 0 && (
          <button onClick={clearFilters}
            className="font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-[11px] tracking-widest uppercase transition-colors">
            Clear all
          </button>
        )}
      </div>

      {/* Price */}
      <div>
        <p className="font-cinzel text-cosmic-cream text-xs tracking-widest uppercase mb-3">Price ({symbol})</p>
        <div className="flex items-center gap-2">
          <input
            type="number" inputMode="numeric"
            placeholder={String(priceBounds.min)}
            value={filters.priceMin ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, priceMin: e.target.value ? Number(e.target.value) : null }))}
            className="w-full bg-cosmic-deepPurple/60 border border-cosmic-gold/20 text-cosmic-cream font-raleway text-xs py-2 px-2 outline-none focus:border-cosmic-gold/50 transition-colors"
            min={0}
          />
          <span className="text-cosmic-cream/40 text-xs">to</span>
          <input
            type="number" inputMode="numeric"
            placeholder={String(priceBounds.max)}
            value={filters.priceMax ?? ''}
            onChange={(e) => setFilters((f) => ({ ...f, priceMax: e.target.value ? Number(e.target.value) : null }))}
            className="w-full bg-cosmic-deepPurple/60 border border-cosmic-gold/20 text-cosmic-cream font-raleway text-xs py-2 px-2 outline-none focus:border-cosmic-gold/50 transition-colors"
            min={0}
          />
        </div>
        <p className="font-cormorant italic text-cosmic-cream/40 text-xs mt-2">
          Range in this collection: {symbol}{priceBounds.min} – {symbol}{priceBounds.max}
        </p>
      </div>

      {/* Category */}
      {categoryFacets.length > 0 && (
        <div>
          <p className="font-cinzel text-cosmic-cream text-xs tracking-widest uppercase mb-3">Category</p>
          <ul className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
            {categoryFacets.map((f) => {
              const checked = filters.categories.includes(f.name)
              return (
                <li key={f.name}>
                  <label className="flex items-center justify-between gap-2 cursor-pointer group">
                    <span className="flex items-center gap-2 min-w-0">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleCategory(f.name)}
                        className="accent-cosmic-gold w-3.5 h-3.5"
                      />
                      <span className={`font-raleway text-[13px] truncate transition-colors ${checked ? 'text-cosmic-gold' : 'text-cosmic-cream/70 group-hover:text-cosmic-gold'}`}>
                        {f.name}
                      </span>
                    </span>
                    <span className="font-raleway text-cosmic-cream/30 text-[11px] shrink-0">{f.count}</span>
                  </label>
                </li>
              )
            })}
          </ul>
        </div>
      )}
    </aside>
  )

  return (
    <>
      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <Link href={backHref}
            className="inline-flex items-center gap-2 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-5 transition-colors">
            <ArrowLeft size={12} /> {backLabel}
          </Link>
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.4em] uppercase mb-3">{eyebrow}</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream" style={{ fontSize: 'clamp(1.9rem, 4.5vw, 3rem)' }}>
            {icon && <span className="mr-2">{icon}</span>}
            <span className="text-gradient-gold">{title}</span>
          </h1>
          {!loading && (
            <p className="font-cormorant italic text-cosmic-cream/50 text-lg mt-3">
              {filteredSorted.length} of {tagMatched.length} product{tagMatched.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      {/* Toolbar */}
      <div className="sticky top-16 z-30 bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex items-center justify-between gap-3">
          <Link href={backHref}
            className="font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-xs tracking-widest uppercase transition-colors hidden sm:inline-block">
            ← {backLabel}
          </Link>
          {/* Mobile filter trigger */}
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="lg:hidden flex items-center gap-2 bg-cosmic-deepPurple border border-cosmic-gold/20 text-cosmic-cream/70 font-raleway text-xs tracking-wider py-2 px-3 hover:border-cosmic-gold/40 transition-colors">
            <SlidersHorizontal size={13} /> Filters
            {activeFilterCount > 0 && (
              <span className="bg-cosmic-gold text-cosmic-ink rounded-full text-[10px] w-4 h-4 flex items-center justify-center font-bold">
                {activeFilterCount}
              </span>
            )}
          </button>
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-cosmic-deepPurple border border-cosmic-gold/20 text-cosmic-cream/70 font-raleway text-xs tracking-wider py-2 px-3 outline-none hover:border-cosmic-gold/40 transition-colors">
            {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>
      </div>

      {/* Body: sidebar + grid */}
      <section className="py-10 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden lg:block w-64 shrink-0 sticky top-32 self-start max-h-[calc(100vh-9rem)] overflow-y-auto pr-2">
            {Sidebar}
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="animate-pulse border border-cosmic-gold/5 bg-cosmic-deepPurple/30 rounded-sm">
                    <div className="aspect-square bg-cosmic-gold/5" />
                    <div className="p-3 space-y-2">
                      <div className="h-3 bg-cosmic-gold/8 rounded" />
                      <div className="h-3 bg-cosmic-gold/5 rounded w-3/4" />
                    </div>
                  </div>
                ))}
              </div>
            ) : tagMatched.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-5xl block mb-4">🔮</span>
                <p className="font-cinzel text-cosmic-cream/40 text-sm mb-1">No products found for {title}</p>
                <Link href={backHref} className="btn-outline mt-6 text-xs">{backLabel}</Link>
              </div>
            ) : filteredSorted.length === 0 ? (
              <div className="text-center py-24">
                <p className="font-cinzel text-cosmic-cream/50 text-sm mb-2">No products match these filters</p>
                <button onClick={clearFilters} className="btn-outline mt-4 text-xs">Clear filters</button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredSorted.map((p, i) => <ProductCard key={p.id} product={p as any} index={i} />)}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Mobile filter drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 lg:hidden" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-cosmic-black/80 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
          <div className="absolute top-0 right-0 h-full w-80 max-w-[90vw] bg-gradient-to-b from-cosmic-deepPurple to-cosmic-black border-l border-cosmic-gold/20 p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <p className="font-cinzel text-cosmic-gold text-sm tracking-widest uppercase">Filters</p>
              <button onClick={() => setMobileFiltersOpen(false)} className="text-cosmic-cream/70 hover:text-cosmic-gold">
                <X size={20} />
              </button>
            </div>
            {Sidebar}
            <button onClick={() => setMobileFiltersOpen(false)} className="btn-primary w-full mt-8 text-xs">
              Show {filteredSorted.length} product{filteredSorted.length !== 1 ? 's' : ''}
            </button>
          </div>
        </div>
      )}
    </>
  )
}
