import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  priceINR: number
  priceUSD: number
  image: string
  quantity: number
  collections: string[]
}

type CouponScope = 'all' | 'products' | 'collections'

interface CartState {
  items: CartItem[]
  coupon: string | null
  discountPct: number
  discountINRFixed: number  // fixed INR discount from coupon (e.g. ₹50 off)
  // What the active coupon is restricted to — 'all' (default/legacy coupons)
  // discounts every cart item; 'products'/'collections' restrict the
  // discount to only the matching cart items (see eligibleItems below).
  couponScope: CouponScope
  couponProductIds: string[]
  couponCollections: string[]
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'>; qty?: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | {
      type: 'APPLY_COUPON'; code: string; discountPct: number; discountINRFixed?: number
      scope?: CouponScope; productIds?: string[]; collections?: string[]
    }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const qty = action.qty || 1
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + qty } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: qty }] }
    }
    case 'REMOVE':
      return { ...state, items: state.items.filter(i => i.id !== action.id) }
    case 'UPDATE_QTY':
      if (action.qty <= 0) {
        return { ...state, items: state.items.filter(i => i.id !== action.id) }
      }
      return {
        ...state,
        items: state.items.map(i =>
          i.id === action.id ? { ...i, quantity: action.qty } : i
        ),
      }
    case 'APPLY_COUPON':
      return {
        ...state,
        coupon: action.code,
        discountPct: action.discountPct,
        discountINRFixed: action.discountINRFixed || 0,
        couponScope: action.scope || 'all',
        couponProductIds: action.productIds || [],
        couponCollections: action.collections || [],
      }
    case 'REMOVE_COUPON':
      return {
        ...state, coupon: null, discountPct: 0, discountINRFixed: 0,
        couponScope: 'all', couponProductIds: [], couponCollections: [],
      }
    case 'CLEAR':
      return {
        items: [], coupon: null, discountPct: 0, discountINRFixed: 0,
        couponScope: 'all', couponProductIds: [], couponCollections: [],
      }
    case 'HYDRATE':
      // Older persisted carts (in sessionStorage) predate the coupon-scope
      // fields — TypeScript's CartState type says they're always present,
      // but the actual JSON on disk may not have them, so default each one
      // individually rather than trusting the spread. (Setting the defaults
      // before spreading action.state on top is a no-op per the type and
      // trips TS2783, so it's done this way instead.)
      return {
        ...action.state,
        couponScope: action.state.couponScope ?? 'all',
        couponProductIds: action.state.couponProductIds ?? [],
        couponCollections: action.state.couponCollections ?? [],
      }
    default:
      return state
  }
}

const initialState: CartState = {
  items: [], coupon: null, discountPct: 0, discountINRFixed: 0,
  couponScope: 'all', couponProductIds: [], couponCollections: [],
}

/** Whether a cart line is discountable under the active coupon's scope. */
function isItemCouponEligible(item: CartItem, state: CartState): boolean {
  if (state.couponScope === 'products') return state.couponProductIds.includes(item.id)
  if (state.couponScope === 'collections') {
    return (item.collections || []).some((c) => state.couponCollections.includes(c))
  }
  return true // 'all' — every item qualifies (legacy/unscoped coupon behaviour)
}

interface CartContextValue extends CartState {
  dispatch: React.Dispatch<CartAction>
  // ── Convenience helpers ──
  addToCart: (product: {
    id: string; name: string; priceINR: number; priceUSD: number
    images?: string[]; image?: string; collections?: string[]
    quantity?: number
  }) => void
  removeFromCart: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  // ── Totals ──
  totalItems: number
  subtotalINR: number
  subtotalUSD: number
  discountINR: number
  discountUSD: number
  totalINR: number
  totalUSD: number
  // Number of current cart lines that qualify under the active coupon's
  // scope (informational — for "N of M items qualify" messaging).
  couponEligibleLineCount: number
  // Whether the active coupon is actually discounting the cart right now.
  // A scoped coupon is all-or-nothing: if even one line in the cart falls
  // outside its allowed products/types, this is false and no discount is
  // given — a mixed cart never gets a silently-partial discount.
  couponApplies: boolean
}

const CartContext = createContext<CartContextValue>({
  ...initialState,
  dispatch: () => {},
  addToCart: () => {},
  removeFromCart: () => {},
  updateQty: () => {},
  clearCart: () => {},
  totalItems: 0,
  subtotalINR: 0,
  subtotalUSD: 0,
  discountINR: 0,
  discountUSD: 0,
  totalINR: 0,
  totalUSD: 0,
  couponEligibleLineCount: 0,
  couponApplies: false,
})

const STORAGE_KEY = 'cosmic_cart_v2'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) dispatch({ type: 'HYDRATE', state: JSON.parse(saved) })
    } catch {}
  }, [])

  // Persist on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  // ── Convenience helpers ───────────────────────────────────────────────────
  function addToCart(product: {
    id: string; name: string; priceINR: number; priceUSD: number
    images?: string[]; image?: string; collections?: string[]
    quantity?: number
  }) {
    dispatch({
      type: 'ADD',
      qty: product.quantity || 1,
      item: {
        id:          product.id,
        name:        product.name,
        priceINR:    product.priceINR,
        priceUSD:    product.priceUSD,
        image:       product.image || product.images?.[0] || '',
        collections: product.collections || [],
      },
    })
  }

  function removeFromCart(id: string) {
    dispatch({ type: 'REMOVE', id })
  }

  function updateQty(id: string, qty: number) {
    dispatch({ type: 'UPDATE_QTY', id, qty })
  }

  function clearCart() {
    dispatch({ type: 'CLEAR' })
  }

  // ── Totals ────────────────────────────────────────────────────────────────
  const totalItems   = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotalINR  = state.items.reduce((s, i) => s + i.priceINR * i.quantity, 0)
  const subtotalUSD  = state.items.reduce((s, i) => s + i.priceUSD * i.quantity, 0)

  // A product/product-type-restricted coupon is all-or-nothing: it only
  // discounts the cart when every line in it qualifies. If the cart has a
  // mix of qualifying and non-qualifying items (e.g. the shopper applied
  // the coupon, then added something outside its scope), the coupon stops
  // discounting entirely rather than quietly applying to just part of the
  // cart. This also covers the initial-apply case as a safety net, though
  // the backend already rejects applying a scoped coupon to a mixed cart.
  const eligibleItems           = state.items.filter((i) => isItemCouponEligible(i, state))
  const couponEligibleLineCount = eligibleItems.length
  const couponApplies = !!state.coupon && (
    state.couponScope === 'all' ||
    (state.items.length > 0 && eligibleItems.length === state.items.length)
  )

  // Coupon discount — either fixed INR amount or percentage, applied
  // against the whole cart subtotal, but only while couponApplies is true.
  const discountINR  = !couponApplies ? 0 : state.discountINRFixed > 0
    ? Math.min(state.discountINRFixed, subtotalINR)
    : Math.round((subtotalINR * state.discountPct) / 100)
  const discountUSD  = !couponApplies ? 0 : state.discountINRFixed > 0
    ? parseFloat(Math.min(state.discountINRFixed / 83, subtotalUSD).toFixed(2))
    : parseFloat(((subtotalUSD * state.discountPct) / 100).toFixed(2))

  const totalINR = Math.max(0, subtotalINR - discountINR)
  const totalUSD = Math.max(0, parseFloat((subtotalUSD - discountUSD).toFixed(2)))

  return (
    <CartContext.Provider value={{
      ...state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      totalItems,
      subtotalINR,
      subtotalUSD,
      discountINR,
      discountUSD,
      totalINR,
      totalUSD,
      couponEligibleLineCount,
      couponApplies,
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)