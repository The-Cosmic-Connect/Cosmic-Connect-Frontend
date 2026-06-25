// components/shop/FeaturedCarousel.tsx
//
// Horizontally scrollable strip of product cards, used for "Featured" and
// "Bestsellers" sections on /shop. Behavior:
//   - Auto-fit to viewport: the number of visible cards is derived from the
//     container width, not hard-coded. Smaller screens show fewer cards.
//   - Auto-advance: scrolls one card-width every ~4.5s. Pauses on hover and
//     while the user is interacting (drag/touch).
//   - Native scroll-snap so manual swipes feel right on touch devices.
//   - Edge fade gradients hint that there's more off-screen.
//   - Arrow buttons appear on hover for mouse users; touch devices use swipe.
//   - Renders nothing if `products` is empty, so callers can drop it in
//     unconditionally.
import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ProductCard from '@/components/shop/ProductCard'
import type { Product } from '@/types/product'

interface Props {
  title:        string
  eyebrow?:     string                // small kicker line above the title
  products:     Product[]
  autoAdvance?: boolean                // default true
  intervalMs?:  number                 // default 4500
}

export default function FeaturedCarousel({
  title, eyebrow, products,
  autoAdvance = true, intervalMs = 4500,
}: Props) {
  const scrollerRef = useRef<HTMLDivElement | null>(null)
  const [paused, setPaused] = useState(false)
  const [canLeft,  setCanLeft]  = useState(false)
  const [canRight, setCanRight] = useState(true)

  // Compute card width from the first child so the scroller advances by an
  // exact card on each tick — regardless of viewport size.
  function getStep(): number {
    const el = scrollerRef.current
    if (!el || !el.firstElementChild) return 280
    const first = el.firstElementChild as HTMLElement
    const style = window.getComputedStyle(el)
    const gap = parseFloat((style as any).columnGap || style.gap || '0') || 0
    return first.getBoundingClientRect().width + gap
  }

  function nudge(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    const step = getStep()
    const max  = el.scrollWidth - el.clientWidth
    let target = el.scrollLeft + dir * step
    // Wrap around at ends for a seamless auto-advance loop.
    if (dir === 1 && target > max - 4) target = 0
    else if (dir === -1 && target < 4) target = max
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  // Update arrow visibility + auto-advance pause-on-interaction.
  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return
    function update() {
      setCanLeft(el!.scrollLeft > 8)
      setCanRight(el!.scrollLeft < el!.scrollWidth - el!.clientWidth - 8)
    }
    update()
    el.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      el.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [products])

  // Auto-advance timer. Pauses on hover/touch and when tab is hidden so we
  // don't burn CPU in the background.
  useEffect(() => {
    if (!autoAdvance || products.length <= 1) return
    let timer: number | undefined
    function tick() { if (!paused && !document.hidden) nudge(1) }
    timer = window.setInterval(tick, intervalMs)
    return () => { if (timer) window.clearInterval(timer) }
  }, [autoAdvance, intervalMs, paused, products.length])

  if (!products?.length) return null

  return (
    <section className="py-10 px-4">
      <div className="container-cosmic">
        <div className="flex items-end justify-between mb-5">
          <div>
            {eyebrow && (
              <p className="font-raleway text-cosmic-gold/70 text-[10px] tracking-[0.3em] uppercase mb-1">
                {eyebrow}
              </p>
            )}
            <h2 className="font-cinzel text-cosmic-cream text-xl md:text-2xl tracking-wide">
              {title}
            </h2>
          </div>

          {/* Arrow controls (visible from md+; touch users swipe) */}
          <div className="hidden md:flex items-center gap-2">
            <button type="button" aria-label="Previous"
              onClick={() => nudge(-1)} disabled={!canLeft}
              className="w-9 h-9 border border-cosmic-gold/30 hover:border-cosmic-gold/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-cosmic-gold transition-colors">
              <ChevronLeft size={16} />
            </button>
            <button type="button" aria-label="Next"
              onClick={() => nudge(1)} disabled={!canRight && products.length <= 4}
              className="w-9 h-9 border border-cosmic-gold/30 hover:border-cosmic-gold/60 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center text-cosmic-gold transition-colors">
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Scroll viewport with edge fade gradients */}
        <div className="relative"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}>
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 z-10"
            style={{ background: 'linear-gradient(90deg, rgb(var(--cosmic-black)) 0%, transparent 100%)' }} />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 z-10"
            style={{ background: 'linear-gradient(-90deg, rgb(var(--cosmic-black)) 0%, transparent 100%)' }} />

          <div
            ref={scrollerRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{
              scrollSnapType: 'x mandatory',
              // Hide native scrollbar — visual cleanliness only; scroll still works.
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
          >
            {products.map((p, i) => (
              <div
                key={p.id || i}
                className="shrink-0"
                style={{
                  // Auto-fit: 2 on mobile, 3 on small, 4 on md, 5 on lg+.
                  // Each card claims a viewport-relative width; CSS clamp keeps
                  // it sensible at any breakpoint.
                  width: 'clamp(150px, calc((100vw - 4rem) / 2 - 0.5rem), 280px)',
                  scrollSnapAlign: 'start',
                }}
              >
                <ProductCard product={p as any} index={i} />
              </div>
            ))}
          </div>

          {/* Hide webkit scrollbar */}
          <style jsx>{`
            div::-webkit-scrollbar { display: none; }
          `}</style>
        </div>
      </div>
    </section>
  )
}
