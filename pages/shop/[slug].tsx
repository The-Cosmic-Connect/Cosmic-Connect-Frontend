import { useState, useEffect } from 'react'
import { GetServerSideProps } from 'next'
import Head from 'next/head'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { useRouter } from 'next/router'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Spec    { title: string; value: string }
interface Option  { name: string; type: string; choices: string[] }

interface Product {
  id: string; name: string; slug: string; sku: string
  description: string; collections: string[]
  priceINR: number; priceUSD: number
  originalPriceINR: number; originalPriceUSD: number
  discountValue: number; ribbon: string
  images: string[]; specs: Spec[]; options: Option[]
  tags: string[]; inStock: boolean; brand: string
}

export default function ProductPage({ product }: { product: Product }) {
  const { addToCart }    = useCart()
  const { country }      = useGeo()
  const isIndia          = country === 'IN'

  const [mainImg,  setMainImg]  = useState(0)
  const [qty,      setQty]      = useState(1)
  const [openSpec, setOpenSpec] = useState<number | null>(0)
  const [added,    setAdded]    = useState(false)

  // In [slug].tsx, add at top of component:
  const router = useRouter()
  useEffect(() => {
    if (router.query.slug === 'all') {
      router.replace('/shop/collection/all')
    }
  }, [router.query.slug])

  const price         = isIndia ? product.priceINR         : product.priceUSD
  const originalPrice = isIndia ? product.originalPriceINR : product.originalPriceUSD
  const currency      = isIndia ? '₹' : '$'
  const hasDiscount   = originalPrice > 0 && originalPrice > price

  function handleAddToCart() {
    addToCart({ ...product, quantity: qty })
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const discountPct = hasDiscount
    ? Math.round((1 - price / originalPrice) * 100)
    : 0

  return (
    <>
      <Head>
        <title>{product.name} | The Cosmic Connect</title>
        <meta name="description" content={product.description.slice(0, 160)} />
      </Head>
      <Navbar />

      <main style={{ background: '#0A0708', minHeight: '100vh', paddingTop: 80 }}>
        <div className="container-cosmic" style={{ paddingTop: 40, paddingBottom: 60 }}>

          {/* ── Product grid ── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'start' }}
               className="product-grid">

            {/* Left — Images */}
            <div>
              {/* Thumbnails */}
              {product.images.length > 1 && (
                <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
                  {product.images.map((img, i) => (
                    <button key={i} onClick={() => setMainImg(i)}
                      style={{
                        width: 64, height: 64, border: `2px solid ${i === mainImg ? '#C9A84C' : '#333'}`,
                        borderRadius: 6, overflow: 'hidden', cursor: 'pointer', background: 'none', padding: 0,
                      }}>
                      <img src={img} alt={`${product.name} ${i + 1}`}
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </button>
                  ))}
                </div>
              )}
              {/* Main image */}
              <div style={{ position: 'relative', borderRadius: 8, overflow: 'hidden',
                background: '#1A0A2E', aspectRatio: '1/1' }}>
                {product.images[mainImg] ? (
                  <img src={product.images[mainImg]} alt={product.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <div style={{ width: '100%', height: '100%', display: 'flex',
                    alignItems: 'center', justifyContent: 'center', color: '#C9A84C', fontSize: 48 }}>✦</div>
                )}
                {product.ribbon && (
                  <span style={{ position: 'absolute', top: 14, left: 14, background: '#C9A84C',
                    color: '#0A0708', fontSize: 11, fontWeight: 700, padding: '3px 10px',
                    borderRadius: 3, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    {product.ribbon}
                  </span>
                )}
              </div>
            </div>

            {/* Right — Details */}
            <div>
              {/* Collections breadcrumb */}
              {product.collections.length > 0 && (
                <p style={{ color: '#C9A84C', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase', marginBottom: 10 }}>
                  {product.collections.join(' · ')}
                </p>
              )}

              {/* Name */}
              <h1 style={{ fontFamily: 'Cinzel, serif', fontSize: 26, fontWeight: 700,
                color: '#F5EDD6', lineHeight: 1.3, marginBottom: 10 }}>
                {product.name}
              </h1>

              {/* SKU */}
              {product.sku && (
                <p style={{ color: '#666', fontSize: 12, marginBottom: 16 }}>SKU: {product.sku}</p>
              )}

              {/* Price */}
              <div style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  {hasDiscount && (
                    <span style={{ color: '#666', textDecoration: 'line-through', fontSize: 18 }}>
                      {currency}{originalPrice.toLocaleString()}
                    </span>
                  )}
                  <span style={{ color: '#F5EDD6', fontSize: 28, fontWeight: 700 }}>
                    {currency}{price.toLocaleString()}
                  </span>
                  {discountPct > 0 && (
                    <span style={{ background: '#C9A84C22', color: '#C9A84C', fontSize: 12,
                      fontWeight: 600, padding: '2px 8px', borderRadius: 4 }}>
                      {discountPct}% OFF
                    </span>
                  )}
                </div>
                <p style={{ color: '#666', fontSize: 12, marginTop: 4 }}>MRP inclusive of taxes</p>
              </div>

              {/* Options (variants) */}
              {product.options.map(opt => (
                <div key={opt.name} style={{ marginBottom: 16 }}>
                  <p style={{ color: '#C9A84C', fontSize: 12, fontWeight: 600,
                    textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                    {opt.name}
                  </p>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    {opt.choices.map(choice => (
                      <button key={choice} style={{
                        padding: '6px 14px', border: '1px solid #C9A84C44', borderRadius: 4,
                        background: 'none', color: '#F5EDD6', fontSize: 13, cursor: 'pointer',
                      }}>{choice}</button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Quantity */}
              <div style={{ marginBottom: 20 }}>
                <p style={{ color: '#C9A84C', fontSize: 12, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                  Quantity
                </p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 0,
                  border: '1px solid #333', borderRadius: 6, width: 'fit-content' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    style={{ width: 40, height: 40, background: 'none', border: 'none',
                      color: '#F5EDD6', fontSize: 18, cursor: 'pointer' }}>−</button>
                  <span style={{ width: 40, textAlign: 'center', color: '#F5EDD6', fontSize: 15 }}>{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    style={{ width: 40, height: 40, background: 'none', border: 'none',
                      color: '#F5EDD6', fontSize: 18, cursor: 'pointer' }}>+</button>
                </div>
              </div>

              {/* CTA buttons */}
              <div style={{ display: 'flex', gap: 12, marginBottom: 20 }}>
                <button onClick={handleAddToCart} className="btn-primary"
                  style={{ flex: 1, padding: '14px 24px', fontSize: 15, fontWeight: 600 }}
                  disabled={!product.inStock}>
                  {!product.inStock ? 'Out of Stock' : added ? '✓ Added!' : 'Add to Cart'}
                </button>
              </div>

              {/* Share */}
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <span style={{ color: '#666', fontSize: 12 }}>Share:</span>
                <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#1877F2', fontSize: 20 }}>𝑓</a>
                <a href={`https://wa.me/?text=${encodeURIComponent(product.name + ' ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank" rel="noopener noreferrer"
                  style={{ color: '#25D366', fontSize: 16, fontWeight: 700 }}>WhatsApp</a>
              </div>
            </div>
          </div>

          {/* ── Description ── */}
          <div style={{ marginTop: 48, maxWidth: 760 }}>
            <div style={{ whiteSpace: 'pre-line', color: '#F5EDD6aa',
              fontSize: 15, lineHeight: 1.8, fontFamily: 'Cormorant Garamond, Georgia, serif' }}
              dangerouslySetInnerHTML={{ __html: product.description
                .replace(/\n/g, '<br/>')
                .replace(/\*\s+\*/g, '')
                .replace(/\*\*(.*?)\*\*/g, '<strong style="color:#F5EDD6">$1</strong>') }}
            />
          </div>

          {/* ── Specs accordion ── */}
          {product.specs.length > 0 && (
            <div style={{ marginTop: 40, maxWidth: 760, borderTop: '1px solid #222' }}>
              {product.specs.map((spec, i) => (
                <div key={i} style={{ borderBottom: '1px solid #222' }}>
                  <button onClick={() => setOpenSpec(openSpec === i ? null : i)}
                    style={{ width: '100%', display: 'flex', justifyContent: 'space-between',
                      alignItems: 'center', padding: '16px 0', background: 'none',
                      border: 'none', cursor: 'pointer' }}>
                    <span style={{ color: '#F5EDD6', fontSize: 14, fontWeight: 500 }}>{spec.title}</span>
                    <span style={{ color: '#C9A84C', fontSize: 18 }}>{openSpec === i ? '−' : '+'}</span>
                  </button>
                  {openSpec === i && (
                    <div style={{ paddingBottom: 16, color: '#F5EDD6aa', fontSize: 14, lineHeight: 1.7 }}>
                      {spec.value}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

        </div>
      </main>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string
  try {
    const r = await fetch(`${API}/products/slug/${slug}`)
    if (!r.ok) return { notFound: true }
    const product = await r.json()
    return { props: { product } }
  } catch {
    return { notFound: true }
  }
}