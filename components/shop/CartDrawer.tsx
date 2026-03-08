import { X, Trash2, Plus, Minus, ShoppingBag, Tag } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { useGeo } from '@/context/GeoContext'

interface Props {
  isOpen: boolean
  onClose: () => void
}

export default function CartDrawer({ isOpen, onClose }: Props) {
  const {
    items, dispatch, removeFromCart, updateQty,
    totalItems, subtotalINR, subtotalUSD,
    discountINR, discountUSD, totalINR, totalUSD,
    coupon, discountPct,
  } = useCart()
  const { symbol, isIndia } = useGeo()
  const [couponInput,  setCouponInput]  = useState('')
  const [couponStatus, setCouponStatus] = useState<'idle' | 'loading' | 'ok' | 'error'>('idle')
  const [couponMsg,    setCouponMsg]    = useState('')

  const subtotal = isIndia ? subtotalINR : subtotalUSD
  const discount = isIndia ? discountINR : discountUSD
  const total    = isIndia ? totalINR    : totalUSD

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponStatus('loading')
    try {
      const r = await fetch('/api/validate-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput }),
      })
      const data = await r.json()
      if (r.ok && data.discountPct) {
        dispatch({ type: 'APPLY_COUPON', code: data.code, discountPct: data.discountPct })
        setCouponStatus('ok')
        setCouponMsg(`${data.discountPct}% discount applied!`)
      } else {
        setCouponStatus('error')
        setCouponMsg(data.error || 'Invalid coupon code')
      }
    } catch {
      setCouponStatus('error')
      setCouponMsg('Could not validate coupon')
    }
  }

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-cosmic-black/70 backdrop-blur-sm z-[90]" onClick={onClose} />
      )}

      <div
        className="fixed top-0 right-0 h-full w-full max-w-md bg-cosmic-deepPurple border-l border-cosmic-gold/20 z-[95] flex flex-col"
        style={{
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-cosmic-gold/15">
          <div className="flex items-center gap-3">
            <ShoppingBag size={18} className="text-cosmic-gold" />
            <span className="font-cinzel text-cosmic-cream font-semibold tracking-wide">Your Cart</span>
            {totalItems > 0 && (
              <span className="bg-cosmic-gold text-cosmic-black text-xs font-bold font-raleway rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </div>
          <button onClick={onClose} className="text-cosmic-cream/50 hover:text-cosmic-gold transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingBag size={48} className="text-cosmic-gold/20 mb-4" />
              <p className="font-cinzel text-cosmic-cream/40 text-sm">Your cart is empty</p>
              <p className="font-cormorant text-cosmic-cream/30 text-base italic mt-1">Add some healing crystals to begin</p>
              <button onClick={onClose} className="btn-outline mt-6 text-xs">Continue Shopping</button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-cosmic-gold/10">
                <div className="w-16 h-16 rounded-sm overflow-hidden shrink-0 border border-cosmic-gold/20 bg-cosmic-black/30">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-2xl">💎</div>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-cinzel text-cosmic-cream text-xs font-semibold line-clamp-2 mb-1 leading-snug">{item.name}</p>
                  <p className="font-cinzel text-cosmic-gold text-sm font-bold">
                    {symbol}{isIndia
                      ? (item.priceINR * item.quantity).toLocaleString('en-IN')
                      : (item.priceUSD * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <button onClick={() => removeFromCart(item.id)} className="text-cosmic-cream/30 hover:text-red-400 transition-colors">
                    <Trash2 size={13} />
                  </button>
                  <div className="flex items-center gap-1 border border-cosmic-gold/20">
                    <button onClick={() => updateQty(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-cosmic-cream/60 hover:text-cosmic-gold transition-colors">
                      <Minus size={10} />
                    </button>
                    <span className="font-raleway text-xs text-cosmic-cream w-5 text-center">{item.quantity}</span>
                    <button onClick={() => updateQty(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-cosmic-cream/60 hover:text-cosmic-gold transition-colors">
                      <Plus size={10} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="px-6 py-5 border-t border-cosmic-gold/15 space-y-4">
            {!coupon ? (
              <div className="flex gap-2">
                <div className="flex-1 flex items-center gap-2 border border-cosmic-gold/20 px-3">
                  <Tag size={13} className="text-cosmic-cream/30 shrink-0" />
                  <input
                    type="text"
                    placeholder="Coupon code"
                    value={couponInput}
                    onChange={e => { setCouponInput(e.target.value); setCouponStatus('idle') }}
                    onKeyDown={e => e.key === 'Enter' && applyCoupon()}
                    className="bg-transparent font-raleway text-xs text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-2.5 w-full tracking-widest uppercase"
                  />
                </div>
                <button
                  onClick={applyCoupon}
                  disabled={couponStatus === 'loading'}
                  className="font-raleway text-xs tracking-widest uppercase border border-cosmic-gold/40 text-cosmic-gold px-4 hover:bg-cosmic-gold/10 transition-colors disabled:opacity-50"
                >
                  {couponStatus === 'loading' ? '...' : 'Apply'}
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag size={13} className="text-cosmic-gold" />
                  <span className="font-raleway text-xs text-cosmic-gold tracking-widest uppercase font-semibold">
                    {coupon} — {discountPct}% off
                  </span>
                </div>
                <button onClick={() => dispatch({ type: 'REMOVE_COUPON' })} className="text-cosmic-cream/30 hover:text-red-400 transition-colors">
                  <X size={13} />
                </button>
              </div>
            )}

            {couponStatus !== 'idle' && couponMsg && (
              <p className={`font-raleway text-xs ${couponStatus === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{couponMsg}</p>
            )}

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="font-cormorant text-cosmic-cream/60">Subtotal</span>
                <span className="font-cinzel text-cosmic-cream text-xs">{symbol}{isIndia ? subtotal.toLocaleString('en-IN') : subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between">
                  <span className="font-cormorant text-green-400/80">Discount</span>
                  <span className="font-cinzel text-green-400 text-xs">-{symbol}{isIndia ? discount.toLocaleString('en-IN') : discount.toFixed(2)}</span>
                </div>
              )}
              {isIndia && (
                <div className="flex justify-between">
                  <span className="font-cormorant text-cosmic-cream/40 text-xs">Shipping</span>
                  <span className="font-raleway text-cosmic-cream/40 text-xs">{totalINR >= 1999 ? 'FREE' : '₹99'}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-cosmic-gold/15">
                <span className="font-cinzel text-cosmic-cream font-semibold text-sm">Total</span>
                <span className="font-cinzel text-cosmic-gold font-bold">{symbol}{isIndia ? total.toLocaleString('en-IN') : total.toFixed(2)}</span>
              </div>
            </div>

            <Link href="/shop/checkout" onClick={onClose} className="btn-primary w-full justify-center text-sm">
              Proceed to Checkout
            </Link>

            {isIndia && totalINR < 1999 && (
              <p className="font-cormorant text-cosmic-cream/30 text-xs italic text-center">
                Add {symbol}{(1999 - totalINR).toLocaleString('en-IN')} more for free shipping
              </p>
            )}
          </div>
        )}
      </div>
    </>
  )
}