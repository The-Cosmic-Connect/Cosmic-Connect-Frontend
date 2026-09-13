import { useEffect, useState, useCallback, useRef } from 'react'
import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const AUTOPLAY_MS = 6000

interface Slide {
  id:           string
  imageUrl?:    string
  headline:     string
  subtext:      string
  ctaText?:     string
  ctaLink?:     string
  layout:       'full-bleed' | 'split' | 'text-only'
  textPosition: 'left' | 'center' | 'right'
  overlayStyle: 'none' | 'dark' | 'gradient' | 'plum'
  isActive:     boolean
  order:        number
}

function overlayBackground(style: Slide['overlayStyle']): string {
  switch (style) {
    case 'dark':     return 'rgba(10, 7, 8, 0.55)'
    case 'gradient': return 'linear-gradient(90deg, rgba(10,7,8,0.75) 0%, rgba(10,7,8,0.25) 55%, rgba(10,7,8,0) 100%)'
    case 'plum':     return 'linear-gradient(120deg, rgba(59,43,95,0.72) 0%, rgba(59,43,95,0.35) 60%, rgba(59,43,95,0) 100%)'
    default:         return 'transparent'
  }
}

function textAlignClass(pos: Slide['textPosition']): string {
  if (pos === 'left')  return 'items-start text-left'
  if (pos === 'right') return 'items-end text-right ml-auto'
  return 'items-center text-center mx-auto'
}

export default function HomeCarousel() {
  const [slides,  setSlides]  = useState<Slide[]>([])
  const [loaded,  setLoaded]  = useState(false)
  const [active,  setActive]  = useState(0)
  const [paused,  setPaused]  = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    fetch(`${API}/carousel-slides?active_only=true`)
      .then(r => r.json())
      .then(d => setSlides(d.slides || []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  const next = useCallback(() => setActive(a => (a + 1) % Math.max(slides.length, 1)), [slides.length])
  const prev = useCallback(() => setActive(a => (a - 1 + slides.length) % Math.max(slides.length, 1)), [slides.length])

  useEffect(() => {
    if (slides.length <= 1 || paused) return
    timerRef.current = setInterval(next, AUTOPLAY_MS)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [slides.length, paused, next])

  if (!loaded || slides.length === 0) return null

  const slide = slides[active]

  return (
    <section
      className="relative overflow-hidden"
      style={{ minHeight: 'min(78vh, 640px)' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
    >
      {slides.map((s, i) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? 'auto' : 'none' }}
          aria-hidden={i !== active}
        >
          {/* Background image (full-bleed / text-only layouts use it as a full backdrop; split gives it its own half) */}
          {s.imageUrl && s.layout !== 'split' && (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${s.imageUrl})` }}
            />
          )}
          {s.imageUrl && s.layout !== 'split' && (
            <div className="absolute inset-0" style={{ background: overlayBackground(s.overlayStyle) }} />
          )}
          {!s.imageUrl && s.layout !== 'split' && (
            <div className="absolute inset-0 bg-cosmic-gradient" />
          )}

          <div className={`relative z-10 h-full ${s.layout === 'split' ? 'flex flex-col md:flex-row' : 'flex items-center'}`}>
            {s.layout === 'split' && s.imageUrl && (
              <div className="w-full md:w-1/2 h-56 md:h-full bg-cover bg-center order-1"
                style={{ backgroundImage: `url(${s.imageUrl})` }} />
            )}

            <div
              className={`flex flex-col justify-center gap-4 px-6 md:px-14 py-10 max-w-2xl w-full
                ${s.layout === 'split' ? 'md:w-1/2 order-2' : ''}
                ${textAlignClass(s.textPosition)}`}
            >
              {s.headline && (
                <h2 className="font-cinzel font-bold text-cosmic-cream" style={{ fontSize: 'clamp(1.6rem, 4vw, 3rem)' }}>
                  {s.headline}
                </h2>
              )}
              {s.subtext && (
                <p className="font-cormorant italic text-cosmic-cream/80" style={{ fontSize: 'clamp(1rem, 2vw, 1.35rem)' }}>
                  {s.subtext}
                </p>
              )}
              {s.ctaText && s.ctaLink && (
                <div>
                  <Link href={s.ctaLink} className="btn-primary inline-flex">
                    {s.ctaText}
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            aria-label="Previous slide"
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center
              rounded-full bg-cosmic-black/40 text-cosmic-cream hover:bg-cosmic-black/70 backdrop-blur-sm transition-colors"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={next}
            aria-label="Next slide"
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20 w-9 h-9 flex items-center justify-center
              rounded-full bg-cosmic-black/40 text-cosmic-cream hover:bg-cosmic-black/70 backdrop-blur-sm transition-colors"
          >
            <ChevronRight size={18} />
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="h-1.5 rounded-full transition-all duration-300"
                style={{
                  width: i === active ? 22 : 8,
                  background: i === active ? 'rgb(var(--cosmic-gold))' : 'rgba(255,255,255,0.4)',
                }}
              />
            ))}
          </div>
        </>
      )}
    </section>
  )
}
