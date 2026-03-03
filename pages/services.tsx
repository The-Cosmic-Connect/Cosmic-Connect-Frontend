import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CalendlyPopup from '@/components/ui/CalendlyPopup'
import { services } from '@/lib/servicesData'

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(28px)',
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

export default function ServicesPage() {
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  return (
    <>
      <Layout
        title="Spiritual Services | Dr. Usha Bhatt | The Cosmic Connect"
        description="Explore all spiritual services offered by Dr. Usha Bhatt — Tarot Reading, Akashic Records, Healing Sessions, Past Life Healing, Black Magic Removal and Psychic Readings."
        canonical="/services"
      >
        {/* Hero */}
        <section className="relative pt-36 pb-20 px-4 bg-cosmic-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,44,138,0.25), transparent 70%)' }}
          />
          <div className="container-cosmic text-center relative z-10">
            <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
            <h1 className="font-cinzel font-bold text-cosmic-cream mb-4"
              style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
              Our <span className="text-gold-shimmer">Services</span>
            </h1>
            <p className="font-cormorant text-cosmic-cream/60 text-xl italic max-w-xl mx-auto leading-relaxed">
              Explore the depths of your existence and unlock new paths to self-discovery
              with Dr. Usha Bhatt
            </p>
          </div>
        </section>

        {/* Services grid */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service, i) => (
                <Reveal key={service.slug} delay={i * 0.08}>
                  <Link
                    href={`/services/${service.slug}`}
                    className="cosmic-card p-7 flex flex-col group h-full"
                  >
                    {/* Accent top bar */}
                    <div
                      className="h-0.5 w-12 mb-5 transition-all duration-300 group-hover:w-full"
                      style={{ background: service.accentColor }}
                    />

                    <span className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300 block">
                      {service.icon}
                    </span>

                    <h2 className="font-cinzel text-cosmic-cream font-semibold text-base mb-3 group-hover:text-cosmic-gold transition-colors">
                      {service.title}
                    </h2>

                    <p className="font-cormorant text-cosmic-cream/55 text-base italic leading-relaxed mb-4 flex-grow">
                      {service.tagline}
                    </p>

                    <div className="flex items-center gap-2 font-raleway text-xs text-cosmic-gold/60 tracking-widest uppercase group-hover:text-cosmic-gold transition-colors mt-auto">
                      Learn More
                      <span className="group-hover:translate-x-1 transition-transform">→</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Book CTA */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic text-center">
            <Reveal>
              <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
              <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                Not Sure Which Service Is <span className="text-gradient-gold">Right For You?</span>
              </h2>
              <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8 max-w-xl mx-auto">
                Book a discovery session and Dr. Usha Bhatt will guide you to exactly
                what your soul needs right now.
              </p>
              <button onClick={() => setCalendlyOpen(true)} className="btn-primary">
                <Sparkles size={15} />
                Book a Discovery Session
              </button>
            </Reveal>
          </div>
        </section>
      </Layout>

      <CalendlyPopup isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  )
}