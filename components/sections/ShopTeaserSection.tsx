import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { ShoppingBag } from 'lucide-react'

const products = [
  {
    name: 'Amethyst Healing Bracelet',
    price: '₹1,299',
    originalPrice: '₹1,800',
    benefit: 'Calms anxiety, promotes clarity',
    color: '#9B59B6',
    emoji: '💜',
    badge: 'Bestseller',
  },
  {
    name: 'Rose Quartz Crystal',
    price: '₹899',
    originalPrice: '₹1,200',
    benefit: 'Attracts love, heals the heart',
    color: '#E8A0B4',
    emoji: '🌸',
    badge: 'Popular',
  },
  {
    name: 'Black Tourmaline Stone',
    price: '₹749',
    originalPrice: '₹1,100',
    benefit: 'Protection from negative energy',
    color: '#2C2C2C',
    emoji: '🖤',
    badge: 'Protection',
  },
  {
    name: 'Citrine Abundance Crystal',
    price: '₹1,099',
    originalPrice: '₹1,500',
    benefit: 'Manifests wealth and success',
    color: '#F0A500',
    emoji: '✨',
    badge: 'New',
  },
]

function ProductCard({ product, index }: { product: typeof products[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="cosmic-card p-5 flex flex-col group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Image placeholder with crystal emoji */}
      <div
        className="relative w-full aspect-square rounded-sm mb-4 flex items-center justify-center overflow-hidden"
        style={{
          background: `radial-gradient(circle at 40% 40%, ${product.color}33, ${product.color}11)`,
          border: `1px solid ${product.color}44`,
        }}
      >
        <span
          className="text-6xl group-hover:scale-110 transition-transform duration-500"
          style={{ filter: 'drop-shadow(0 0 20px currentColor)' }}
        >
          {product.emoji}
        </span>

        {/* Badge */}
        <div className="absolute top-3 left-3">
          <span className="font-raleway text-xs tracking-widest uppercase bg-cosmic-gold text-cosmic-black px-2.5 py-1 font-semibold">
            {product.badge}
          </span>
        </div>
      </div>

      {/* Details */}
      <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold mb-1 group-hover:text-cosmic-gold transition-colors">
        {product.name}
      </h3>
      <p className="font-cormorant text-cosmic-cream/50 text-sm italic mb-3 leading-snug">
        {product.benefit}
      </p>

      {/* Price */}
      <div className="flex items-center gap-2 mt-auto">
        <span className="font-cinzel text-cosmic-gold font-bold text-base">{product.price}</span>
        <span className="font-raleway text-cosmic-cream/30 text-xs line-through">{product.originalPrice}</span>
      </div>
    </div>
  )
}

export default function ShopTeaserSection() {
  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true) },
      { threshold: 0.3 }
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section bg-cosmic-gradient">
      <div className="container-cosmic">

        {/* Header */}
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

        {/* Product grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>

        {/* CTA */}
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
