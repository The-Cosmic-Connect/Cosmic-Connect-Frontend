import { useEffect, useRef, useState } from 'react'
import { Star, Quote, ExternalLink } from 'lucide-react'

// Reviews are managed in the admin (Reviews page) and passed in from the
// homepage's getStaticProps. If none are published yet (or the API is down
// at build time) we fall back to the original review below, so the section
// is never empty.
export interface Testimonial {
  id?: string
  author: string
  text: string
  rating?: number
  reviewDate?: string
  sourceUrl?: string
  photo?: string
}

// Google Maps listing — "Read all reviews on Google" link.
const GOOGLE_REVIEWS_URL = 'https://maps.app.goo.gl/s18vSeAsM7fB85zf7'

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  {
    text:
      "I'm happy to share my experience with The Cosmic Connect. My session with Usha Ma'am was truly wonderful. She is incredibly knowledgeable in her field and guided me with genuine care and clarity. Her warm and friendly nature made me feel at ease, and her tarot readings were both accurate and timely. The remedies she suggested came just when I needed them most. I also want to mention that the staff at The Cosmic Connect is very supportive and assisted me in the best possible manner. I highly recommend her—and the entire team—to anyone seeking guidance and support.",
    author: 'Kartik Pathania',
    rating: 5,
    photo: '',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

// Long reviews are clamped in the grid; "Read more" expands in place.
const CLAMP_CHARS = 260

function ReviewCard({ t, large }: { t: Testimonial; large: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const rating = Math.max(1, Math.min(5, Math.round(Number(t.rating) || 5)))
  const long = !large && t.text.length > CLAMP_CHARS
  const shown = long && !expanded ? t.text.slice(0, CLAMP_CHARS).trimEnd() + '…' : t.text

  return (
    <div className={`cosmic-card relative flex flex-col ${large ? 'p-8 md:p-10' : 'p-6 md:p-7'}`}>
      <Quote size={large ? 32 : 26} className="text-cosmic-gold/25 mb-4" />

      <div className="flex items-center gap-1 mb-4" aria-label={`${rating} out of 5 stars`}>
        {[...Array(5)].map((_, s) => (
          <Star
            key={s}
            size={13}
            className={s < rating ? 'text-cosmic-gold fill-cosmic-gold' : 'text-cosmic-gold/30'}
          />
        ))}
      </div>

      <p className={`font-cormorant text-cosmic-cream/75 italic leading-relaxed mb-6 ${large ? 'text-lg md:text-xl' : 'text-base md:text-[17px]'}`}>
        &ldquo;{shown}&rdquo;
        {long && (
          <button
            type="button"
            onClick={() => setExpanded(e => !e)}
            className="not-italic font-raleway text-cosmic-gold text-xs tracking-widest uppercase ml-2 hover:underline"
          >
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
      </p>

      <div className="flex items-center gap-3 mt-auto">
        {t.photo ? (
          <img
            src={t.photo}
            alt={t.author}
            loading="lazy"
            referrerPolicy="no-referrer"
            className="w-11 h-11 rounded-full object-cover border border-cosmic-gold/30"
          />
        ) : (
          <div className="w-11 h-11 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/10 flex items-center justify-center font-cinzel text-cosmic-gold text-sm font-semibold shrink-0">
            {initials(t.author)}
          </div>
        )}
        <div className="min-w-0">
          <p className="font-cinzel text-cosmic-cream font-semibold text-sm truncate">{t.author}</p>
          <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">
            {t.sourceUrl ? (
              <a href={t.sourceUrl} target="_blank" rel="noopener noreferrer"
                className="hover:text-cosmic-gold transition-colors inline-flex items-center gap-1">
                Google review <ExternalLink size={10} />
              </a>
            ) : 'Verified Client'}
            {t.reviewDate ? <span> · {t.reviewDate}</span> : null}
          </p>
        </div>
      </div>
    </div>
  )
}

export default function TestimonialsSection({ items }: { items?: Testimonial[] }) {
  const list = items && items.length > 0 ? items : FALLBACK_TESTIMONIALS
  const single = list.length === 1

  const titleRef = useRef<HTMLDivElement>(null)
  const [titleVisible, setTitleVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setTitleVisible(true) },
      { threshold: 0.3 }
    )
    if (titleRef.current) observer.observe(titleRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="section" style={{ background: 'rgb(var(--cosmic-black))' }}>
      <div className={`container-cosmic ${single ? 'max-w-3xl' : ''}`}>
        <div
          ref={titleRef}
          className="text-center mb-14"
          style={{
            opacity: titleVisible ? 1 : 0,
            transform: titleVisible ? 'translateY(0)' : 'translateY(24px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-4">
            What Our <span className="text-gradient-gold">Clients Say</span>
          </h2>
          <div className="gold-divider mb-4" />
        </div>

        {single ? (
          <ReviewCard t={list[0]} large />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 items-start">
            {list.map((t, i) => <ReviewCard key={t.id || i} t={t} large={false} />)}
          </div>
        )}

        <div className="text-center mt-12">
          <a href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs">
            Read all reviews on Google <ExternalLink size={13} />
          </a>
        </div>
      </div>
    </section>
  )
}
