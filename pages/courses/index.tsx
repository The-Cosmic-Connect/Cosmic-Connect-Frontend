import { useState } from 'react'
import Link from 'next/link'
import { Clock, BookOpen, Globe, MapPin, Sparkles } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { courses } from '@/lib/coursesData'
import EnrollModal from '@/components/courses/EnrollModal'

const LEVELS = ['All', 'Beginner', 'All Levels', 'Beginner to Advanced']

export default function CoursesPage() {
  const [filter, setFilter]     = useState('All')
  const [enrollOpen, setEnrollOpen] = useState(false)
  const [enrollCourse, setEnrollCourse] = useState('')

  const filtered = filter === 'All'
    ? courses
    : courses.filter(c => c.level === filter)

  return (
    <>
      <Layout
        title="Spiritual Courses | Dr. Usha Bhatt | The Cosmic Connect"
        description="Learn Tarot, Psychic Development, Crystal Therapy and Spiritual Awareness with Dr. Usha Bhatt. Online & in-person certified courses. Enroll now."
        canonical="/courses"
      >
        {/* Hero */}
        <section className="relative pt-36 pb-12 px-4 bg-cosmic-gradient overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
            style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,44,138,0.2), transparent 70%)' }}
          />
          <div className="container-cosmic relative z-10 text-center">
            <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
            <h1 className="font-cinzel font-bold text-cosmic-cream mb-3"
              style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              Spiritual <span className="text-gradient-gold">Courses</span>
            </h1>
            <div className="gold-divider mb-4" />
            <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-2xl mx-auto leading-relaxed">
              Learn from Dr. Usha Bhatt — certified Tarot Grand Master, Reiki Healer,
              and spiritual guide with 20+ years of experience
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {[
                '✦ Certified Courses',
                '✦ Online & In-Person',
                '✦ Hindi & English',
                '✦ Small Batch Sizes',
              ].map(b => (
                <span key={b} className="font-raleway text-cosmic-cream/40 text-xs tracking-widest">{b}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Level filter */}
        <div className="sticky top-16 z-30 bg-cosmic-deepPurple/95 backdrop-blur-md border-b border-cosmic-gold/10">
          <div className="container-cosmic py-3 flex items-center gap-2 overflow-x-auto scrollbar-none">
            {LEVELS.map(level => (
              <button
                key={level}
                onClick={() => setFilter(level)}
                className={`shrink-0 font-raleway text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200 ${
                  filter === level
                    ? 'border-cosmic-gold bg-cosmic-gold/10 text-cosmic-gold'
                    : 'border-cosmic-gold/20 text-cosmic-cream/50 hover:border-cosmic-gold/40 hover:text-cosmic-cream/70'
                }`}
              >
                {level}
              </button>
            ))}
            <p className="ml-auto shrink-0 font-raleway text-cosmic-cream/30 text-xs tracking-widest">
              {filtered.length} course{filtered.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Course cards */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <div className="grid md:grid-cols-2 xl:grid-cols-2 gap-6">
              {filtered.map((course, i) => (
                <div key={course.slug}
                  className="cosmic-card group overflow-hidden flex flex-col"
                  style={{
                    opacity: 1,
                    borderTop: `3px solid ${course.accentColor}`,
                  }}
                >
                  {/* Card header */}
                  <div className="p-6 pb-4"
                    style={{ background: `linear-gradient(135deg, ${course.accentColor}12, transparent)` }}>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
                        {course.icon}
                      </span>
                      <span className="font-raleway text-xs tracking-widest uppercase px-3 py-1 border shrink-0"
                        style={{ color: course.accentColor, borderColor: `${course.accentColor}44` }}>
                        {course.level}
                      </span>
                    </div>
                    <h2 className="font-cinzel text-xl text-cosmic-cream font-bold mt-3 mb-1 group-hover:text-cosmic-gold transition-colors">
                      {course.title}
                    </h2>
                    <p className="font-cormorant text-cosmic-cream/60 text-base italic leading-snug">
                      {course.tagline}
                    </p>
                  </div>

                  {/* Meta row */}
                  <div className="px-6 py-3 border-t border-b border-cosmic-gold/10 flex flex-wrap gap-4">
                    {[
                      { icon: <Clock size={12} />, label: course.duration },
                      { icon: <BookOpen size={12} />, label: `${course.totalLessons} lessons` },
                      { icon: <Globe size={12} />, label: course.language },
                    ].map(({ icon, label }) => (
                      <div key={label} className="flex items-center gap-1.5 text-cosmic-cream/40">
                        <span className="text-cosmic-gold/50">{icon}</span>
                        <span className="font-raleway text-xs tracking-wide">{label}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pricing + CTA */}
                  <div className="p-6 mt-auto">
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <Globe size={11} className="text-cosmic-gold/50" />
                          <span className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">Online</span>
                        </div>
                        <p className="font-cinzel text-cosmic-gold font-bold text-lg">{course.priceOnline}</p>
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5 mb-1">
                          <MapPin size={11} className="text-cosmic-gold/50" />
                          <span className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">In-Person</span>
                        </div>
                        <p className="font-cinzel text-cosmic-gold font-bold text-lg">{course.priceInPerson}</p>
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <Link href={`/courses/${course.slug}`} className="btn-outline flex-1 justify-center text-xs py-2.5">
                        View Details
                      </Link>
                      <button
                        onClick={() => { setEnrollCourse(course.title); setEnrollOpen(true) }}
                        className="btn-primary flex-1 justify-center text-xs py-2.5"
                      >
                        <Sparkles size={12} /> Enroll Now
                      </button>
                    </div>

                    <p className="font-raleway text-cosmic-cream/25 text-xs text-center mt-3">
                      {course.seatsLeft} seats remaining · {course.nextBatchDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA */}
        <section className="section bg-cosmic-gradient">
          <div className="container-cosmic text-center max-w-2xl">
            <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
            <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
              Not Sure Which Course Is <span className="text-gradient-gold">Right For You?</span>
            </h2>
            <p className="font-cormorant text-cosmic-cream/60 text-lg italic mb-8 leading-relaxed">
              WhatsApp Dr. Bhatt's team and we'll help you choose the perfect starting point
              for your unique spiritual journey.
            </p>
            <a
              href="https://wa.me/919599474758?text=Hello%2C%20I%27d%20like%20to%20know%20more%20about%20your%20courses"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex"
            >
              <Sparkles size={15} /> WhatsApp Us for Guidance
            </a>
          </div>
        </section>
      </Layout>

      <EnrollModal
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        course={enrollCourse}
        mode={null}
      />
    </>
  )
}
