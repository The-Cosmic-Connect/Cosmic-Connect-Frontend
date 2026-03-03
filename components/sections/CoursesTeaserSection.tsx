import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { Clock, Users, Star } from 'lucide-react'

const courses = [
  {
    title: 'Psychic Development',
    level: 'Beginner to Advanced',
    duration: '8 Weeks',
    students: '200+',
    rating: '4.9',
    description:
      'Unlock your innate psychic abilities. Learn to read energy, develop clairvoyance, and strengthen your intuition.',
    topics: ['Energy Reading', 'Clairvoyance', 'Intuition', 'Aura Scanning'],
    accent: '#4A2C8A',
    emoji: '🔮',
  },
  {
    title: 'Tarot Mastery',
    level: 'All Levels',
    duration: '6 Weeks',
    students: '350+',
    rating: '5.0',
    description:
      'Master the 78 cards of Tarot. Learn to perform accurate readings for love, career, and spiritual growth.',
    topics: ['Major Arcana', 'Minor Arcana', 'Spreads', 'Interpretation'],
    accent: '#8B3A52',
    emoji: '🃏',
  },
  {
    title: 'Crystal Therapy',
    level: 'Beginner',
    duration: '4 Weeks',
    students: '180+',
    rating: '4.8',
    description:
      'Learn to harness the healing power of crystals. Understand crystal grids, chakra alignment, and energy healing.',
    topics: ['Crystal Properties', 'Chakras', 'Grids', 'Cleansing'],
    accent: '#1A5C6B',
    emoji: '💎',
  },
  {
    title: 'Spiritual Awareness',
    level: 'All Levels',
    duration: '5 Weeks',
    students: '400+',
    rating: '4.9',
    description:
      'Deepen your spiritual understanding. Explore meditation, manifestation, karma, and soul purpose.',
    topics: ['Meditation', 'Manifestation', 'Karma', 'Soul Purpose'],
    accent: '#C9A84C',
    emoji: '🌟',
  },
]

function CourseCard({ course, index }: { course: typeof courses[0]; index: number }) {
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
      className="cosmic-card p-6 flex flex-col group"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(32px)',
        transition: `opacity 0.6s ease ${index * 0.12}s, transform 0.6s ease ${index * 0.12}s`,
      }}
    >
      {/* Top accent bar */}
      <div
        className="h-0.5 w-full mb-5 -mx-6 px-6"
        style={{
          width: 'calc(100% + 3rem)',
          marginLeft: '-1.5rem',
          background: `linear-gradient(90deg, ${course.accent}, transparent)`,
        }}
      />

      {/* Icon + Level */}
      <div className="flex items-start justify-between mb-4">
        <span className="text-4xl group-hover:scale-110 transition-transform duration-300">
          {course.emoji}
        </span>
        <span
          className="font-raleway text-xs tracking-widest uppercase px-3 py-1 border rounded-full"
          style={{ color: course.accent, borderColor: `${course.accent}44` }}
        >
          {course.level}
        </span>
      </div>

      {/* Title */}
      <h3 className="font-cinzel text-cosmic-cream font-semibold text-base mb-2 group-hover:text-cosmic-gold transition-colors">
        {course.title}
      </h3>

      {/* Description */}
      <p className="font-cormorant text-cosmic-cream/60 text-base leading-relaxed mb-4 flex-grow">
        {course.description}
      </p>

      {/* Topics */}
      <div className="flex flex-wrap gap-1.5 mb-5">
        {course.topics.map(topic => (
          <span
            key={topic}
            className="text-xs font-raleway text-cosmic-cream/40 bg-cosmic-purple/30 px-2 py-0.5 rounded"
          >
            {topic}
          </span>
        ))}
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 pt-4 border-t border-cosmic-gold/10">
        <div className="flex items-center gap-1.5 text-cosmic-cream/40">
          <Clock size={12} />
          <span className="font-raleway text-xs">{course.duration}</span>
        </div>
        <div className="flex items-center gap-1.5 text-cosmic-cream/40">
          <Users size={12} />
          <span className="font-raleway text-xs">{course.students} enrolled</span>
        </div>
        <div className="flex items-center gap-1.5 text-cosmic-gold/70 ml-auto">
          <Star size={12} className="fill-cosmic-gold" />
          <span className="font-raleway text-xs font-semibold">{course.rating}</span>
        </div>
      </div>
    </div>
  )
}

export default function CoursesTeaserSection() {
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

        {/* Header */}
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
            Courses We <span className="text-gradient-gold">Offer</span>
          </h2>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto">
            Learn the transformative power of holistic healing with Dr. Usha Bhatt — expertly
            designed courses for every level
          </p>
        </div>

        {/* Course grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
          {courses.map((course, i) => (
            <CourseCard key={course.title} course={course} index={i} />
          ))}
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/courses" className="btn-primary">
            View All Courses
          </Link>
          <p className="font-cormorant text-cosmic-cream/40 text-base italic mt-4">
            Online &amp; in-person batches available — limited seats
          </p>
        </div>

      </div>
    </section>
  )
}
