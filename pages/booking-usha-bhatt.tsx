import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { SERVICE_CATEGORIES } from '@/lib/serviceCategories'
import { Sparkles, Infinity, Zap, Music, ShieldAlert, Gem, Compass, ChevronRight, type LucideIcon } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const ICONS: Record<string, LucideIcon> = {
  Sparkles, Infinity, Zap, Music, ShieldAlert, Gem, Compass,
}

interface Agent { id: string; name: string; bio: string; photo: string; isActive: boolean }

export default function BookingUshaBhattPage() {
  const [agent,   setAgent]   = useState<Agent | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${API}/agents?active_only=true`)
      .then(r => r.json())
      .then(d => {
        const agents: Agent[] = d.agents || []
        setAgent(agents.find(a => a.name.toLowerCase().includes('usha')) || agents[0] || null)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <Layout
      title="Book with Dr. Usha Bhatt | The Cosmic Connect"
      description="Choose a category of spiritual guidance and healing with Dr. Usha Bhatt — tarot, past life, energy healing, sound healing, protection, crystal grids and more."
      canonical="/booking-usha-bhatt"
    >
      <section className="relative pt-36 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center max-w-2xl mx-auto">
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Begin Your Journey ✦</p>

          {loading ? (
            <div className="w-24 h-24 rounded-full bg-cosmic-gold/10 mx-auto mb-4 animate-pulse" />
          ) : agent?.photo ? (
            <img src={agent.photo} alt={agent.name}
              className="w-24 h-24 rounded-full object-cover border-2 border-cosmic-gold/40 mx-auto mb-4" />
          ) : (
            <div className="w-24 h-24 rounded-full border-2 border-cosmic-gold/40 bg-cosmic-deepPurple flex items-center justify-center text-cosmic-gold text-3xl font-cinzel mx-auto mb-4">
              {(agent?.name || 'U')[0]}
            </div>
          )}

          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Book with <span className="text-gradient-gold">{agent?.name || 'Dr. Usha Bhatt'}</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl">
            Choose the path that calls to you
          </p>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic max-w-4xl">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {SERVICE_CATEGORIES.map(cat => {
              const Icon = ICONS[cat.icon] || Sparkles
              return (
                <Link key={cat.slug} href={`/${cat.slug}`}
                  className="group text-left p-6 border border-cosmic-gold/20 bg-cosmic-deepPurple/30
                    hover:border-cosmic-gold/50 hover:bg-cosmic-deepPurple/60 hover:-translate-y-1
                    transition-all duration-300 rounded-sm">
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 shrink-0 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-cosmic-gold">
                      <Icon size={18} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-cinzel text-cosmic-cream font-semibold mb-1 flex items-center gap-2">
                        {cat.title}
                        <ChevronRight size={14} className="text-cosmic-gold/30 group-hover:text-cosmic-gold group-hover:translate-x-0.5 transition-all" />
                      </h3>
                      <p className="font-cormorant text-cosmic-cream/60 text-sm italic leading-relaxed">
                        {cat.tagline}
                      </p>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </Layout>
  )
}
