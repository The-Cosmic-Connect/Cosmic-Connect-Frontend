import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  priceINR: number
  priceUSD: number
  image: string
  quantity: number
  category: string
}

interface CartState {
  items: CartItem[]
  coupon: string | null
  discountPct: number    // e.g. 10 = 10% off
}

type CartAction =
  | { type: 'ADD'; item: Omit<CartItem, 'quantity'> }
  | { type: 'REMOVE'; id: string }
  | { type: 'UPDATE_QTY'; id: string; qty: number }
  | { type: 'APPLY_COUPON'; code: string; discountPct: number }
  | { type: 'REMOVE_COUPON' }
  | { type: 'CLEAR' }
  | { type: 'HYDRATE'; state: CartState }

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD': {
      const existing = state.items.find(i => i.id === action.item.id)
      if (existing) {
        return {
          ...state,
          items: state.items.map(i =>
            i.id === action.item.id ? { ...i, quantity: i.quantity + 1 } : i
          ),
        }
      }
      return { ...state, items: [...state.items, { ...action.item, quantity: 1 }] }
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
      return { ...state, coupon: action.code, discountPct: action.discountPct }
    case 'REMOVE_COUPON':
      return { ...state, coupon: null, discountPct: 0 }
    case 'CLEAR':
      return { items: [], coupon: null, discountPct: 0 }
    case 'HYDRATE':
      return action.state
    default:
      return state
  }
}

const initialState: CartState = { items: [], coupon: null, discountPct: 0 }

interface CartContextValue extends CartState {
  dispatch: React.Dispatch<CartAction>
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
  totalItems: 0,
  subtotalINR: 0,
  subtotalUSD: 0,
  discountINR: 0,
  discountUSD: 0,
  totalINR: 0,
  totalUSD: 0,
})

const STORAGE_KEY = 'cosmic_cart'

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)

  // Hydrate from sessionStorage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY)
      if (saved) {
        dispatch({ type: 'HYDRATE', state: JSON.parse(saved) })
      }
    } catch {}
  }, [])

  // Persist to sessionStorage on change
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {}
  }, [state])

  const totalItems = state.items.reduce((s, i) => s + i.quantity, 0)
  const subtotalINR = state.items.reduce((s, i) => s + i.priceINR * i.quantity, 0)
  const subtotalUSD = state.items.reduce((s, i) => s + i.priceUSD * i.quantity, 0)
  const discountINR = Math.round((subtotalINR * state.discountPct) / 100)
  const discountUSD = parseFloat(((subtotalUSD * state.discountPct) / 100).toFixed(2))
  const totalINR = subtotalINR - discountINR
  const totalUSD = parseFloat((subtotalUSD - discountUSD).toFixed(2))

  return (
    <CartContext.Provider
      value={{
        ...state,
        dispatch,
        totalItems,
        subtotalINR,
        subtotalUSD,
        discountINR,
        discountUSD,
        totalINR,
        totalUSD,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
