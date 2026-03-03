import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Lock, CreditCard, Globe } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'

interface CustomerForm {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
  country: string
}

const emptyForm: CustomerForm = {
  name: '', email: '', phone: '', address: '',
  city: '', state: '', pincode: '', country: '',
}

export default function CheckoutPage() {
  const router = useRouter()
  const {
    items, totalINR, totalUSD, discountPct, coupon,
    subtotalINR, subtotalUSD, discountINR, discountUSD, dispatch,
  } = useCart()
  const { isIndia, symbol, currency, loading: geoLoading } = useGeo()

  const [form, setForm] = useState<CustomerForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<CustomerForm>>({})
  const [processing, setProcessing] = useState(false)

  // Redirect if cart empty
  useEffect(() => {
    if (!geoLoading && items.length === 0) router.replace('/shop')
  }, [items, geoLoading, router])

  function validate(): boolean {
    const e: Partial<CustomerForm> = {}
    if (!form.name.trim()) e.name = 'Required'
    if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = 'Valid email required'
    if (isIndia && !form.phone.match(/^[6-9]\d{9}$/)) e.phone = 'Valid 10-digit mobile required'
    if (!form.address.trim()) e.address = 'Required'
    if (!form.city.trim()) e.city = 'Required'
    if (isIndia && !form.pincode.match(/^\d{6}$/)) e.pincode = '6-digit pincode required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function field(label: string, key: keyof CustomerForm, type = 'text', placeholder = '') {
    const required = ['name', 'email', 'address', 'city'].includes(key)
    return (
      <div>
        <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
          {label} {required && <span className="text-cosmic-gold">*</span>}
        </label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key]}
          onChange={e => {
            setForm(f => ({ ...f, [key]: e.target.value }))
            setErrors(er => ({ ...er, [key]: undefined }))
          }}
          className={`w-full bg-cosmic-black/30 border ${
            errors[key] ? 'border-red-500' : 'border-cosmic-gold/20'
          } px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors`}
        />
        {errors[key] && (
          <p className="font-raleway text-red-400 text-xs mt-1">{errors[key]}</p>
        )}
      </div>
    )
  }

  // ── PhonePe redirect flow ──────────────────────────────────────────────────
  async function handlePhonePe() {
    setProcessing(true)
    try {
      const shippingINR = totalINR >= 1999 ? 0 : 99
      const grandTotalINR = totalINR + shippingINR

      const r = await fetch('/api/create-phonepe-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountINR: grandTotalINR,
          items,
          coupon,
          customerEmail: form.email,
          customerName: form.name,
          customerPhone: form.phone,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'PhonePe initiation failed')

      // PhonePe returns a redirect URL — send customer there
      if (data.redirectUrl) {
        // Save form details to sessionStorage so we can show them on success page
        sessionStorage.setItem('cosmic_checkout_form', JSON.stringify(form))
        window.location.href = data.redirectUrl
      } else {
        throw new Error('No redirect URL returned from PhonePe')
      }
    } catch (err: any) {
      alert(`Payment error: ${err.message}`)
      setProcessing(false)
    }
  }

  // ── PayPal redirect flow ───────────────────────────────────────────────────
  async function handlePayPal() {
    setProcessing(true)
    try {
      const r = await fetch('/api/create-paypal-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountUSD: totalUSD,
          items,
          coupon,
          customerEmail: form.email,
        }),
      })
      const data = await r.json()
      if (!r.ok) throw new Error(data.error || 'PayPal order creation failed')
      if (data.approveUrl) window.location.href = data.approveUrl
    } catch (err: any) {
      alert(`PayPal error: ${err.message}`)
      setProcessing(false)
    }
  }

  function handlePay() {
    if (!validate()) return
    if (isIndia) handlePhonePe()
    else handlePayPal()
  }

  const shippingINR = isIndia && totalINR < 1999 ? 99 : 0
  const grandTotal = isIndia ? totalINR + shippingINR : totalUSD

  if (geoLoading || items.length === 0) {
    return (
      <Layout title="Checkout | The Cosmic Connect">
        <div className="min-h-screen bg-cosmic-gradient flex items-center justify-center pt-24">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="font-cormorant text-cosmic-cream/60 italic">Loading checkout...</p>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="Checkout | The Cosmic Connect" canonical="/shop/checkout">
      <section className="min-h-screen bg-cosmic-section pt-28 pb-16 px-4">
        <div className="container-cosmic max-w-5xl">

          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Link href="/shop" className="text-cosmic-cream/40 hover:text-cosmic-gold transition-colors">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-cinzel text-cosmic-cream text-2xl font-bold">Checkout</h1>
            <div className="flex items-center gap-2 ml-auto text-cosmic-cream/40">
              <Lock size={13} />
              <span className="font-raleway text-xs tracking-widest">Secure Checkout</span>
            </div>
          </div>

          <div className="grid lg:grid-cols-5 gap-8">

            {/* Left — form */}
            <div className="lg:col-span-3 space-y-6">

              {/* Delivery details */}
              <div className="cosmic-card p-6">
                <h2 className="font-cinzel text-cosmic-cream text-base font-semibold mb-5 pb-3 border-b border-cosmic-gold/15">
                  Delivery Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">{field('Full Name', 'name')}</div>
                  {field('Email Address', 'email', 'email')}
                  {field('Phone Number', 'phone', 'tel', isIndia ? '10-digit mobile' : '+1 234 567 8900')}
                  <div className="sm:col-span-2">{field('Address', 'address', 'text', 'House / Flat / Street')}</div>
                  {field('City', 'city')}
                  {field('State / Province', 'state')}
                  {field(isIndia ? 'Pincode' : 'ZIP / Postal Code', 'pincode', 'text', isIndia ? '110001' : '10001')}
                  {!isIndia && field('Country', 'country', 'text', 'United States')}
                </div>
              </div>

              {/* Payment method info */}
              <div className="cosmic-card p-6">
                <h2 className="font-cinzel text-cosmic-cream text-base font-semibold mb-4 pb-3 border-b border-cosmic-gold/15">
                  Payment Method
                </h2>

                {isIndia ? (
                  <div className="flex items-start gap-4">
                    {/* PhonePe purple logo colour */}
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 rounded"
                      style={{ background: '#5F259F' }}>
                      <span className="text-white font-bold text-sm">Pe</span>
                    </div>
                    <div>
                      <p className="font-cinzel text-cosmic-cream text-sm font-semibold mb-1">PhonePe</p>
                      <p className="font-cormorant text-cosmic-cream/55 text-sm leading-relaxed">
                        Pay securely via PhonePe, UPI, credit / debit card, or netbanking.
                        You will be redirected to PhonePe to complete your payment and
                        automatically returned here once done.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-cosmic-gold/10 border border-cosmic-gold/20 flex items-center justify-center shrink-0">
                      <Globe size={18} className="text-cosmic-gold" />
                    </div>
                    <div>
                      <p className="font-cinzel text-cosmic-cream text-sm font-semibold mb-1">PayPal</p>
                      <p className="font-cormorant text-cosmic-cream/55 text-sm leading-relaxed">
                        Pay securely via PayPal or credit / debit card. You will be redirected
                        to PayPal to complete your payment in USD.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right — order summary */}
            <div className="lg:col-span-2">
              <div className="cosmic-card p-6 sticky top-24">
                <h2 className="font-cinzel text-cosmic-cream text-base font-semibold mb-5 pb-3 border-b border-cosmic-gold/15">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-5">
                  {items.map(item => (
                    <div key={item.id} className="flex gap-3 items-center">
                      <div className="relative w-12 h-12 rounded-sm overflow-hidden shrink-0 border border-cosmic-gold/15">
                        {item.image && !item.image.includes('placeholder') ? (
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-cosmic-black/30 text-xl">
                            💎
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-cinzel text-cosmic-cream text-xs font-medium line-clamp-1">
                          {item.name}
                        </p>
                        <p className="font-raleway text-cosmic-cream/40 text-xs">× {item.quantity}</p>
                      </div>
                      <p className="font-cinzel text-cosmic-cream text-xs shrink-0">
                        {symbol}
                        {isIndia
                          ? (item.priceINR * item.quantity).toLocaleString('en-IN')
                          : (item.priceUSD * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="space-y-2 text-sm border-t border-cosmic-gold/10 pt-4">
                  <div className="flex justify-between">
                    <span className="font-cormorant text-cosmic-cream/60">Subtotal</span>
                    <span className="font-cinzel text-cosmic-cream text-xs">
                      {symbol}
                      {isIndia ? subtotalINR.toLocaleString('en-IN') : subtotalUSD.toFixed(2)}
                    </span>
                  </div>
                  {discountPct > 0 && (
                    <div className="flex justify-between">
                      <span className="font-cormorant text-green-400/80">Discount ({coupon})</span>
                      <span className="font-cinzel text-green-400 text-xs">
                        -{symbol}
                        {isIndia ? discountINR.toLocaleString('en-IN') : discountUSD.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {isIndia && (
                    <div className="flex justify-between">
                      <span className="font-cormorant text-cosmic-cream/60">Shipping</span>
                      <span className={`font-cinzel text-xs ${shippingINR === 0 ? 'text-green-400' : 'text-cosmic-cream'}`}>
                        {shippingINR === 0 ? 'FREE' : '₹99'}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-2 border-t border-cosmic-gold/15">
                    <span className="font-cinzel text-cosmic-cream font-semibold">
                      Total ({currency})
                    </span>
                    <span className="font-cinzel text-cosmic-gold font-bold text-base">
                      {symbol}
                      {isIndia
                        ? grandTotal.toLocaleString('en-IN')
                        : (grandTotal as number).toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Pay button */}
                <button
                  onClick={handlePay}
                  disabled={processing}
                  className="btn-primary w-full justify-center mt-6 disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {processing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cosmic-black border-t-transparent rounded-full animate-spin" />
                      Redirecting...
                    </>
                  ) : (
                    <>
                      <Lock size={14} />
                      Pay {symbol}
                      {isIndia
                        ? grandTotal.toLocaleString('en-IN')
                        : (grandTotal as number).toFixed(2)}{' '}
                      via {isIndia ? 'PhonePe' : 'PayPal'}
                    </>
                  )}
                </button>

                <p className="font-raleway text-cosmic-cream/25 text-xs text-center mt-3 leading-relaxed">
                  By placing an order you agree to our{' '}
                  <Link href="/terms" className="underline hover:text-cosmic-gold/50 transition-colors">
                    Terms
                  </Link>{' '}
                  &amp;{' '}
                  <Link href="/privacy" className="underline hover:text-cosmic-gold/50 transition-colors">
                    Privacy Policy
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  )
}
