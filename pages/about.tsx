import { useRef, useState, useEffect } from 'react'
import Link from 'next/link'
import { Sparkles, Quote } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CalendlyPopup from '@/components/ui/CalendlyPopup'
import Image from 'next/image'

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
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
      className={className}
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

// ── Data ──────────────────────────────────────────────────────────────────────
const awards = [
  {
    year: '2024',
    title: 'Honorary Doctorate',
    body: 'Awarded for outstanding contributions to spiritual healing and psychic guidance across two decades of practice.',
    emoji: '🎓',
    color: '#C9A84C',
  },
  {
    year: '2023',
    title: 'Icons of Asia',
    body: 'Pride of Asia Award recognising excellence in holistic healing practices across the continent.',
    emoji: '🏆',
    color: '#4A2C8A',
  },
  {
    year: '2022',
    title: 'Right Choice Awards',
    body: 'Most Trusted Psychic Reader & Reiki Healer — voted by clients and industry peers nationally.',
    emoji: '⭐',
    color: '#8B3A52',
  },
  {
    year: '2021',
    title: 'Grand Master Certification',
    body: 'Certified Grand Master in Tarot Reading and Energy Healing by an international governing body.',
    emoji: '✦',
    color: '#1A5C6B',
  },
]

const certifications = [
  {
    icon: '🃏',
    title: 'Certified Grand Master Tarot Reader',
    body: 'Advanced certification in all 78 cards, multiple spread systems, and intuitive reading techniques.',
  },
  {
    icon: '✋',
    title: 'Reiki Grand Master',
    body: 'Attuned to all levels of Usui Reiki — Level 1, 2, 3 and Grand Master Teacher certification.',
  },
  {
    icon: '📖',
    title: 'Certified Akashic Records Reader',
    body: 'Trained and certified to access and interpret Akashic Records for soul-level healing.',
  },
  {
    icon: '💎',
    title: 'Crystal Therapy Practitioner',
    body: 'Expert in crystal healing, chakra balancing, crystal grids, and gemstone prescription.',
  },
  {
    icon: '🌀',
    title: 'Past Life Regression Therapist',
    body: 'Certified therapist in past life exploration and karmic healing modalities.',
  },
  {
    icon: '🎓',
    title: 'Honorary Doctorate — Spiritual Sciences',
    body: 'Awarded Honorary Doctorate for two decades of service in spiritual healing and guidance.',
  },
]

const journeyMilestones = [
  {
    year: '2000',
    title: 'The Awakening',
    desc: "Dr. Usha Bhatt's spiritual journey began when she experienced her first profound psychic vision. Recognising an extraordinary gift, she committed herself fully to understanding and developing her intuitive abilities.",
  },
  {
    year: '2004',
    title: 'Formal Training',
    desc: "Undertook rigorous training in Tarot, Reiki, and energy healing under some of India's most respected spiritual teachers. Achieved her first Reiki Master certification and began practising professionally.",
  },
  {
    year: '2008',
    title: 'Helping Hundreds',
    desc: 'By 2008, Dr. Bhatt had already guided hundreds of clients through major life challenges — career crossroads, relationship crises, spiritual blocks, and emotional trauma. Her reputation grew entirely through word of mouth.',
  },
  {
    year: '2012',
    title: 'The Cosmic Connect Founded',
    desc: 'Founded The Cosmic Connect as a dedicated healing studio in New Delhi, bringing together all her services under one roof and making spiritual guidance accessible to many more people.',
  },
  {
    year: '2016',
    title: 'Going Online',
    desc: 'Expanded to online sessions, making her unique healing gifts available to clients across India and internationally. Distance healing proved equally powerful, reaching souls in need across the world.',
  },
  {
    year: '2020',
    title: 'Courses & Education',
    desc: "Launched structured courses in Tarot, Crystal Therapy, Psychic Development, and Spiritual Awareness — empowering students to develop their own healing abilities under Dr. Bhatt's expert guidance.",
  },
  {
    year: '2024',
    title: 'Nationally Recognised',
    desc: 'Received the Honorary Doctorate in Spiritual Sciences — the culmination of over two decades of dedicated service, healing, and spiritual education. The journey continues.',
  },
]

const galleryItems = [
  { label: 'Healing Studio', emoji: '🕯️', desc: 'Sacred healing space in New Delhi', file: 'gallery-studio.jpg' },
  { label: 'Crystal Collection', emoji: '💎', desc: 'Handpicked healing crystals', file: 'gallery-crystals.jpg' },
  { label: 'Teaching', emoji: '📚', desc: 'Courses and workshops', file: 'gallery-teaching.jpg' },
  { label: 'Awards Ceremony', emoji: '🏆', desc: 'Icons of Asia 2023', file: 'gallery-awards.jpg' },
  { label: 'Tarot Sessions', emoji: '🃏', desc: 'One-on-one readings', file: 'gallery-tarot.jpg' },
  { label: 'Energy Healing', emoji: '✨', desc: 'Reiki & chakra work', file: 'gallery-healing.jpg' },
]

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  const [calendlyOpen, setCalendlyOpen] = useState(false)

  return (
    <>
      <Layout
        title="About Dr. Usha Bhatt | Psychic Healer & Tarot Reader | The Cosmic Connect"
        description="Meet Dr. Usha Bhatt — renowned psychic healer, Tarot Grand Master, and spiritual guide with 20+ years of experience. Honorary Doctorate recipient and Icons of Asia awardee."
        canonical="/about"
      >
        {/* JSON-LD Person Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Dr. Usha Bhatt',
              jobTitle: 'Psychic Healer & Tarot Grand Master',
              description: 'Renowned psychic healer, Tarot Grand Master, and spiritual guide with 20+ years of experience.',
              url: 'https://www.thecosmicconnect.com/about',
              worksFor: {
                '@type': 'Organization',
                name: 'The Cosmic Connect',
                url: 'https://www.thecosmicconnect.com',
              },
              award: ['Honorary Doctorate 2024', 'Icons of Asia 2023', 'Right Choice Awards 2022'],
              knowsAbout: ['Tarot Card Reading', 'Akashic Records', 'Reiki Healing', 'Past Life Therapy', 'Crystal Therapy'],
            }),
          }}
        />

        {/* ── HERO / BIO ──────────────────────────────────────────────────── */}
        <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-cosmic-gradient pt-24 pb-16">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 70% at 30% 50%, rgba(74,44,138,0.25), transparent 70%)' }}
          />

          {/* Decorative rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 pointer-events-none">
            {[500, 380, 260].map((size, i) => (
              <div
                key={size}
                className="absolute rounded-full border border-cosmic-gold"
                style={{
                  width: size, height: size,
                  top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  opacity: 0.03 + i * 0.02,
                  animation: `float ${7 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.6}s`,
                }}
              />
            ))}
          </div>

          <div className="container-cosmic relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Photo */}
              <Reveal>
                <div className="relative max-w-sm mx-auto lg:mx-0">
                  <div className="absolute -inset-4 rounded-sm border border-cosmic-gold/20" />
                  <div className="absolute -inset-2 rounded-sm border border-cosmic-gold/10" />

                  {/* SWAP THIS: replace the div below with <Image> when you have the real photo */}
                  {/* Real usage: <Image src="/images/dr-usha-bhatt.jpg" alt="Dr. Usha Bhatt" fill className="object-cover rounded-sm" /> */}
                  <div className="relative w-full aspect-[3/4] rounded-sm overflow-hidden">
                    <Image
                      src="/images/usha-aunty.jpg"
                      alt="Dr. Usha Bhatt — Psychic Healer & Tarot Grand Master"
                      fill
                      className="object-cover rounded-sm"
                      priority
                    />
                  </div>

                  {/* Floating badge */}
                  <div className="absolute -bottom-4 -right-4 bg-cosmic-deepPurple border border-cosmic-gold/40 px-4 py-3 shadow-gold">
                    <p className="font-cinzel text-cosmic-gold text-xs font-bold tracking-wider">20+ Years</p>
                    <p className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase">Experience</p>
                  </div>
                </div>
              </Reveal>

              {/* Bio text */}
              <Reveal delay={0.15}>
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h1
                  className="font-cinzel font-bold text-cosmic-cream leading-tight mb-2"
                  style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}
                >
                  Dr. Usha Bhatt
                </h1>
                <p className="font-cormorant italic text-cosmic-gold text-xl mb-6 leading-relaxed">
                  Renowned Psychic Healer, Tarot Grand Master &amp; Spiritual Guide
                </p>
                <div className="gold-divider mb-6" style={{ margin: '0 0 1.5rem 0' }} />

                <div className="space-y-4 font-cormorant text-cosmic-cream/70 text-lg leading-relaxed">
                  <p>
                    With over two decades of experience, Dr. Usha Bhatt is one of India&apos;s most
                    trusted and celebrated psychic healers. Her extraordinary gifts — clairvoyance,
                    deep empathy, and a profound connection to the spiritual realm — have guided
                    thousands of individuals toward clarity, healing, and transformation.
                  </p>
                  <p>
                    A certified Grand Master in Tarot Reading, Reiki, Crystal Therapy, and
                    Akashic Records Reading, Dr. Bhatt combines ancient wisdom with intuitive
                    insight to offer healing that is both deeply personal and powerfully effective.
                  </p>
                  <p>
                    Her warm, compassionate approach makes even the most complex spiritual
                    journeys feel safe, supported, and profoundly meaningful. Whether you seek
                    answers, healing, or spiritual growth — Dr. Bhatt meets you exactly where you are.
                  </p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-cosmic-gold/15">
                  {[
                    { num: '20+', label: 'Years Experience' },
                    { num: '5000+', label: 'Lives Touched' },
                    { num: '3+', label: 'National Awards' },
                  ].map(({ num, label }) => (
                    <div key={label} className="text-center">
                      <p className="font-cinzel text-cosmic-gold font-bold text-2xl leading-none">{num}</p>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mt-1">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 mt-8">
                  <button onClick={() => setCalendlyOpen(true)} className="btn-primary">
                    <Sparkles size={15} />
                    Book a Session
                  </button>
                  <Link href="/services" className="btn-outline">View All Services</Link>
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── MY JOURNEY ──────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-14">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-3">
                  The <span className="text-gradient-gold">Journey</span>
                </h2>
                <div className="gold-divider mb-4" />
                <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
                  Two decades of healing, learning, and spiritual service
                </p>
              </div>
            </Reveal>

            <div className="relative max-w-3xl mx-auto">
              {/* Vertical line */}
              <div
                className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-1/2"
                style={{ background: 'linear-gradient(180deg, transparent, rgba(201,168,76,0.35), transparent)' }}
              />

              <div className="space-y-8">
                {journeyMilestones.map((m, i) => (
                  <Reveal key={m.year} delay={i * 0.07}>
                    <div className={`flex gap-6 items-start ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}>

                      {/* Card */}
                      <div className="flex-1 cosmic-card p-6 ml-10 md:ml-0">
                        <div className="flex items-center gap-3 mb-3">
                          <span className="font-cinzel text-sm font-bold px-3 py-1 border border-cosmic-gold/30 text-cosmic-gold">
                            {m.year}
                          </span>
                          <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold">{m.title}</h3>
                        </div>
                        <p className="font-cormorant text-cosmic-cream/60 text-base leading-relaxed">{m.desc}</p>
                      </div>

                      {/* Centre dot — desktop */}
                      <div className="hidden md:flex shrink-0 w-4 h-4 rounded-full border-2 border-cosmic-gold bg-cosmic-black mt-5 z-10" />
                      <div className="hidden md:block flex-1" />

                      {/* Left dot — mobile */}
                      <div
                        className="md:hidden absolute left-4 w-4 h-4 rounded-full border-2 border-cosmic-gold bg-cosmic-black z-10"
                        style={{ marginTop: '1.25rem' }}
                      />
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── AWARDS ──────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-14">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-3">
                  Awards &amp; <span className="text-gradient-gold">Recognitions</span>
                </h2>
                <div className="gold-divider mb-4" />
                <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
                  Nationally and internationally recognised for excellence in spiritual healing
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {awards.map((award, i) => (
                <Reveal key={award.title} delay={i * 0.1}>
                  <div className="cosmic-card p-6 flex flex-col items-center text-center group">
                    {/* Placeholder — swap with <Image> when you have real cert photos */}
                    <div
                      className="w-full aspect-video rounded-sm mb-5 flex flex-col items-center justify-center relative overflow-hidden"
                      style={{
                        background: `linear-gradient(135deg, ${award.color}22, ${award.color}08)`,
                        border: `1px solid ${award.color}33`,
                      }}
                    >
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300">{award.emoji}</span>
                      <p className="absolute bottom-2 font-raleway text-cosmic-cream/20 text-xs tracking-widest uppercase">
                        Image placeholder
                      </p>
                    </div>

                    <span
                      className="font-raleway text-xs tracking-widest uppercase px-3 py-1 border mb-3 font-semibold"
                      style={{ color: award.color, borderColor: `${award.color}44` }}
                    >
                      {award.year}
                    </span>
                    <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold mb-2 leading-snug group-hover:text-cosmic-gold transition-colors">
                      {award.title}
                    </h3>
                    <p className="font-cormorant text-cosmic-cream/50 text-sm leading-relaxed">{award.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CERTIFICATIONS ──────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-14">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-3">
                  Education &amp; <span className="text-gradient-gold">Certifications</span>
                </h2>
                <div className="gold-divider mb-4" />
                <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
                  Formally trained and certified across all modalities of spiritual healing
                </p>
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {certifications.map((cert, i) => (
                <Reveal key={cert.title} delay={i * 0.08}>
                  <div className="cosmic-card p-6 flex gap-4 group">
                    <span className="text-3xl shrink-0 group-hover:scale-110 transition-transform duration-300">{cert.icon}</span>
                    <div>
                      <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold mb-2 leading-snug group-hover:text-cosmic-gold transition-colors">
                        {cert.title}
                      </h3>
                      <p className="font-cormorant text-cosmic-cream/55 text-sm leading-relaxed">{cert.body}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── GALLERY ─────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-14">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-3">
                  Photo <span className="text-gradient-gold">Gallery</span>
                </h2>
                <div className="gold-divider mb-4" />
                <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
                  A glimpse into Dr. Usha Bhatt&apos;s healing practice and spiritual journey
                </p>
              </div>
            </Reveal>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {galleryItems.map((item, i) => (
                <Reveal key={item.label} delay={i * 0.08}>
                  {/* SWAP: replace this div with <Image src={`/images/gallery/${item.file}`} ...> when you have photos */}
                  <div
                    className="relative aspect-square rounded-sm overflow-hidden group cursor-pointer border border-cosmic-gold/15 hover:border-cosmic-gold/40 transition-all duration-300"
                    style={{ background: 'linear-gradient(135deg, rgba(45,27,94,0.5), rgba(26,10,46,0.8))' }}
                  >
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-5xl mb-2 group-hover:scale-110 transition-transform duration-300">{item.emoji}</span>
                      <p className="font-raleway text-cosmic-cream/25 text-xs tracking-widest uppercase">Placeholder</p>
                    </div>
                    <div className="absolute inset-0 bg-cosmic-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4">
                      <p className="font-cinzel text-cosmic-gold text-xs font-semibold text-center mb-1">{item.label}</p>
                      <p className="font-cormorant text-cosmic-cream/60 text-sm text-center italic">{item.desc}</p>
                      <p className="font-raleway text-cosmic-cream/25 text-xs mt-2">/images/gallery/{item.file}</p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── QUOTE BANNER ────────────────────────────────────────────────── */}
        <section
          className="py-20 px-4 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.3), #1A0A2E, rgba(201,168,76,0.1))' }}
        >
          <div className="container-cosmic max-w-3xl text-center relative z-10">
            <Reveal>
              <Quote size={40} className="text-cosmic-gold/20 mx-auto mb-6" />
              <p
                className="font-cormorant italic text-cosmic-cream/80 leading-relaxed mb-6"
                style={{ fontSize: 'clamp(1.3rem, 3vw, 1.8rem)' }}
              >
                Every soul that comes to me carries its own unique story written across lifetimes.
                My purpose is simply to help you read it — and in reading it, to heal it.
              </p>
              <p className="font-cinzel text-cosmic-gold text-sm tracking-widest">— Dr. Usha Bhatt</p>
            </Reveal>
          </div>
        </section>

        {/* ── CTA ─────────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic text-center">
            <Reveal>
              <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
              <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                Begin Your Healing <span className="text-gradient-gold">Journey Today</span>
              </h2>
              <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8 max-w-xl mx-auto leading-relaxed">
                Whether you seek clarity, healing, or spiritual growth — Dr. Usha Bhatt is here
                to guide you with compassion, wisdom, and 20 years of expertise.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => setCalendlyOpen(true)} className="btn-primary">
                  <Sparkles size={15} />
                  Book a Session with Dr. Bhatt
                </button>
                <Link href="/services" className="btn-outline">Explore All Services</Link>
              </div>
            </Reveal>
          </div>
        </section>
      </Layout>

      <CalendlyPopup isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
    </>
  )
}