import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'

const services = [
  {
    title: 'Tarot Card Reading',
    slug: 'tarot-card-reading',
    icon: '🃏',
    description:
      'Unlock insights into your love life, career, finances and future through the ancient art of Tarot.',
    tags: ['Love', 'Career', 'Future'],
  },
  {
    title: 'Akashic Records Reading',
    slug: 'akashic-reading',
    icon: '📖',
    description:
      "Access your soul's journey through the cosmic library of all universal knowledge and past experiences.",
    tags: ['Soul', 'Past Lives', 'Purpose'],
  },
  {
    title: 'Healing Sessions',
    slug: 'healing-sessions',
    icon: '✨',
    description:
      'Experience deep energy healing through Reiki and crystal therapy for emotional and physical well-being.',
    tags: ['Reiki', 'Crystal', 'Energy'],
  },
  {
    title: 'Past Life Healing',
    slug: 'past-life-healing',
    icon: '🌀',
    description:
      'Discover karmic connections from past lives and heal unresolved traumas that affect your present.',
    tags: ['Karma', 'Healing', 'Trauma'],
  },
  {
    title: 'Psychic Readings',
    slug: 'psychic-readings',
    icon: '🔮',
    description:
      'Gain powerful clarity and answers through Dr. Usha Bhatt\'s extraordinary psychic insights.',
    tags: ['Clarity', 'Guidance', 'Intuition'],
  },
  {
    title: 'Black Magic Removal',
    slug: 'black-magic-removal',
    icon: '🛡️',
    description:
      'Identify and remove negative energies, evil eye, and black magic affecting your life and business.',
    tags: ['Protection', 'Cleansing', 'Aura'],
  },
]

function ServiceCard({ service, index }: { service: typeof services[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold: 0.15 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className="cosmic-card p-6 flex flex-col group cursor-pointer"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      {/* Icon */}
      <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
        {service.icon}
      </div>

      {/* Title */}
      <h3 className="font-cinzel text-cosmic-cream font-semibold text-base mb-3 leading-snug group-hover:text-cosmic-gold transition-colors duration-300">
        {service.title}
      </h3>

      {/* Description */}
      <p className="font-cormorant text-cosmic-cream/60 text-base leading-relaxed mb-4 flex-grow">
        {service.description}
      </p>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-5">
        {service.tags.map(tag => (
          <span
            key={tag}
            className="text-xs font-raleway tracking-widest uppercase text-cosmic-gold/50 border border-cosmic-gold/20 px-2.5 py-1 rounded-full group-hover:border-cosmic-gold/40 transition-colors"
          >
            {tag}
          </span>
        ))}
      </div>

      {/* Link */}
      <Link
        href={`/services/${service.slug}`}
        className="font-raleway text-xs text-cosmic-gold/60 tracking-widest uppercase hover:text-cosmic-gold transition-colors flex items-center gap-2 mt-auto group/link"
      >
        Learn More
        <span className="group-hover/link:translate-x-1 transition-transform">→</span>
      </Link>
    </div>
  )
}

export default function ServicesSection() {
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
    <section id="services" className="section bg-cosmic-section">
      <div className="container-cosmic">

        {/* Section header */}
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
            Services We <span className="text-gradient-gold">Offer</span>
          </h2>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto leading-relaxed">
            Explore the depths of your existence and unlock new paths to self-discovery
            and empowerment with Dr. Bhatt.
          </p>
        </div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
          {services.map((service, i) => (
            <ServiceCard key={service.slug} service={service} index={i} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Link href="/services" className="btn-primary">
            View All Services & Book
          </Link>
        </div>

      </div>
    </section>
  )
}
