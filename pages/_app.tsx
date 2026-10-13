import type { AppProps } from 'next/app'
import { GeoProvider } from '@/context/GeoContext'
import { CartProvider } from '@/context/CartContext'
import { ThemeProvider } from '@/context/ThemeContext'
import { AuthProvider } from '@/context/AuthContext'
import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import '@/styles/globals.css'

declare global {
  interface Window { gtag: (...args: any[]) => void }
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider>
      <GeoProvider>
        <AuthProvider>
          <CartProvider>
            <Component {...pageProps} />
          </CartProvider>
        </AuthProvider>
        <SpeedInsights />
        <Analytics />
      </GeoProvider>
    </ThemeProvider>
  )
}