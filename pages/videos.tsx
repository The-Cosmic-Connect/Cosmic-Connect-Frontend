import Layout from '@/components/layout/Layout'

export default function Page() {
  return (
    <Layout title="The Cosmic Connect">
      <section className="min-h-screen flex items-center justify-center bg-cosmic-gradient pt-24">
        <div className="text-center px-4">
          <p className="ornament text-sm tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel text-3xl md:text-5xl text-cosmic-cream mb-4 capitalize">Coming Soon</h1>
          <p className="font-cormorant text-cosmic-cream/60 text-xl italic">
            This page is being built in an upcoming phase
          </p>
        </div>
      </section>
    </Layout>
  )
}
