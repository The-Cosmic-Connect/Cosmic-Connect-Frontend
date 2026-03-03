import { useState, useEffect } from 'react'
import { Search, X } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import BlogCard, { PostSummary } from '@/components/blog/BlogCard'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function BlogPage() {
  const [posts,      setPosts]      = useState<PostSummary[]>([])
  const [categories, setCategories] = useState<string[]>(['All'])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search,     setSearch]     = useState('')
  const [loading,    setLoading]    = useState(true)

  useEffect(() => {
    setLoading(true)
    const params = new URLSearchParams()
    if (activeCategory !== 'All') params.set('category', activeCategory)
    if (search.trim())            params.set('search',   search.trim())

    fetch(`${API}/blog?${params}`)
      .then(r => r.json())
      .then(data => {
        setPosts(data.posts || [])
        if (data.categories) setCategories(data.categories)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [activeCategory, search])

  const featured = posts[0]
  const rest     = posts.slice(1)

  return (
    <Layout
      title="Blog | Spiritual Insights by Dr. Usha Bhatt | The Cosmic Connect"
      description="Expert articles on Tarot, healing crystals, Reiki, Akashic Records, chakras and spiritual growth by Dr. Usha Bhatt — Psychic Healer and Tarot Grand Master."
      canonical="/blog"
    >
      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 bg-cosmic-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,44,138,0.18), transparent 70%)' }}
        />
        <div className="container-cosmic relative z-10 text-center">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Spiritual <span className="text-gradient-gold">Insights</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto">
            Wisdom on Tarot, crystals, healing, and the spiritual path — by Dr. Usha Bhatt
          </p>
        </div>
      </section>

      {/* Sticky toolbar */}
      <div className="sticky top-16 z-30 bg-cosmic-deepPurple/95 backdrop-blur-md border-b border-cosmic-gold/10">
        <div className="container-cosmic py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3">

          {/* Search */}
          <div className="flex items-center gap-2 border border-cosmic-gold/20 px-3 w-full sm:max-w-xs">
            <Search size={13} className="text-cosmic-cream/30 shrink-0" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent font-raleway text-xs text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-2 w-full"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-cosmic-cream/30 hover:text-cosmic-gold">
                <X size={12} />
              </button>
            )}
          </div>

          {/* Category pills */}
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-1 sm:pb-0">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`shrink-0 font-raleway text-xs tracking-widest uppercase px-3 py-1.5 border transition-all duration-200 ${
                  activeCategory === cat
                    ? 'border-cosmic-gold bg-cosmic-gold/10 text-cosmic-gold'
                    : 'border-cosmic-gold/20 text-cosmic-cream/50 hover:border-cosmic-gold/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <p className="ml-auto shrink-0 font-raleway text-cosmic-cream/30 text-xs tracking-widest hidden sm:block">
            {posts.length} article{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      </div>

      {/* Content */}
      <section className="section bg-cosmic-section">
        <div className="container-cosmic">
          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="cosmic-card animate-pulse">
                  <div className="aspect-video bg-cosmic-gold/5" />
                  <div className="p-5 space-y-3">
                    <div className="h-3 bg-cosmic-gold/5 rounded w-1/3" />
                    <div className="h-4 bg-cosmic-gold/8 rounded" />
                    <div className="h-4 bg-cosmic-gold/5 rounded w-5/6" />
                    <div className="h-3 bg-cosmic-gold/5 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-24">
              <span className="text-6xl block mb-4">✦</span>
              <p className="font-cinzel text-cosmic-cream/40 text-sm">No articles found</p>
              <p className="font-cormorant text-cosmic-cream/30 italic mt-1">
                Try a different category or search term
              </p>
              <button
                onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="btn-outline mt-6 text-xs"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <>
              {/* Featured post */}
              {featured && !search && activeCategory === 'All' && (
                <div className="mb-8">
                  <BlogCard post={featured} featured />
                </div>
              )}

              {/* Grid */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {(search || activeCategory !== 'All' ? posts : rest).map((post, i) => (
                  <BlogCard key={post.id} post={post} index={i} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </Layout>
  )
}
