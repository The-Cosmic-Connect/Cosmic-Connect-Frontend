import type { AppProps } from 'next/app'
import { GeoProvider } from '@/context/GeoContext'
import { CartProvider } from '@/context/CartContext'
import { Analytics } from "@vercel/analytics/next"
import '@/styles/globals.css'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GeoProvider>
      <CartProvider>
        <Component {...pageProps} />
      </CartProvider>
      <Analytics />
    </GeoProvider>
  )
}
