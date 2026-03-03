import { useState, useEffect } from 'react'
import { ChevronDown, Star, Sparkles } from 'lucide-react'
import CalendlyPopup from '../ui/CalendlyPopup'

const services = [
  'Tarot Card Reading',
  'Akashic Records',
  'Past Life Healing',
  'Crystal Therapy',
  'Reiki Healing',
  'Black Magic Removal',
]

export default function HeroSection() {
  const [calendlyOpen, setCalendlyOpen] = useState(false)
  const [currentService, setCurrentService] = useState(0)
  const [visible, setVisible] = useState(false)

  // Fade in on mount
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100)
    return () => clearTimeout(t)
  }, [])

  // Rotate service text
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentService(prev => (prev + 1) % services.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const scrollToServices = () => {
    document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-cosmic-gradient">

        {/* Radial glow behind content */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 70% 60% at 50% 50%, rgba(74,44,138,0.35) 0%, transparent 70%)',
          }}
        />

        {/* Decorative concentric rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {[700, 520, 360, 200].map((size, i) => (
            <div
              key={size}
              className="absolute rounded-full border border-cosmic-gold"
              style={{
                width: size,
                height: size,
                opacity: 0.04 + i * 0.03,
                animation: `float ${8 + i * 2}s ease-in-out infinite`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}
        </div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute text-cosmic-gold pointer-events-none"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              opacity: 0.15 + (i % 3) * 0.1,
              fontSize: i % 2 === 0 ? '10px' : '14px',
              animation: `float ${5 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.7}s`,
            }}
          >
            ✦
          </div>
        ))}

        {/* Main content */}
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto pt-24 pb-16"
          style={{
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 1s ease, transform 1s ease',
          }}
        >
          {/* Pre-heading */}
          <div
            className="flex items-center justify-center gap-3 mb-6"
            style={{ animationDelay: '0.1s' }}
          >
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-cosmic-gold/60" />
            <span className="font-raleway text-cosmic-gold/80 text-xs tracking-[0.4em] uppercase">
              Trusted by thousands
            </span>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-cosmic-gold/60" />
          </div>

          {/* Star rating */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={14}
                className="text-cosmic-gold fill-cosmic-gold"
              />
            ))}
            <span className="font-raleway text-cosmic-cream/50 text-xs ml-2 tracking-widest">
              500+ sessions
            </span>
          </div>

          {/* Main heading */}
          <h1 className="font-cinzel font-bold leading-tight mb-4">
            <span
              className="block text-cosmic-cream"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
            >
              Let the Universe
            </span>
            <span
              className="block text-gold-shimmer"
              style={{ fontSize: 'clamp(2.2rem, 6vw, 4.5rem)' }}
            >
              Guide You
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="font-cormorant italic text-cosmic-cream/70 mb-3 leading-relaxed"
            style={{ fontSize: 'clamp(1.2rem, 3vw, 1.7rem)' }}
          >
            Dr. Usha Bhatt — Renowned Psychic Healer &amp; Spiritual Guide
          </p>

          {/* Rotating service text */}
          <div className="h-8 flex items-center justify-center mb-8 overflow-hidden">
            <p
              key={currentService}
              className="font-raleway text-cosmic-gold/70 text-sm tracking-[0.3em] uppercase"
              style={{
                animation: 'fadeInUp 0.5s ease forwards',
              }}
            >
              ✦ &nbsp;{services[currentService]}&nbsp; ✦
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => setCalendlyOpen(true)}
              className="btn-primary group"
            >
              <Sparkles size={16} className="group-hover:rotate-12 transition-transform" />
              Book a Session
            </button>
            <a href="#services" className="btn-outline" onClick={(e) => { e.preventDefault(); scrollToServices() }}>
              Explore Services
            </a>
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { label: '20+', sub: 'Years Experience' },
              { label: '5000+', sub: 'Lives Touched' },
              { label: '3', sub: 'National Awards' },
              { label: '100%', sub: 'Confidential' },
            ].map(({ label, sub }) => (
              <div key={sub} className="text-center">
                <p className="font-cinzel text-cosmic-gold font-bold text-xl leading-none">{label}</p>
                <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mt-1">{sub}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <button
          onClick={scrollToServices}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 text-cosmic-gold/40 hover:text-cosmic-gold transition-colors"
          aria-label="Scroll down"
          style={{ animation: 'float 2.5s ease-in-out infinite' }}
        >
          <ChevronDown size={28} />
        </button>
      </section>

      <CalendlyPopup isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  )
}
