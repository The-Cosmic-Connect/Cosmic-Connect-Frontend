import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Clock, BookOpen, Users, Globe, MapPin,
  CheckCircle, ChevronDown, ChevronUp, Star, Play } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import EnrollModal from '@/components/courses/EnrollModal'
import { CourseData, courses } from '@/lib/coursesData'

// ── Scroll reveal ─────────────────────────────────────────────────────────────
function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true) },
      { threshold: 0.1 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(24px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  )
}

// ── Curriculum accordion item ──────────────────────────────────────────────────
function ModuleItem({ mod, index }: { mod: CourseData['curriculum'][0]; index: number }) {
  const [open, setOpen] = useState(index === 0)
  return (
    <Reveal delay={index * 0.06}>
      <div className="border border-cosmic-gold/15 hover:border-cosmic-gold/30 transition-colors">
        <button
          onClick={() => setOpen(!open)}
          className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
        >
          <div className="flex items-center gap-3">
            <span
              className="shrink-0 w-7 h-7 rounded-full border flex items-center justify-center font-cinzel text-xs font-bold"
              style={{ borderColor: 'rgba(201,168,76,0.4)', color: '#C9A84C' }}
            >
              {index + 1}
            </span>
            <span className="font-cinzel text-sm text-cosmic-cream font-medium leading-snug">
              {mod.title}
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-raleway text-cosmic-cream/30 text-xs hidden sm:block">
              {mod.lessons.length} lessons
            </span>
            <span className="text-cosmic-gold/60">
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </span>
          </div>
        </button>

        {open && (
          <div className="px-6 pb-4 border-t border-cosmic-gold/10">
            <ul className="mt-3 space-y-2">
              {mod.lessons.map((lesson, i) => (
                <li key={i} className="flex items-start gap-3">
                  <Play size={11} className="text-cosmic-gold/40 mt-1 shrink-0" />
                  <span className="font-cormorant text-cosmic-cream/65 text-base leading-snug">
                    {lesson}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </Reveal>
  )
}

// ── Star rating ───────────────────────────────────────────────────────────────
function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={12}
          className={i < rating ? 'text-cosmic-gold fill-cosmic-gold' : 'text-cosmic-cream/20'}
        />
      ))}
    </div>
  )
}

// ── Main template ─────────────────────────────────────────────────────────────
export default function CoursePageTemplate({ course }: { course: CourseData }) {
  const [enrollOpen, setEnrollOpen]   = useState(false)
  const [enrollMode, setEnrollMode]   = useState<'online' | 'in-person' | null>(null)

  function openEnroll(mode: 'online' | 'in-person') {
    setEnrollMode(mode)
    setEnrollOpen(true)
  }

  const otherCourses = courses.filter(c => c.slug !== course.slug).slice(0, 3)

  return (
    <>
      <Layout title={course.seoTitle} description={course.seoDesc} canonical={`/courses/${course.slug}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Course',
              name: course.title,
              description: course.seoDesc,
              provider: { '@type': 'Organization', name: 'The Cosmic Connect', url: 'https://www.thecosmicconnect.com' },
              instructor: { '@type': 'Person', name: 'Dr. Usha Bhatt' },
              url: `https://www.thecosmicconnect.com/courses/${course.slug}`,
              courseMode: ['online', 'onsite'],
            }),
          }}
        />

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          className="relative min-h-[75vh] flex items-center overflow-hidden pt-24 pb-16"
          style={{ background: `linear-gradient(135deg, #0A0708 0%, ${course.accentColor}18 50%, #0A0708 100%)` }}
        >
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 50% at 65% 50%, ${course.accentColor}18, transparent 70%)` }}
          />

          {/* Decorative rings */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/3 pointer-events-none">
            {[380, 280, 180].map((size, i) => (
              <div key={size} className="absolute rounded-full border"
                style={{
                  width: size, height: size, top: '50%', left: '50%',
                  transform: 'translate(-50%,-50%)',
                  borderColor: `${course.accentColor}${18 + i * 12}`,
                  animation: `float ${6 + i * 2}s ease-in-out infinite`,
                  animationDelay: `${i * 0.5}s`,
                }}
              />
            ))}
          </div>

          <div className="container-cosmic relative z-10">
            <Link href="/courses"
              className="inline-flex items-center gap-2 text-cosmic-cream/40 hover:text-cosmic-gold transition-colors font-raleway text-xs tracking-widest uppercase mb-8">
              <ArrowLeft size={14} /> All Courses
            </Link>

            <div className="grid lg:grid-cols-5 gap-12 items-center">

              {/* Left — course info */}
              <div className="lg:col-span-3">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-5xl" style={{ filter: `drop-shadow(0 0 16px ${course.accentColor})` }}>
                    {course.icon}
                  </span>
                  <span className="font-raleway text-xs tracking-[0.4em] uppercase px-3 py-1 border"
                    style={{ color: course.accentColor, borderColor: `${course.accentColor}44` }}>
                    {course.level}
                  </span>
                </div>

                <h1 className="font-cinzel font-bold text-cosmic-cream leading-tight mb-3"
                  style={{ fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}>
                  {course.title}
                </h1>
                <p className="font-cormorant italic text-cosmic-cream/60 text-xl mb-6 leading-relaxed">
                  {course.tagline}
                </p>

                {/* Meta pills */}
                <div className="flex flex-wrap gap-3 mb-8">
                  {[
                    { icon: <Clock size={13} />, label: course.duration },
                    { icon: <BookOpen size={13} />, label: `${course.totalLessons} Lessons` },
                    { icon: <Globe size={13} />, label: course.language },
                    { icon: <Users size={13} />, label: `${course.seatsLeft} seats left` },
                  ].map(({ icon, label }) => (
                    <div key={label}
                      className="flex items-center gap-2 border border-cosmic-gold/20 px-3 py-1.5 text-cosmic-cream/60">
                      <span className="text-cosmic-gold/60">{icon}</span>
                      <span className="font-raleway text-xs tracking-wide">{label}</span>
                    </div>
                  ))}
                </div>

                {/* Instructor mini */}
                <div className="flex items-center gap-4 p-4 border border-cosmic-gold/15 bg-cosmic-gold/5 mb-8">
                  <div className="w-12 h-12 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-2xl shrink-0">
                    🧘‍♀️
                  </div>
                  <div>
                    <p className="font-cinzel text-cosmic-cream text-sm font-semibold">Dr. Usha Bhatt</p>
                    <p className="font-cormorant text-cosmic-cream/50 text-sm italic">
                      Psychic Healer · Tarot Grand Master · 20+ Years Experience
                    </p>
                  </div>
                </div>
              </div>

              {/* Right — pricing card */}
              <div className="lg:col-span-2">
                <div className="cosmic-card p-6">
                  <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-4">
                    Course Fee
                  </p>

                  {/* Online pricing */}
                  <div className="pb-4 mb-4 border-b border-cosmic-gold/10">
                    <div className="flex items-center gap-2 mb-1">
                      <Globe size={14} className="text-cosmic-gold/60" />
                      <span className="font-raleway text-xs text-cosmic-cream/50 tracking-widest uppercase">Online</span>
                    </div>
                    <p className="font-cinzel text-cosmic-gold font-bold text-2xl mb-3">
                      {course.priceOnline}
                    </p>
                    <button onClick={() => openEnroll('online')} className="btn-primary w-full justify-center">
                      Enroll — Online
                    </button>
                  </div>

                  {/* In-person pricing */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin size={14} className="text-cosmic-gold/60" />
                      <span className="font-raleway text-xs text-cosmic-cream/50 tracking-widest uppercase">
                        In-Person · New Delhi
                      </span>
                    </div>
                    <p className="font-cinzel text-cosmic-gold font-bold text-2xl mb-3">
                      {course.priceInPerson}
                    </p>
                    <button onClick={() => openEnroll('in-person')} className="btn-outline w-full justify-center">
                      Enroll — In-Person
                    </button>
                  </div>

                  {/* Next batch */}
                  <div className="pt-4 border-t border-cosmic-gold/10 text-center">
                    <p className="font-raleway text-cosmic-cream/30 text-xs tracking-widest uppercase mb-1">
                      Next Batch
                    </p>
                    <p className="font-cormorant text-cosmic-cream/60 text-sm italic">
                      {course.nextBatchDate}
                    </p>
                    <p className="font-raleway text-cosmic-gold/50 text-xs mt-2">
                      {course.seatsLeft} seats remaining
                    </p>
                  </div>
                </div>
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
                {course.intro}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── WHAT YOU LEARN + WHO IS IT FOR ────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic">
            <div className="grid lg:grid-cols-2 gap-12">

              <Reveal>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-4">
                  What You'll <span className="text-gradient-gold">Learn</span>
                </h2>
                <div className="gold-divider mb-6" style={{ margin: '0 0 1.5rem 0' }} />
                <ul className="space-y-3">
                  {course.whatYouLearn.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 group">
                      <CheckCircle size={16} className="shrink-0 mt-0.5 transition-colors"
                        style={{ color: course.accentColor }} />
                      <span className="font-cormorant text-cosmic-cream/70 text-lg leading-snug group-hover:text-cosmic-cream transition-colors">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              <Reveal delay={0.15}>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-4">
                  Who Is This <span className="text-gradient-gold">For?</span>
                </h2>
                <div className="gold-divider mb-6" style={{ margin: '0 0 1.5rem 0' }} />
                <div className="space-y-3">
                  {course.whoIsItFor.map((item, i) => (
                    <div key={i} className="cosmic-card p-4 flex items-start gap-3">
                      <span className="text-cosmic-gold/60 shrink-0 mt-0.5 font-cinzel">✦</span>
                      <p className="font-cormorant text-cosmic-cream/70 text-base leading-snug">{item}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── CURRICULUM ────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic max-w-4xl">
            <Reveal>
              <div className="text-center mb-12">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  Course <span className="text-gradient-gold">Curriculum</span>
                </h2>
                <div className="gold-divider mb-3" />
                <p className="font-cormorant text-cosmic-cream/50 text-base italic">
                  {course.curriculum.length} modules · {course.totalLessons} lessons · {course.duration}
                </p>
              </div>
            </Reveal>

            <div className="space-y-2">
              {course.curriculum.map((mod, i) => (
                <ModuleItem key={mod.title} mod={mod} index={i} />
              ))}
            </div>
          </div>
        </section>

        {/* ── INSTRUCTOR ────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic max-w-4xl">
            <Reveal>
              <div className="text-center mb-10">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  Your <span className="text-gradient-gold">Instructor</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>

            <Reveal delay={0.1}>
              <div className="cosmic-card p-8 flex flex-col md:flex-row gap-8 items-start">
                {/* Photo placeholder */}
                <div className="relative w-32 h-32 rounded-full overflow-hidden shrink-0 mx-auto md:mx-0 border-2 border-cosmic-gold/30 flex items-center justify-center text-5xl"
                  style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.4), rgba(26,10,46,0.8))' }}>
                  🧘‍♀️
                </div>

                <div className="flex-1">
                  <h3 className="font-cinzel text-cosmic-cream text-xl font-bold mb-1">Dr. Usha Bhatt</h3>
                  <p className="font-cormorant text-cosmic-gold italic text-base mb-4">
                    Psychic Healer · Tarot Grand Master · Reiki Grand Master · Honorary Doctorate
                  </p>
                  <div className="space-y-3 font-cormorant text-cosmic-cream/65 text-lg leading-relaxed">
                    <p>
                      Dr. Usha Bhatt has over two decades of experience in spiritual healing and
                      teaching. Her ability to break down complex spiritual concepts into clear,
                      practical, actionable lessons has made her one of India's most beloved
                      spiritual educators.
                    </p>
                    <p>
                      Certified as a Grand Master in Tarot, Reiki, Crystal Therapy and Akashic
                      Records Reading — and holder of an Honorary Doctorate in Spiritual Sciences —
                      Dr. Bhatt brings unparalleled depth, warmth, and wisdom to every course.
                    </p>
                  </div>
                  <Link href="/about"
                    className="inline-flex items-center gap-2 font-raleway text-xs text-cosmic-gold/60 hover:text-cosmic-gold tracking-widest uppercase mt-4 transition-colors">
                    Read Full Bio →
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-12">
                <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
                <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                  Student <span className="text-gradient-gold">Testimonials</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>

            <div className="grid sm:grid-cols-3 gap-5">
              {course.testimonials.map((t, i) => (
                <Reveal key={t.name} delay={i * 0.1}>
                  <div className="cosmic-card p-6 flex flex-col h-full">
                    <StarRating rating={t.rating} />
                    <p className="font-cormorant text-cosmic-cream/70 text-base leading-relaxed italic mt-4 flex-grow">
                      "{t.text}"
                    </p>
                    <div className="mt-5 pt-4 border-t border-cosmic-gold/10">
                      <p className="font-cinzel text-cosmic-cream text-sm font-semibold">{t.name}</p>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest mt-0.5">
                        {t.location}
                      </p>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FAQ ───────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-gradient">
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
              {course.faqs.map((faq, i) => {
                const [open, setOpen] = useState(false)
                return (
                  <Reveal key={i} delay={i * 0.07}>
                    <div className="border border-cosmic-gold/15 hover:border-cosmic-gold/35 transition-colors">
                      <button
                        onClick={() => setOpen(!open)}
                        className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
                      >
                        <span className="font-cinzel text-sm text-cosmic-cream font-medium leading-snug">
                          {faq.q}
                        </span>
                        <span className="text-cosmic-gold shrink-0">
                          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </span>
                      </button>
                      {open && (
                        <div className="px-6 pb-5 border-t border-cosmic-gold/10">
                          <p className="font-cormorant text-cosmic-cream/65 text-base leading-relaxed mt-3">
                            {faq.a}
                          </p>
                        </div>
                      )}
                    </div>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── CTA BANNER ────────────────────────────────────────────────── */}
        <section className="py-20 px-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${course.accentColor}28, #1A0A2E, ${course.accentColor}18)` }}>
          <div className="container-cosmic text-center relative z-10">
            <Reveal>
              <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
              <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
                Ready to Begin Your <span className="text-gradient-gold">Journey?</span>
              </h2>
              <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8 max-w-xl mx-auto">
                Join {course.title} with Dr. Usha Bhatt — online or in-person,
                limited seats available.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button onClick={() => openEnroll('online')} className="btn-primary">
                  <Globe size={15} /> Enroll Online — {course.priceOnline}
                </button>
                <button onClick={() => openEnroll('in-person')} className="btn-outline">
                  <MapPin size={15} /> Enroll In-Person — {course.priceInPerson}
                </button>
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── OTHER COURSES ─────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <Reveal>
              <div className="text-center mb-10">
                <h2 className="font-cinzel text-xl text-cosmic-cream font-bold mb-3">
                  More <span className="text-gradient-gold">Courses</span>
                </h2>
                <div className="gold-divider" />
              </div>
            </Reveal>
            <div className="grid sm:grid-cols-3 gap-5">
              {otherCourses.map((c, i) => (
                <Reveal key={c.slug} delay={i * 0.1}>
                  <Link href={`/courses/${c.slug}`} className="cosmic-card p-5 flex flex-col group">
                    <span className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                      {c.icon}
                    </span>
                    <h3 className="font-cinzel text-cosmic-cream text-sm font-semibold group-hover:text-cosmic-gold transition-colors mb-1">
                      {c.title}
                    </h3>
                    <p className="font-cormorant text-cosmic-cream/50 text-sm leading-snug mb-3 flex-grow">
                      {c.tagline}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-raleway text-cosmic-cream/30 text-xs">{c.duration}</span>
                      <span className="font-cinzel text-cosmic-gold text-sm font-bold">{c.priceOnline}</span>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>
      </Layout>

      <EnrollModal
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        course={course.title}
        mode={enrollMode}
      />
    </>
  )
}
