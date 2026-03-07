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

interface CartState {
  items: CartItem[]
  coupon: string | null
  discountPct: number
  discountINRFixed: number  // fixed INR discount from coupon (e.g. ₹50 off)
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'>; qty?: number }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'APPLY_COUPON'; code: string; discountPct: number; discountINRFixed?: number }
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
      }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discountPct: 0, discountINRFixed: 0 }
    case 'CLEAR':
      return { items: [], coupon: null, discountPct: 0, discountINRFixed: 0 }
    case 'HYDRATE':
      return action.state
    default:
      return state
  }
}

const initialState: CartState = {
  items: [], coupon: null, discountPct: 0, discountINRFixed: 0,
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

  // Coupon discount — either fixed INR amount or percentage
  const discountINR  = state.discountINRFixed > 0
    ? state.discountINRFixed
    : Math.round((subtotalINR * state.discountPct) / 100)
  const discountUSD  = state.discountINRFixed > 0
    ? parseFloat((state.discountINRFixed / 83).toFixed(2))
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
    }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)