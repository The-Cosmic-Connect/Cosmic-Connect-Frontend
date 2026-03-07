import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Gateway = 'phonepe' | 'paypal'
export type Currency = 'INR' | 'USD'

interface GeoState {
  country:  string    // 'IN', 'US', 'GB' etc.
  currency: Currency
  gateway:  Gateway
  symbol:   string    // '₹' or '$'
  loading:  boolean
  isIndia:  boolean
}

const defaultGeo: GeoState = {
  country:  'IN',
  currency: 'INR',
  gateway:  'phonepe',
  symbol:   '₹',
  loading:  true,
  isIndia:  true,
}

const GeoContext = createContext<GeoState>(defaultGeo)

export function GeoProvider({ children }: { children: ReactNode }) {
  const [geo, setGeo] = useState<GeoState>(defaultGeo)

  useEffect(() => {
    // Try /api/geo first (Next.js API route), fall back to ipapi.co
    fetch('/api/geo')
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => applyGeo(data.country || 'IN'))
      .catch(() => {
        // Fallback: detect via public IP API
        fetch('https://ipapi.co/json/')
          .then(r => r.json())
          .then(data => applyGeo(data.country_code || 'IN'))
          .catch(() => applyGeo('IN'))
      })
  }, [])

  function applyGeo(country: string) {
    const isIndia = country === 'IN'
    setGeo({
      country,
      currency: isIndia ? 'INR' : 'USD',
      gateway:  isIndia ? 'phonepe' : 'paypal',
      symbol:   isIndia ? '₹' : '$',
      loading:  false,
      isIndia,
    })
  }

  return <GeoContext.Provider value={geo}>{children}</GeoContext.Provider>
}

export const useGeo = () => useContext(GeoContext)