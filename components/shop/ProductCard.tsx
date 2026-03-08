import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { useGeo } from '@/context/GeoContext'
import { useCart } from '@/context/CartContext'

export interface Product {
  id:               string
  name:             string
  slug:             string
  sku:              string
  description:      string
  collections:      string[]
  priceINR:         number
  priceUSD:         number
  originalPriceINR: number
  originalPriceUSD: number
  discountValue:    number
  ribbon:           string
  images:           string[]
  specs:            { title: string; value: string }[]
  options:          { name: string; type: string; choices: string[] }[]
  tags:             string[]
  inStock:          boolean
  stock:            number
  published:        boolean
  featured:         boolean
  brand:            string
  weight:           number
}

interface Props {
  product: Product
  index?:  number
}

export default function ProductCard({ product, index = 0 }: Props) {
  const { symbol, isIndia } = useGeo()
  const { addToCart, items } = useCart()

  const price         = isIndia ? product.priceINR         : product.priceUSD
  const originalPrice = isIndia ? product.originalPriceINR : product.originalPriceUSD
  const hasDiscount   = originalPrice > 0 && originalPrice > price
  const discountPct   = hasDiscount
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null

  const image  = product.images?.[0] || ''
  const inCart = items.some(i => i.id === product.id)

  function handleAddToCart() {
    addToCart({
      id:          product.id,
      name:        product.name,
      priceINR:    product.priceINR,
      priceUSD:    product.priceUSD,
      images:      product.images,
      collections: product.collections || [],
      quantity:    1,
    })
  }

  return (
    <div
      className="cosmic-card flex flex-col group"
      style={{ opacity: 1, transition: `opacity 0.5s ease ${(index % 6) * 0.07}s` }}
    >
      {/* Image */}
      <Link href={`/shop/${product.slug}`} className="relative block aspect-square overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.3), rgba(26,10,46,0.6))' }}
          >
            <span className="text-5xl">💎</span>
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.ribbon && (
            <span className="font-raleway text-xs tracking-widest uppercase bg-cosmic-gold text-cosmic-black px-2 py-0.5 font-bold">
              {product.ribbon}
            </span>
          )}
          {discountPct && !product.ribbon && (
            <span className="font-raleway text-xs tracking-widest bg-red-900/80 text-red-200 px-2 py-0.5">
              -{discountPct}%
            </span>
          )}
          {!product.inStock && (
            <span className="font-raleway text-xs tracking-widest bg-cosmic-black/80 text-cosmic-cream/50 px-2 py-0.5">
              Out of Stock
            </span>
          )}
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-cosmic-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className="font-raleway text-xs text-white tracking-widest uppercase border border-white/50 px-3 py-2">
            View Product
          </span>
        </div>
      </Link>

      {/* Details */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Collection */}
        {product.collections?.length > 0 && (
          <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-1 truncate">
            {product.collections[0]}
          </p>
        )}

        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold leading-snug mb-2 hover:text-cosmic-gold transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        {/* Price */}
        <div className="flex items-center gap-2 mt-auto mb-3 flex-wrap">
          <span className="font-cinzel text-cosmic-gold font-bold text-base">
            {symbol}{isIndia ? price.toLocaleString('en-IN') : price.toFixed(2)}
          </span>
          {hasDiscount && (
            <span className="font-raleway text-cosmic-cream/30 text-xs line-through">
              {symbol}{isIndia ? originalPrice.toLocaleString('en-IN') : originalPrice.toFixed(2)}
            </span>
          )}
          {discountPct && (
            <span className="font-raleway text-xs text-cosmic-gold/70">
              -{discountPct}%
            </span>
          )}
        </div>

        {/* Add to cart */}
        <button
          onClick={handleAddToCart}
          disabled={!product.inStock}
          className={`w-full flex items-center justify-center gap-2 font-raleway text-xs tracking-widest uppercase py-2.5 transition-all duration-300 ${
            inCart
              ? 'border border-cosmic-gold/60 text-cosmic-gold'
              : product.inStock
              ? 'btn-primary text-xs py-2.5'
              : 'border border-cosmic-cream/10 text-cosmic-cream/25 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={13} />
          {inCart ? 'Added ✓' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
        </button>
      </div>
    </div>
  )
}