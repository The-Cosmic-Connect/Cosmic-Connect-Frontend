import { useState, useEffect } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { useGeo } from '@/context/GeoContext'
import { Clock, ChevronLeft } from 'lucide-react'
import type { ServiceCategory } from '@/lib/serviceCategories'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AgentService { serviceId: string; priceINR: number; priceUSD: number; bufferMins: number }
interface Agent { id: string; name: string; photo: string; isActive: boolean; services: AgentService[] }
interface Service {
  id: string; name: string; description: string
  durationMins: number; isActive: boolean; category?: string
}
interface CmsPageSummary { slug: string; boundServiceId: string | null }

interface Props {
  category: ServiceCategory
}

export default function ServiceCategoryPageTemplate({ category }: Props) {
  const { isIndia, symbol } = useGeo()
  const [agent,    setAgent]    = useState<Agent | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [loading,  setLoading]  = useState(true)
  // service id -> bound + published CMS page slug, for each service's own
  // "Know More" button (separate from the category-level one on
  // /booking-usha-bhatt — see admin's CMS tab).
  const [knowMoreSlugs, setKnowMoreSlugs] = useState<Record<string, string>>({})

  useEffect(() => {
    Promise.all([
      fetch(`${API}/agents?active_only=true`).then(r => r.json()),
      fetch(`${API}/services?active_only=true&category=${category.slug}`).then(r => r.json()),
    ]).then(([agentData, serviceData]) => {
      const agents: Agent[] = agentData.agents || []
      // Usha Bhatt is currently the only active healer. Preferring a name
      // match keeps this correct once more healers are added — falls back
      // to the first active agent if no match is found.
      const usha = agents.find(a => a.name.toLowerCase().includes('usha')) || agents[0] || null
      setAgent(usha)
      setServices(serviceData.services || [])
      setLoading(false)
    }).catch(() => setLoading(false))

    fetch(`${API}/cms-pages?published_only=true`)
      .then(r => r.json())
      .then(d => {
        const map: Record<string, string> = {}
        for (const p of (d.pages || []) as CmsPageSummary[]) {
          if (p.boundServiceId) map[p.boundServiceId] = p.slug
        }
        setKnowMoreSlugs(map)
      })
      .catch(() => {})
  }, [category.slug])

  function getPrice(service: Service): number {
    const as = agent?.services.find(s => s.serviceId === service.id)
    if (!as) return 0
    return isIndia ? as.priceINR : as.priceUSD
  }

  return (
    <Layout
      title={`${category.title} | The Cosmic Connect`}
      description={category.tagline}
      canonical={`/${category.slug}`}
    >
      <section className="relative pt-36 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgb(var(--cosmic-gold) / 0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center max-w-2xl mx-auto">
          <Link href="/booking-usha-bhatt"
            className="inline-flex items-center gap-1 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-6 transition-colors">
            <ChevronLeft size={14} /> All Categories
          </Link>
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            {category.title}
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl">
            {category.tagline}
          </p>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic max-w-4xl">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="animate-pulse border border-cosmic-gold/10 bg-cosmic-deepPurple/30 p-6 rounded-sm">
                  <div className="h-4 bg-cosmic-gold/10 rounded w-1/2 mb-2" />
                  <div className="h-3 bg-cosmic-gold/5 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : services.length === 0 ? (
            <p className="font-cormorant text-cosmic-cream/50 italic text-center py-12">
              Services for this category are being added. Please check back soon, or{' '}
              <Link href="/contact" className="text-cosmic-gold hover:underline">contact us</Link> directly.
            </p>
          ) : !agent ? (
            <p className="font-cormorant text-cosmic-cream/50 italic text-center py-12">
              Booking is temporarily unavailable. Please{' '}
              <Link href="/contact" className="text-cosmic-gold hover:underline">contact us</Link> to book.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(service => {
                const price = getPrice(service)
                const knowMoreSlug = knowMoreSlugs[service.id]
                return (
                  <div key={service.id}
                    className="p-6 border border-cosmic-gold/20 bg-cosmic-deepPurple/30 rounded-sm flex flex-col">
                    <h3 className="font-cinzel text-cosmic-cream font-semibold mb-2">{service.name}</h3>
                    <p className="font-cormorant text-cosmic-cream/60 text-sm italic mb-4 flex-1">
                      {service.description}
                    </p>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 text-cosmic-cream/40">
                        <Clock size={13} />
                        <span className="font-raleway text-xs tracking-widest">{service.durationMins} mins</span>
                      </div>
                      {price > 0 && (
                        <span className="font-raleway text-cosmic-cream font-semibold">
                          {symbol}{price.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <Link
                      href={`/services/book?agentId=${agent.id}&serviceId=${service.id}`}
                      className="btn-primary text-center text-xs py-2.5"
                    >
                      Book Now
                    </Link>
                    {knowMoreSlug && (
                      <Link
                        href={`/learn/${knowMoreSlug}`}
                        className="text-center mt-2 font-raleway text-xs tracking-widest uppercase
                          text-cosmic-gold/70 hover:text-cosmic-gold underline underline-offset-4 transition-colors"
                      >
                        Know More →
                      </Link>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>
    </Layout>
  )
}
