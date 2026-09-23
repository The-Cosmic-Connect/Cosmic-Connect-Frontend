import { useEffect, useRef, useState } from 'react'
import { Award } from 'lucide-react'

// Ported from the "Awards & Recognitions" section on thecosmicconnect.com.
// No award photos are wired in yet (per request — pictures can be added
// later); each card shows a placeholder icon in the meantime. To add a real
// photo, give that award an `image` string and swap the icon block below for
// an <img>.
const awards = [
  { title: 'Honorary Doctorate', year: '2024', image: '' },
  { title: 'Icons of Asia', year: '2023', image: '' },
  { title: 'Right Choice Awards', year: '2022', image: '' },
]

export default function AwardsSection() {
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
    <section className="section bg-cosmic-section">
      <div className="container-cosmic">
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
            Awards &amp; <span className="text-gradient-gold">Recognitions</span>
          </h2>
          <div className="gold-divider mb-4" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {awards.map((award, i) => (
            <div
              key={award.title}
              className="cosmic-card p-6 flex flex-col items-center text-center"
              style={{
                transitionDelay: `${i * 0.1}s`,
              }}
            >
              {award.image ? (
                <img
                  src={award.image}
                  alt={award.title}
                  className="w-20 h-20 object-cover rounded-full border border-cosmic-gold/30 mb-4"
                />
              ) : (
                <div className="w-20 h-20 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/10 flex items-center justify-center mb-4">
                  <Award size={30} className="text-cosmic-gold" />
                </div>
              )}
              <h3 className="font-cinzel text-cosmic-cream font-semibold text-sm mb-1">
                {award.title}
              </h3>
              <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest">
                {award.year}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
