import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useGeo } from '@/context/GeoContext'
import { ChevronRight, Clock, Star } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface AgentService { serviceId: string; priceINR: number; priceUSD: number; bufferMins: number }
interface Agent {
  id: string; name: string; bio: string; photo: string
  isActive: boolean; googleConnected: boolean
  services: AgentService[]
}
interface Service { id: string; name: string; description: string; durationMins: number; isActive: boolean }

export default function ServicesPage() {
  const router = useRouter()
  const { isIndia, symbol } = useGeo()

  const [agents,   setAgents]   = useState<Agent[]>([])
  const [services, setServices] = useState<Service[]>([])
  const [selected, setSelected] = useState<{ agent: Agent | null; service: Service | null }>({ agent: null, service: null })
  const [step,     setStep]     = useState<'agent' | 'service' | 'slot'>('agent')
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${API}/agents`).then(r => r.json()),
      fetch(`${API}/services`).then(r => r.json()),
    ]).then(([agentData, serviceData]) => {
      setAgents(agentData.agents || [])
      setServices(serviceData.services || [])
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [])

  function selectAgent(agent: Agent) {
    setSelected(s => ({ ...s, agent }))
    setStep('service')
  }

  function selectService(service: Service) {
    setSelected(s => ({ ...s, service }))
    router.push(`/services/book?agentId=${selected.agent!.id}&serviceId=${service.id}`)
  }

  // Services available for selected agent
  const agentServiceIds = selected.agent?.services.map(s => s.serviceId) || []
  const availableServices = services.filter(s => agentServiceIds.includes(s.id))

  function getPrice(service: Service): { priceINR: number; priceUSD: number } {
    const as = selected.agent?.services.find(s => s.serviceId === service.id)
    return { priceINR: as?.priceINR || 0, priceUSD: as?.priceUSD || 0 }
  }

  return (
    <Layout
      title="Book a Session | The Cosmic Connect"
      description="Book a healing session, tarot reading, or spiritual consultation with Dr. Usha Bhatt and other expert healers."
      canonical="/services"
    >
      <section className="relative pt-36 pb-16 px-4 overflow-hidden"
        style={{ background: 'linear-gradient(180deg, #1A0A2E 0%, #0A0708 100%)' }}>
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,76,0.07), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <p className="font-raleway text-cosmic-gold/60 text-xs tracking-[0.5em] uppercase mb-4">✦ Begin Your Journey ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Book a <span className="text-gradient-gold">Session</span>
          </h1>
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto">
            Choose your healer, select a service, and find your perfect time
          </p>

          {/* Steps indicator */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {(['agent', 'service', 'slot'] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full border font-raleway text-xs font-bold transition-all ${
                  step === s ? 'border-cosmic-gold bg-cosmic-gold text-cosmic-black'
                  : i < ['agent','service','slot'].indexOf(step) ? 'border-cosmic-gold/60 bg-cosmic-gold/20 text-cosmic-gold'
                  : 'border-cosmic-gold/20 text-cosmic-cream/30'
                }`}>{i + 1}</div>
                <span className={`font-raleway text-xs tracking-widest uppercase hidden sm:block ${
                  step === s ? 'text-cosmic-gold' : 'text-cosmic-cream/30'
                }`}>{s === 'agent' ? 'Choose Healer' : s === 'service' ? 'Select Service' : 'Pick Time'}</span>
                {i < 2 && <ChevronRight size={14} className="text-cosmic-gold/20" />}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-12 px-4" style={{ background: '#0A0708' }}>
        <div className="container-cosmic max-w-4xl">

          {/* Step 1 — Choose Agent */}
          {step === 'agent' && (
            <div>
              <h2 className="font-cinzel text-cosmic-cream text-xl mb-2">Choose Your Healer</h2>
              <p className="font-cormorant text-cosmic-cream/50 italic mb-8">Select the spiritual guide you'd like to work with</p>
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[...Array(2)].map((_, i) => (
                    <div key={i} className="animate-pulse border border-cosmic-gold/10 bg-cosmic-deepPurple/30 p-6 rounded-sm">
                      <div className="w-20 h-20 rounded-full bg-cosmic-gold/10 mb-4" />
                      <div className="h-4 bg-cosmic-gold/10 rounded w-1/2 mb-2" />
                      <div className="h-3 bg-cosmic-gold/5 rounded w-3/4" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {agents.map(agent => (
                    <button key={agent.id} onClick={() => agent.isActive && selectAgent(agent)}
                      disabled={!agent.isActive}
                      className={`text-left p-6 border transition-all duration-300 rounded-sm ${
                        agent.isActive
                          ? 'border-cosmic-gold/20 bg-cosmic-deepPurple/30 hover:border-cosmic-gold/50 hover:bg-cosmic-deepPurple/60 hover:-translate-y-1 cursor-pointer'
                          : 'border-cosmic-gold/5 bg-cosmic-black/30 opacity-40 cursor-not-allowed'
                      }`}>
                      <div className="flex items-start gap-4">
                        {agent.photo ? (
                          <img src={agent.photo} alt={agent.name}
                            className="w-20 h-20 rounded-full object-cover border-2 border-cosmic-gold/30" />
                        ) : (
                          <div className="w-20 h-20 rounded-full border-2 border-cosmic-gold/30 bg-cosmic-deepPurple flex items-center justify-center text-cosmic-gold text-2xl font-cinzel">
                            {agent.name[0]}
                          </div>
                        )}
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="font-cinzel text-cosmic-cream font-semibold">{agent.name}</h3>
                            {!agent.isActive && (
                              <span className="font-raleway text-xs text-cosmic-cream/30 tracking-widest">Unavailable</span>
                            )}
                          </div>
                          <p className="font-cormorant text-cosmic-cream/60 text-sm italic line-clamp-3">{agent.bio}</p>
                          <p className="font-raleway text-cosmic-gold/60 text-xs mt-2 tracking-widest">
                            {agent.services.length} service{agent.services.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 2 — Choose Service */}
          {step === 'service' && selected.agent && (
            <div>
              <button onClick={() => setStep('agent')}
                className="flex items-center gap-2 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-6 transition-colors">
                ← Back to Healers
              </button>
              <div className="flex items-center gap-4 mb-8 p-4 border border-cosmic-gold/20 bg-cosmic-deepPurple/20 rounded-sm">
                {selected.agent.photo ? (
                  <img src={selected.agent.photo} alt={selected.agent.name}
                    className="w-14 h-14 rounded-full object-cover border border-cosmic-gold/30" />
                ) : (
                  <div className="w-14 h-14 rounded-full border border-cosmic-gold/30 bg-cosmic-deepPurple flex items-center justify-center text-cosmic-gold font-cinzel">
                    {selected.agent.name[0]}
                  </div>
                )}
                <div>
                  <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase">Your Healer</p>
                  <p className="font-cinzel text-cosmic-cream font-semibold">{selected.agent.name}</p>
                </div>
              </div>

              <h2 className="font-cinzel text-cosmic-cream text-xl mb-2">Select a Service</h2>
              <p className="font-cormorant text-cosmic-cream/50 italic mb-8">Choose the type of session you'd like to book</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {availableServices.map(service => {
                  const { priceINR, priceUSD } = getPrice(service)
                  const price = isIndia ? priceINR : priceUSD
                  return (
                    <button key={service.id} onClick={() => selectService(service)}
                      className="text-left p-6 border border-cosmic-gold/20 bg-cosmic-deepPurple/30
                        hover:border-cosmic-gold/50 hover:bg-cosmic-deepPurple/60 hover:-translate-y-1
                        transition-all duration-300 rounded-sm cursor-pointer">
                      <h3 className="font-cinzel text-cosmic-cream font-semibold mb-2">{service.name}</h3>
                      <p className="font-cormorant text-cosmic-cream/60 text-sm italic mb-4 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 text-cosmic-cream/40">
                          <Clock size={13} />
                          <span className="font-raleway text-xs tracking-widest">{service.durationMins} mins</span>
                        </div>
                        <span className="font-raleway text-cosmic-cream font-semibold">
                          {symbol}{price.toLocaleString()}
                        </span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          )}

        </div>
      </section>
    </Layout>
  )
}
