import { useEffect, useRef, useState } from 'react'
import { Star, Quote } from 'lucide-react'

// Ported from the "What Our Clients Say" section on thecosmicconnect.com.
// Only one testimonial exists there today — this is written to take more as
// an array so additional ones can be dropped in later without restructuring.
const testimonials = [
  {
    quote:
      "I'm happy to share my experience with The Cosmic Connect. My session with Usha Ma'am was truly wonderful. She is incredibly knowledgeable in her field and guided me with genuine care and clarity. Her warm and friendly nature made me feel at ease, and her tarot readings were both accurate and timely. The remedies she suggested came just when I needed them most. I also want to mention that the staff at The Cosmic Connect is very supportive and assisted me in the best possible manner. I highly recommend her—and the entire team—to anyone seeking guidance and support.",
    author: 'Kartik Pathania',
    // No client photo yet — swap this out for a real one whenever it's ready.
    photo: '',
  },
]

function initials(name: string) {
  return name
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

export default function TestimonialsSection() {
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
      <div className="container-cosmic max-w-3xl">
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

        <div className="space-y-8">
          {testimonials.map((t, i) => (
            <div key={i} className="cosmic-card p-8 md:p-10 relative">
              <Quote size={32} className="text-cosmic-gold/25 mb-4" />

              <div className="flex items-center gap-1 mb-4">
                {[...Array(5)].map((_, s) => (
                  <Star key={s} size={13} className="text-cosmic-gold fill-cosmic-gold" />
                ))}
              </div>

              <p className="font-cormorant text-cosmic-cream/75 text-lg md:text-xl italic leading-relaxed mb-6">
                "{t.quote}"
              </p>

              <div className="flex items-center gap-3">
                {t.photo ? (
                  <img
                    src={t.photo}
                    alt={t.author}
                    className="w-11 h-11 rounded-full object-cover border border-cosmic-gold/30"
                  />
                ) : (
                  <div className="w-11 h-11 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/10 flex items-center justify-center font-cinzel text-cosmic-gold text-sm font-semibold">
                    {initials(t.author)}
                  </div>
                )}
                <div>
                  <p className="font-cinzel text-cosmic-cream font-semibold text-sm">{t.author}</p>
                  <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">
                    Verified Client
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
