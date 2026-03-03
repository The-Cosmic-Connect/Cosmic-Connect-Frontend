import Layout from '@/components/layout/Layout'
import Link from 'next/link'

export default function NotFound() {
  return (
    <Layout title="404 — Page Not Found | The Cosmic Connect">
      <section className="min-h-screen flex items-center justify-center bg-cosmic-gradient">
        <div className="text-center px-4">
          <p className="font-cinzel text-cosmic-gold/30 text-9xl font-bold mb-4">404</p>
          <p className="ornament text-sm tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream mb-4">
            Lost in the Cosmos
          </h1>
          <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8">
            The stars couldn't find this page. Let us guide you back.
          </p>
          <Link href="/" className="btn-primary">
            Return Home
          </Link>
        </div>
      </section>
    </Layout>
  )
}
