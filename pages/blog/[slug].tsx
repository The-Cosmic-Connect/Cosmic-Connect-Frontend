import { GetServerSideProps } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Clock, Eye, Share2, Twitter, Facebook, Link2 } from 'lucide-react'
import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import BlogCard, { PostSummary } from '@/components/blog/BlogCard'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface BlogPost extends PostSummary {
  content:     string
  seoTitle:    string
  seoDesc:     string
  metaKeywords?: string
  updatedAt:   string
}

interface Props {
  post:    BlogPost
  related: PostSummary[]
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

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString('en-IN', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  } catch { return '' }
}

export default function BlogPostPage({ post, related }: Props) {
  const [copied, setCopied] = useState(false)
  const accentColor = CATEGORY_COLOURS[post.category] || '#4A2C8A'
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecosmicconnect.com'
  const postUrl = `${siteUrl}/blog/${post.slug}`

  function copyLink() {
    navigator.clipboard.writeText(postUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <Layout
      title={post.seoTitle || post.title}
      description={post.seoDesc || post.excerpt}
      canonical={`/blog/${post.slug}`}
    >
      {/* Article schema */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline:        post.title,
        description:     post.excerpt,
        author:          { '@type': 'Person', name: 'Dr. Usha Bhatt' },
        publisher:       { '@type': 'Organization', name: 'The Cosmic Connect', url: siteUrl },
        datePublished:   post.createdAt,
        dateModified:    post.updatedAt,
        url:             postUrl,
        image:           post.coverImage || `${siteUrl}/images/og-default.jpg`,
        keywords:        post.tags?.join(', '),
      })}} />

      {/* Hero */}
      <section className="relative pt-24 pb-0 overflow-hidden"
        style={{ background: `linear-gradient(180deg, ${accentColor}18 0%, #0A0708 100%)` }}>

        {post.coverImage && (
          <div className="relative w-full h-72 md:h-96 overflow-hidden">
            <Image src={post.coverImage} alt={post.title} fill
              className="object-cover opacity-40" priority />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to bottom, transparent 40%, #0A0708 100%)' }} />
          </div>
        )}

        <div className="container-cosmic max-w-3xl relative z-10 pb-8"
          style={{ marginTop: post.coverImage ? '-120px' : '0' }}>

          <Link href="/blog"
            className="inline-flex items-center gap-2 text-cosmic-cream/40 hover:text-cosmic-gold transition-colors font-raleway text-xs tracking-widest uppercase mb-6">
            <ArrowLeft size={13} /> All Articles
          </Link>

          {/* Category + meta */}
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <Link href={`/blog?category=${encodeURIComponent(post.category)}`}
              className="font-raleway text-xs tracking-widest uppercase px-3 py-1"
              style={{ background: `${accentColor}30`, color: accentColor, border: `1px solid ${accentColor}44` }}>
              {post.category}
            </Link>
            <span className="font-raleway text-cosmic-cream/40 text-xs flex items-center gap-1">
              <Clock size={11} /> {post.readTime} min read
            </span>
            <span className="font-raleway text-cosmic-cream/40 text-xs flex items-center gap-1">
              <Eye size={11} /> {post.viewCount} views
            </span>
          </div>

          <h1 className="font-cinzel font-bold text-cosmic-cream leading-tight mb-4"
            style={{ fontSize: 'clamp(1.6rem, 4vw, 2.5rem)' }}>
            {post.title}
          </h1>

          <p className="font-cormorant italic text-cosmic-cream/60 text-xl leading-relaxed mb-6">
            {post.excerpt}
          </p>

          {/* Author + date + share */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-cosmic-gold/15">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-lg">
                🧘‍♀️
              </div>
              <div>
                <p className="font-cinzel text-cosmic-cream text-sm font-semibold">{post.author}</p>
                <p className="font-raleway text-cosmic-cream/40 text-xs">{formatDate(post.createdAt)}</p>
              </div>
            </div>

            {/* Share buttons */}
            <div className="flex items-center gap-2">
              <span className="font-raleway text-cosmic-cream/30 text-xs tracking-widest uppercase mr-1">Share</span>
              <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(postUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-cosmic-gold/20 flex items-center justify-center text-cosmic-cream/50 hover:text-cosmic-gold hover:border-cosmic-gold/50 transition-colors">
                <Twitter size={13} />
              </a>
              <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`}
                target="_blank" rel="noopener noreferrer"
                className="w-8 h-8 border border-cosmic-gold/20 flex items-center justify-center text-cosmic-cream/50 hover:text-cosmic-gold hover:border-cosmic-gold/50 transition-colors">
                <Facebook size={13} />
              </a>
              <button onClick={copyLink}
                className="w-8 h-8 border border-cosmic-gold/20 flex items-center justify-center text-cosmic-cream/50 hover:text-cosmic-gold hover:border-cosmic-gold/50 transition-colors relative">
                <Link2 size={13} />
                {copied && (
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 font-raleway text-xs bg-cosmic-gold text-cosmic-black px-2 py-0.5 whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="py-12 px-4">
        <div className="container-cosmic max-w-3xl">
          <div
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-10 pt-6 border-t border-cosmic-gold/10">
              {post.tags.map(tag => (
                <Link key={tag} href={`/blog?search=${encodeURIComponent(tag)}`}
                  className="font-raleway text-xs tracking-widest uppercase px-3 py-1 border border-cosmic-gold/20 text-cosmic-cream/40 hover:text-cosmic-gold hover:border-cosmic-gold/40 transition-colors">
                  #{tag}
                </Link>
              ))}
            </div>
          )}

          {/* Author box */}
          <div className="mt-10 p-6 border border-cosmic-gold/20 bg-cosmic-gold/5 flex gap-5 items-start">
            <div className="w-16 h-16 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-3xl shrink-0">
              🧘‍♀️
            </div>
            <div>
              <p className="font-cinzel text-cosmic-cream font-semibold mb-0.5">Dr. Usha Bhatt</p>
              <p className="font-cormorant text-cosmic-gold/70 italic text-sm mb-2">
                Psychic Healer · Tarot Grand Master · Reiki Grand Master
              </p>
              <p className="font-cormorant text-cosmic-cream/60 text-base leading-relaxed">
                With over 20 years of experience in spiritual healing and teaching, Dr. Usha Bhatt
                has guided thousands toward clarity, healing, and spiritual growth. Based in New Delhi,
                she offers readings, healing sessions, and certified courses both online and in-person.
              </p>
              <Link href="/about"
                className="inline-block font-raleway text-xs text-cosmic-gold/60 hover:text-cosmic-gold tracking-widest uppercase mt-3 transition-colors">
                Read Full Bio →
              </Link>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-10 p-8 text-center border border-cosmic-gold/20"
            style={{ background: 'linear-gradient(135deg, rgba(74,44,138,0.15), rgba(26,10,46,0.3))' }}>
            <p className="ornament text-xs tracking-[0.5em] mb-3">✦ ✦ ✦</p>
            <p className="font-cinzel text-cosmic-cream text-lg font-bold mb-2">
              Ready for a Personal Session?
            </p>
            <p className="font-cormorant text-cosmic-cream/60 italic mb-5">
              Book a one-on-one reading or healing session with Dr. Usha Bhatt
            </p>
            <Link href="/services" className="btn-primary inline-flex">
              Explore Sessions
            </Link>
          </div>
        </div>
      </article>

      {/* Related posts */}
      {related.length > 0 && (
        <section className="section bg-cosmic-section">
          <div className="container-cosmic">
            <div className="text-center mb-8">
              <p className="ornament text-xs tracking-[0.5em] mb-3">✦ ✦ ✦</p>
              <h2 className="font-cinzel text-xl text-cosmic-cream font-bold mb-2">
                Related <span className="text-gradient-gold">Articles</span>
              </h2>
              <div className="gold-divider" />
            </div>
            <div className="grid sm:grid-cols-3 gap-5">
              {related.map((p, i) => (
                <BlogCard key={p.id} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}
    </Layout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const slug = params?.slug as string
  try {
    const [postRes, relRes] = await Promise.all([
      fetch(`${API}/blog/slug/${slug}`),
      fetch(`${API}/blog/slug/${slug}`).then(r => r.json()).then(post =>
        post?.id
          ? fetch(`${API}/blog/related/${post.id}?category=${encodeURIComponent(post.category)}`)
          : Promise.resolve(null)
      ),
    ])

    if (!postRes.ok) return { notFound: true }
    const post = await postRes.json()
    const related = relRes ? await (relRes as Response).json().then(d => d.posts || []) : []

    return { props: { post, related } }
  } catch {
    return { notFound: true }
  }
}
