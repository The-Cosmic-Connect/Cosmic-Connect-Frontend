import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'
import { useGeo } from '@/context/GeoContext'
import { useCart } from '@/context/CartContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Product {
  id: string; name: string; slug: string
  priceINR: number; priceUSD: number
  originalPriceINR: number; originalPriceUSD: number
  images: string[]; ribbon: string; collections: string[]
  inStock: boolean; featured: boolean
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [added, setAdded] = useState(false)
  const { symbol, isIndia } = useGeo()
  const { addToCart } = useCart()

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  const price         = isIndia ? product.priceINR         : product.priceUSD
  const originalPrice = isIndia ? product.originalPriceINR : product.originalPriceUSD
  const hasDiscount   = originalPrice > 0 && originalPrice > price
  const discountPct   = hasDiscount ? Math.round((1 - price / originalPrice) * 100) : 0
  const image         = product.images?.[0] || ''

  function handleAdd(e: React.MouseEvent) {
    e.preventDefault()
    addToCart({ ...product, quantity: 1 })
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <div
      ref={ref}
      className="cosmic-card flex flex-col group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden">
        {image ? (
          <img src={image} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.3), rgba(26,10,46,0.6))' }}>
            💎
          </div>
        )}
        {product.ribbon && (
          <div className="absolute top-3 left-3">
            <span className="font-raleway text-xs tracking-widest uppercase bg-cosmic-gold text-cosmic-black px-2.5 py-1 font-semibold">
              {product.ribbon}
            </span>
          </div>
        )}
      </Link>

      <div className="p-4 flex flex-col flex-grow">
        {product.collections?.length > 0 && (
          <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-1 truncate">
            {product.collections[0]}
          </p>
        )}
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold leading-snug mb-3 hover:text-cosmic-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-2 mt-auto mb-3">
          <span className="font-cinzel text-cosmic-gold font-bold text-base">
            {symbol}{isIndia ? price.toLocaleString('en-IN') : price.toFixed(2)}
          </span>
          {hasDiscount && (
            <>
              <span className="font-raleway text-cosmic-cream/30 text-xs line-through">
                {symbol}{isIndia ? originalPrice.toLocaleString('en-IN') : originalPrice.toFixed(2)}
              </span>
              <span className="font-raleway text-xs text-cosmic-gold/70">-{discountPct}%</span>
            </>
          )}
        </div>
        <button
          onClick={handleAdd}
          disabled={!product.inStock}
          className="w-full font-raleway text-xs tracking-widest uppercase py-2.5 transition-all duration-300 btn-primary"
        >
          {added ? '✓ Added' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}

export default function ShopTeaserSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true) },
      { threshold: 0.3 }
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  // Fetch featured products from backend
  useEffect(() => {
    fetch(`${API}/products?featured=true&limit=4`)
      .then(r => r.json())
      .then(data => {
        const items: Product[] = data.products || []
        // If backend doesn't support featured filter yet, just take first 4
        setProducts(items.slice(0, 4))
      })
      .catch(() => {})
  }, [])

  return (
    <section className="section bg-cosmic-gradient">
      <div className="container-cosmic">
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-4">
            Healing <span className="text-gradient-gold">Crystals & Gems</span>
          </h2>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
            Handpicked and energetically charged crystals to amplify your healing journey
          </p>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          // Skeleton while loading
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="cosmic-card animate-pulse">
                <div className="aspect-square bg-cosmic-gold/5" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-cosmic-gold/5 rounded w-1/2" />
                  <div className="h-4 bg-cosmic-gold/8 rounded" />
                  <div className="h-8 bg-cosmic-gold/5 rounded mt-3" />
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/shop" className="btn-primary">
            <ShoppingBag size={15} />
            Explore Full Shop
          </Link>
          <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest">
            Free shipping on orders above ₹1,999
          </p>
        </div>
      </div>
    </section>
  )
}