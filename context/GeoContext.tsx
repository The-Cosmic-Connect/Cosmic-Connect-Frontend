import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Gateway = 'razorpay' | 'paypal'
export type Currency = 'INR' | 'USD'

interface GeoState {
  country: string        // 'IN', 'US', 'GB' etc.
  currency: Currency
  gateway: Gateway
  symbol: string         // '₹' or '$'
  loading: boolean
  isIndia: boolean
}

const defaultGeo: GeoState = {
  country: 'IN',
  currency: 'INR',
  gateway: 'razorpay',
  symbol: '₹',
  loading: true,
  isIndia: true,
}

const GeoContext = createContext<GeoState>(defaultGeo)

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoState>(defaultGeo)

  useEffect(() => {
    fetch('/api/geo')
      .then(r => r.json())
      .then(data => {
        const isIndia = data.country === 'IN'
        setGeo({
          country: data.country || 'IN',
          currency: isIndia ? 'INR' : 'USD',
          gateway: isIndia ? 'razorpay' : 'paypal',
          symbol: isIndia ? '₹' : '$',
          loading: false,
          isIndia,
        })
      })
      .catch(() => {
        // Default to India on failure
        setGeo({ ...defaultGeo, loading: false })
      })
  }, [])

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>
}

export const useGeo = () => useContext(GeoContext)
