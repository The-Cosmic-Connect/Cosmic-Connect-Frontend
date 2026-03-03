import Link from 'next/link'
import Image from 'next/image'
import { Clock, Tag } from 'lucide-react'

export interface PostSummary {
  id:          string
  slug:        string
  title:       string
  category:    string
  excerpt:     string
  coverImage:  string
  readTime:    number
  tags:        string[]
  author:      string
  createdAt:   string
  viewCount:   number
}

interface Props {
  post:    PostSummary
  index?:  number
  featured?: boolean
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return '' }
}

const CATEGORY_COLOURS: Record<string, string> = {
  'Tarot & Divination':  '#4A2C8A',
  'Crystals & Gemstones':'#1A5C6B',
  'Spiritual Healing':   '#8B3A52',
  'Energy Work':         '#5C3A1A',
  'Meditation':          '#2A5C3A',
  'Manifestation':       '#C9A84C',
  'Astrology':           '#3A4A8A',
  'General':             '#4A4A4A',
}

export default function BlogCard({ post, index = 0, featured = false }: Props) {
  const accentColor = CATEGORY_COLOURS[post.category] || '#4A2C8A'

  if (featured) {
    return (
      <Link href={`/blog/${post.slug}`}
        className="cosmic-card group overflow-hidden flex flex-col md:flex-row"
        style={{ borderTop: `3px solid ${accentColor}` }}
      >
        {/* Cover image */}
        <div className="relative md:w-2/5 aspect-video md:aspect-auto overflow-hidden">
          {post.coverImage ? (
            <Image src={post.coverImage} alt={post.title} fill
              className="object-cover group-hover:scale-105 transition-transform duration-500" />
          ) : (
            <div className="w-full h-full min-h-[200px] flex items-center justify-center text-5xl"
              style={{ background: `linear-gradient(135deg, ${accentColor}30, #0A0708)` }}>
              ✦
            </div>
          )}
          <span className="absolute top-3 left-3 font-raleway text-xs tracking-widest uppercase px-2 py-1"
            style={{ background: accentColor, color: '#F5EDD6' }}>
            Featured
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-3">
            <span className="font-raleway text-xs tracking-widest uppercase"
              style={{ color: accentColor }}>{post.category}</span>
            <span className="text-cosmic-cream/20">·</span>
            <span className="font-raleway text-cosmic-cream/40 text-xs flex items-center gap-1">
              <Clock size={11} />{post.readTime} min read
            </span>
          </div>

          <h2 className="font-cinzel text-xl font-bold text-cosmic-cream group-hover:text-cosmic-gold transition-colors mb-3 leading-snug">
            {post.title}
          </h2>
          <p className="font-cormorant text-cosmic-cream/65 text-base italic leading-relaxed flex-grow mb-4">
            {post.excerpt}
          </p>

          <div className="flex items-center justify-between">
            <div>
              <p className="font-cinzel text-cosmic-cream/70 text-xs font-semibold">{post.author}</p>
              <p className="font-raleway text-cosmic-cream/30 text-xs mt-0.5">{formatDate(post.createdAt)}</p>
            </div>
            <span className="font-raleway text-xs text-cosmic-gold/60 tracking-widest group-hover:text-cosmic-gold transition-colors">
              Read More →
            </span>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <Link href={`/blog/${post.slug}`}
      className="cosmic-card group overflow-hidden flex flex-col"
      style={{
        borderTop: `3px solid ${accentColor}`,
        opacity: 1,
        transition: `opacity 0.5s ease ${(index % 6) * 0.07}s`,
      }}
    >
      {/* Cover image */}
      <div className="relative aspect-video overflow-hidden">
        {post.coverImage ? (
          <Image src={post.coverImage} alt={post.title} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl"
            style={{ background: `linear-gradient(135deg, ${accentColor}25, #0A0708)` }}>
            ✦
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <span className="font-raleway text-xs tracking-widest uppercase"
            style={{ color: accentColor }}>{post.category}</span>
          <span className="text-cosmic-cream/20">·</span>
          <span className="font-raleway text-cosmic-cream/40 text-xs flex items-center gap-1">
            <Clock size={10} />{post.readTime} min
          </span>
        </div>

        <h3 className="font-cinzel text-sm font-bold text-cosmic-cream group-hover:text-cosmic-gold transition-colors mb-2 leading-snug line-clamp-2">
          {post.title}
        </h3>
        <p className="font-cormorant text-cosmic-cream/60 text-base italic leading-snug line-clamp-2 flex-grow mb-4">
          {post.excerpt}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-cosmic-gold/10">
          <p className="font-raleway text-cosmic-cream/30 text-xs">{formatDate(post.createdAt)}</p>
          <span className="font-raleway text-xs text-cosmic-gold/50 tracking-widest group-hover:text-cosmic-gold transition-colors">
            Read →
          </span>
        </div>
      </div>
    </Link>
  )
}
