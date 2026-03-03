import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { CheckCircle, Users, Clock, ChevronDown, ChevronUp, ArrowLeft, Sparkles } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CalendlyPopup from '@/components/ui/CalendlyPopup'
import { ServiceData, services } from '@/lib/servicesData'

// ── Scroll-reveal wrapper ─────────────────────────────────────────────────────
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

// ── FAQ accordion item ────────────────────────────────────────────────────────
function FAQItem({ q, a, index }: { q: string; a: string; index: number }) {
  const [open, setOpen] = useState(false)
  return (
    <Reveal delay={index * 0.08}>
      <div className="border border-cosmic-gold/15 hover:border-cosmic-gold/35 transition-colors duration-300">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
        >
          <span className="font-cinzel text-sm text-cosmic-cream font-medium leading-snug">{q}</span>
          <span className="text-cosmic-gold shrink-0">
            {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </span>
        </button>
        {open && (
          <div className="px-6 pb-5 border-t border-cosmic-gold/10">
            <p className="font-cormorant text-cosmic-cream/65 text-base leading-relaxed mt-3">{a}</p>
          </div>
        )}
      </div>
    </Reveal>
  )
}

// ── Main template ─────────────────────────────────────────────────────────────
export default function ServicePageTemplate({ service }: { service: ServiceData }) {
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  // Other services for the "You may also like" section
  const otherServices = services.filter(s => s.slug !== service.slug).slice(0, 3)

  return (
    <>
      <Layout
        title={service.seoTitle}
        description={service.seoDesc}
        canonical={`/services/${service.slug}`}
      >
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(service.schema) }}
        />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[70vh] flex items-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, #0A0708 0%, ${service.accentColor}22 50%, #0A0708 100%)`,
          }}
        >
          {/* Decorative rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none">
            {[400, 300, 200].map((size, i) => (
              <div
                key={size}
                className="absolute rounded-full border"
                style={{
                  width: size,
                  height: size,
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%,-50%)',
                  borderColor: `${service.accentColor}${20 + i * 15}`,
                  animation: `float ${6 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          {/* Glow */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse 60% 50% at 70% 50%, ${service.accentColor}20, transparent 70%)`,
            }}
          />

          <div className="container-cosmic relative z-10 pt-28 pb-16">
            {/* Back link */}
            <Link
              href="/services"
              className="inline-flex items-center gap-2 text-cosmic-cream/40 hover:text-cosmic-gold transition-colors font-raleway text-xs tracking-widest uppercase mb-8"
            >
              <ArrowLeft size={14} /> All Services
            </Link>

            <div className="max-w-2xl">
              {/* Icon + ornament */}
              <div className="flex items-center gap-4 mb-5">
                <span className="text-5xl" style={{ filter: `drop-shadow(0 0 20px ${service.accentColor})` }}>
                  {service.icon}
                </span>
                <div className="h-px flex-1 max-w-[80px]" style={{ background: `linear-gradient(90deg, ${service.accentColor}, transparent)` }} />
              </div>

              <p className="font-raleway text-xs tracking-[0.4em] uppercase mb-3" style={{ color: service.accentColor }}>
                The Cosmic Connect
              </p>

              <h1 className="font-cinzel font-bold text-cosmic-cream leading-tight mb-4"
                style={{ fontSize: 'clamp(2rem, 5vw, 3.5rem)' }}>
                {service.title}
              </h1>

              <p className="font-cormorant italic text-cosmic-cream/60 text-xl mb-8 leading-relaxed">
                {service.tagline}
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setCalendlyOpen(true)}
                  className="btn-primary group"
                >
                  <Sparkles size={15} className="group-hover:rotate-12 transition-transform" />
                  Book a Session
                </button>
                <a
                  href="https://wa.me/919599474758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline"
                >
                  Chat on WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── INTRO ─────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic max-w-4xl">
            <Reveal>
              <p className="ornament text-xs tracking-[0.5em] text-center mb-6">✦ ✦ ✦</p>
              <p className="font-cormorant text-cosmic-cream/80 text-xl md:text-2xl italic leading-relaxed text-center">
                {service.intro}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WHAT IS IT + BENEFITS ──────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic">
            <div className="grid lg:grid-cols-2 gap-12 items-start">

              {/* What is it */}
              <Reveal>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-4">
                  What is <span className="text-gradient-gold">{service.title}?</span>
                </h2>
                <div className="gold-divider mb-6" style={{ margin: '0 0 1.5rem 0' }} />
                <p className="font-cormorant text-cosmic-cream/65 text-lg leading-relaxed">
                  {service.whatIsIt}
                </p>

                {/* Image placeholder */}
                <div
                  className="mt-8 w-full aspect-video rounded-sm flex items-center justify-center border border-cosmic-gold/20"
                  style={{ background: `linear-gradient(135deg, ${service.accentColor}22, ${service.accentColor}08)` }}
                >
                  <div className="text-center">
                    <span className="text-6xl mb-3 block">{service.icon}</span>
                    <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest uppercase">
                      Image placeholder — replace with real photo
                    </p>
                    <p className="font-raleway text-cosmic-cream/20 text-xs mt-1">
                      {service.heroImage}
                    </p>
                  </div>
                </div>
              </Reveal>

              {/* Benefits */}
              <Reveal delay={0.15}>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-4">
                  Key <span className="text-gradient-gold">Benefits</span>
                </h2>
                <div className="gold-divider mb-6" style={{ margin: '0 0 1.5rem 0' }} />
                <ul className="space-y-3">
                  {service.benefits.map((benefit, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <CheckCircle
                        size={18}
                        className="shrink-0 mt-0.5 transition-colors"
                        style={{ color: service.accentColor }}
                      />
                      <span className="font-cormorant text-cosmic-cream/70 text-lg leading-snug group-hover:text-cosmic-cream transition-colors">
                        {benefit}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── WHO IS IT FOR ──────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic max-w-4xl">
            <Reveal>
              <div className="text-center mb-10">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  Who Is This <span className="text-gradient-gold">For?</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
              {service.whoIsItFor.map((who, i) => (
                <Reveal key={i} delay={i * 0.08}>
                  <div className="cosmic-card p-5 flex items-start gap-3">
                    <span className="text-cosmic-gold/60 shrink-0 mt-0.5 font-cinzel">✦</span>
                    <p className="font-cormorant text-cosmic-cream/70 text-base leading-snug">{who}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── WHAT TO EXPECT ────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic max-w-4xl">
            <Reveal>
              <div className="text-center mb-12">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  What to <span className="text-gradient-gold">Expect</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>

            <div className="relative">
              {/* Vertical line */}
              <div
                className="absolute left-6 top-0 bottom-0 w-px hidden md:block"
                style={{ background: `linear-gradient(180deg, transparent, ${service.accentColor}60, transparent)` }}
              />

              <div className="space-y-6">
                {service.whatToExpect.map((step, i) => (
                  <Reveal key={i} delay={i * 0.1}>
                    <div className="flex gap-6 items-start">
                      {/* Step number */}
                      <div
                        className="shrink-0 w-12 h-12 rounded-full border-2 flex items-center justify-center font-cinzel font-bold text-sm z-10"
                        style={{ borderColor: service.accentColor, color: service.accentColor, background: '#0A0708' }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </div>
                      {/* Content */}
                      <div className="cosmic-card p-5 flex-1">
                        <p className="font-cinzel text-cosmic-gold text-sm font-semibold mb-2 tracking-wide">
                          {step.step}
                        </p>
                        <p className="font-cormorant text-cosmic-cream/65 text-base leading-relaxed">
                          {step.desc}
                        </p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic max-w-3xl">
            <Reveal>
              <div className="text-center mb-10">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  Frequently Asked <span className="text-gradient-gold">Questions</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>
            <div className="space-y-2">
              {service.faqs.map((faq, i) => (
                <FAQItem key={i} q={faq.q} a={faq.a} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── BOOKING CTA BANNER ────────────────────────────────────────── */}
        <section
          className="py-20 px-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${service.accentColor}33, #1A0A2E, ${service.accentColor}22)` }}
        >
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="absolute text-cosmic-gold/10 font-cinzel text-8xl"
                style={{ left: `${i * 30}%`, top: `${20 + i * 15}%`, animation: `float ${5 + i}s ease-in-out infinite`, animationDelay: `${i * 0.5}s` }}
              >
                ✦
              </div>
            ))}
          </div>
          <div className="container-cosmic text-center relative z-10">
            <Reveal>
              <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
              <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                Ready to Begin Your <span className="text-gradient-gold">Journey?</span>
              </h2>
              <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8 max-w-xl mx-auto">
                Book your {service.title} session with Dr. Usha Bhatt today.
                Online &amp; in-person sessions available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCalendlyOpen(true)} className="btn-primary">
                  <Sparkles size={15} />
                  Book Your Session
                </button>
                <a href="tel:+919599474758" className="btn-outline">
                  Call +91 95994 74758
                </a>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── OTHER SERVICES ────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-10">
                <h2 className="font-cinzel text-xl text-cosmic-cream font-bold mb-3">
                  Explore Other <span className="text-gradient-gold">Services</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {otherServices.map((s, i) => (
                <Reveal key={s.slug} delay={i * 0.1}>
                  <Link href={`/services/${s.slug}`} className="cosmic-card p-5 flex flex-col group">
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {s.icon}
                    </span>
                    <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold group-hover:text-cosmic-gold transition-colors mb-2">
                      {s.title}
                    </h3>
                    <p className="font-cormorant text-cosmic-cream/50 text-sm leading-snug">
                      {s.tagline}
                    </p>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Layout>

      <CalendlyPopup isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  )
}
