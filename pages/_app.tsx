import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { GeoProvider } from '@/context/GeoContext'
import { CartProvider } from '@/context/CartContext'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

const GA_ID = 'G-HXFKKJN8X6'

declare global {
  interface Window { gtag: (...args: any[]) => void }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // Track page views on route change
  useEffect(() => {
    function handleRouteChange(url: string) {
      if (typeof window.gtag !== 'undefined') {
        window.gtag('config', GA_ID, { page_path: url })
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

  return (
    <GeoProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
      <SpeedInsights />
      <Analytics />
    </GeoProvider>
  )
}