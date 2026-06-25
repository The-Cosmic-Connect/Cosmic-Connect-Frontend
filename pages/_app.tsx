import { useEffect } from 'react'
import { useRouter } from 'next/router'
import type { AppProps } from 'next/app'
import { GeoProvider } from '@/context/GeoContext'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { prefetchProductsInBackground } from '@/lib/fetchProducts'
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

  // Background-warm the product catalog so the user almost never sees a
  // loading state on shop pages. Fires once after the page becomes interactive
  // — doesn't block the current page render, doesn't burn CPU during paint.
  // If the cache is already fresh this is a cheap no-op.
  useEffect(() => {
    const idle = (cb: () => void) =>
      (window as any).requestIdleCallback
        ? (window as any).requestIdleCallback(cb, { timeout: 2000 })
        : window.setTimeout(cb, 800)
    const handle = idle(() => prefetchProductsInBackground())
    return () => {
      if ((window as any).cancelIdleCallback) (window as any).cancelIdleCallback(handle)
      else clearTimeout(handle)
    }
  }, [])

  return (
    <ThemeProvider>
      <GeoProvider>
        <CartProvider>
          <Component {...pageProps} />
        </CartProvider>
        <SpeedInsights />
        <Analytics />
      </GeoProvider>
    </ThemeProvider>
  )
}