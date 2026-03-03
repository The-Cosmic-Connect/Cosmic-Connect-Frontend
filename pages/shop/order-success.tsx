import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { CheckCircle, ArrowRight, Loader, XCircle } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useCart } from '@/context/CartContext'

type Status = 'verifying' | 'success' | 'failed' | 'unknown'

export default function OrderSuccessPage() {
  const router = useRouter()
  const { dispatch } = useCart()
  const { orderId, gateway } = router.query

  const [status, setStatus] = useState<Status>('verifying')

  useEffect(() => {
    if (!orderId || !gateway) return

    // PhonePe requires server-side status check to confirm payment
    if (gateway === 'phonepe') {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

      // Poll up to 5 times with 2s delay — PhonePe can take a moment to update
      let attempts = 0
      const check = async () => {
        try {
          const r = await fetch(`${backendUrl}/orders/phonepe/status/${orderId}`)
          const data = await r.json()

          if (data.state === 'COMPLETED') {
            setStatus('success')
            dispatch({ type: 'CLEAR' })
          } else if (data.state === 'FAILED' || data.state === 'CANCELLED') {
            setStatus('failed')
          } else if (attempts < 5) {
            attempts++
            setTimeout(check, 2000)
          } else {
            // After 5 attempts still pending — show unknown, don't fail the customer
            setStatus('unknown')
            dispatch({ type: 'CLEAR' })
          }
        } catch {
          setStatus('unknown')
          dispatch({ type: 'CLEAR' })
        }
      }
      check()
    } else {
      // PayPal — captured server-side before redirect, trust the redirect
      setStatus('success')
      dispatch({ type: 'CLEAR' })
    }
  }, [orderId, gateway, dispatch])

  return (
    <Layout title="Order Confirmation | The Cosmic Connect" canonical="/shop/order-success">
      <section className="min-h-screen bg-cosmic-gradient flex items-center justify-center px-4 pt-24 pb-16">
        <div className="text-center max-w-lg w-full">

          {/* Verifying state */}
          {status === 'verifying' && (
            <>
              <div className="w-20 h-20 rounded-full border border-cosmic-gold/30 flex items-center justify-center mx-auto mb-8">
                <Loader size={36} className="text-cosmic-gold animate-spin" />
              </div>
              <h1 className="font-cinzel text-2xl font-bold text-cosmic-cream mb-3">
                Confirming Payment...
              </h1>
              <p className="font-cormorant text-cosmic-cream/50 text-lg italic">
                Please wait while we verify your payment with PhonePe.
              </p>
            </>
          )}

          {/* Success state */}
          {(status === 'success' || status === 'unknown') && (
            <>
              <div className="relative inline-block mb-8">
                <div
                  className="w-24 h-24 rounded-full border-2 border-cosmic-gold/40 flex items-center justify-center mx-auto"
                  style={{ boxShadow: '0 0 40px rgba(201,168,76,0.2)' }}
                >
                  <CheckCircle size={48} className="text-cosmic-gold" />
                </div>
                <div className="absolute inset-0 rounded-full border border-cosmic-gold/20 animate-ping" />
              </div>

              <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
              <h1 className="font-cinzel text-3xl font-bold text-cosmic-cream mb-3">
                Order <span className="text-gradient-gold">Confirmed!</span>
              </h1>
              <p className="font-cormorant text-cosmic-cream/60 text-xl italic leading-relaxed mb-6">
                Thank you for your order. Your healing crystals are being prepared
                with love and Reiki energy.
              </p>

              {orderId && (
                <div className="cosmic-card p-4 mb-6 inline-block">
                  <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-1">
                    Order ID
                  </p>
                  <p className="font-cinzel text-cosmic-gold text-sm font-bold">
                    {String(orderId)}
                  </p>
                  <p className="font-raleway text-cosmic-cream/30 text-xs mt-1 capitalize">
                    via {gateway}
                  </p>
                </div>
              )}

              {status === 'unknown' && (
                <p className="font-cormorant text-cosmic-cream/40 text-sm italic mb-4">
                  If payment was deducted, your order is confirmed. You will receive
                  a confirmation email shortly. Contact us if you have any concerns.
                </p>
              )}

              <p className="font-cormorant text-cosmic-cream/50 text-base mb-8">
                A confirmation email has been sent to your inbox with order details.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop" className="btn-primary">
                  Continue Shopping
                  <ArrowRight size={14} />
                </Link>
                <Link href="/" className="btn-outline">Back to Home</Link>
              </div>
            </>
          )}

          {/* Failed state */}
          {status === 'failed' && (
            <>
              <div className="w-24 h-24 rounded-full border-2 border-red-500/40 flex items-center justify-center mx-auto mb-8">
                <XCircle size={48} className="text-red-400" />
              </div>
              <h1 className="font-cinzel text-3xl font-bold text-cosmic-cream mb-3">
                Payment <span className="text-red-400">Failed</span>
              </h1>
              <p className="font-cormorant text-cosmic-cream/60 text-xl italic leading-relaxed mb-8">
                Your payment was not completed. No amount has been charged.
                Please try again or contact us if you need help.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/shop/checkout" className="btn-primary">Try Again</Link>
                <a
                  href="https://wa.me/919599474758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  WhatsApp Support
                </a>
              </div>
            </>
          )}

        </div>
      </section>
    </Layout>
  )
}
