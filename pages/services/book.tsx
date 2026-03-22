import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import { useGeo } from '@/context/GeoContext'
import { ChevronLeft, ChevronRight, Clock, Calendar, User, Mail, Phone, Check } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Slot { startTime: string; endTime: string; available: boolean }

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}
function toIST(date: Date) {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
}
function formatDate(y: number, m: number, d: number) {
  return `${y}-${String(m + 1).padStart(2,'0')}-${String(d).padStart(2,'0')}`
}

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']
const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

export default function BookPage() {
  const router  = useRouter()
  const { agentId, serviceId } = router.query as { agentId: string; serviceId: string }
  const { isIndia, symbol } = useGeo()

  const [agent,   setAgent]   = useState<any>(null)
  const [service, setService] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  // Calendar state
  const now = toIST(new Date())
  const [calYear,  setCalYear]  = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [selDate,  setSelDate]  = useState<string | null>(null)

  // Slot state
  const [slots,       setSlots]       = useState<Slot[]>([])
  const [slotsLoading,setSlotsLoading]= useState(false)
  const [selSlot,     setSelSlot]     = useState<Slot | null>(null)

  // Customer form
  const [form, setForm] = useState({ name: '', email: '', phone: '' })
  const [step, setStep] = useState<'calendar' | 'details' | 'payment'>('calendar')
  const [paying, setPaying] = useState(false)
  const [error,  setError]  = useState('')

  useEffect(() => {
    if (!agentId || !serviceId) return
    Promise.all([
      fetch(`${API}/agents/${agentId}`).then(r => r.json()),
      fetch(`${API}/services/${serviceId}`).then(r => r.json()),
    ]).then(([a, s]) => {
      setAgent(a); setService(s); setLoading(false)
    }).catch(() => setLoading(false))
  }, [agentId, serviceId])

  useEffect(() => {
    if (!selDate || !agentId || !serviceId) return
    setSlotsLoading(true)
    setSelSlot(null)
    fetch(`${API}/agents/${agentId}/slots?date=${selDate}&service_id=${serviceId}`)
      .then(r => r.json())
      .then(data => { setSlots(data.slots || []); setSlotsLoading(false) })
      .catch(() => setSlotsLoading(false))
  }, [selDate, agentId, serviceId])

  const agentService = agent?.services?.find((s: any) => s.serviceId === serviceId)
  const price = isIndia ? agentService?.priceINR : agentService?.priceUSD

  // Disabled days based on agent schedule
  const activeDays = agent?.schedule?.activeDays || [0,1,2,3,4,5]
  // Convert Sun=0 to Mon=0 convention... agent uses Mon=0, JS uses Sun=0
  function isDayDisabled(year: number, month: number, day: number) {
    const d   = new Date(year, month, day)
    const dow = d.getDay() // 0=Sun
    const monBased = dow === 0 ? 6 : dow - 1  // convert to Mon=0
    const isPast = d < new Date(now.getFullYear(), now.getMonth(), now.getDate())
    return isPast || !activeDays.includes(monBased)
  }

  function prevMonth() {
    if (calMonth === 0) { setCalYear(y => y-1); setCalMonth(11) }
    else setCalMonth(m => m-1)
  }
  function nextMonth() {
    if (calMonth === 11) { setCalYear(y => y+1); setCalMonth(0) }
    else setCalMonth(m => m+1)
  }

  async function handlePayment() {
    if (!selDate || !selSlot || !form.name || !form.email || !form.phone) return
    setPaying(true); setError('')
    try {
      const r = await fetch(`${API}/bookings/initiate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId, serviceId,
          date:          selDate,
          startTime:     selSlot.startTime,
          customerName:  form.name,
          customerEmail: form.email,
          customerPhone: form.phone,
          priceINR:      agentService?.priceINR || 0,
          priceUSD:      agentService?.priceUSD || 0,
          currency:      isIndia ? 'INR' : 'USD',
        }),
      })
      const data = await r.json()
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl
      } else {
        setError('Could not initiate payment. Please try again.')
        setPaying(false)
      }
    } catch (e) {
      setError('Something went wrong. Please try again.')
      setPaying(false)
    }
  }

  const daysInMonth  = getDaysInMonth(calYear, calMonth)
  const firstDay     = getFirstDayOfMonth(calYear, calMonth)

  if (loading) return (
    <Layout title="Book a Session | The Cosmic Connect">
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0708' }}>
        <div className="text-cosmic-gold text-4xl animate-pulse">✦</div>
      </div>
    </Layout>
  )

  return (
    <Layout
      title={`Book ${service?.name} | The Cosmic Connect`}
      description={`Book a ${service?.name} session with ${agent?.name} at The Cosmic Connect.`}
      canonical="/services/book"
      noIndex={true}
    >
      <div className="min-h-screen pt-24 pb-16 px-4" style={{ background: '#0A0708' }}>
        <div className="container-cosmic max-w-4xl">

          {/* Header */}
          <button onClick={() => router.push('/services')}
            className="flex items-center gap-2 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-8 transition-colors">
            <ChevronLeft size={14} /> Back to Services
          </button>

          {/* Booking summary bar */}
          <div className="flex flex-wrap items-center gap-4 p-4 border border-cosmic-gold/20 bg-cosmic-deepPurple/20 rounded-sm mb-8">
            {agent?.photo ? (
              <img src={agent.photo} alt={agent.name} className="w-12 h-12 rounded-full object-cover border border-cosmic-gold/30" />
            ) : (
              <div className="w-12 h-12 rounded-full border border-cosmic-gold/30 bg-cosmic-deepPurple flex items-center justify-center text-cosmic-gold font-cinzel">
                {agent?.name?.[0]}
              </div>
            )}
            <div>
              <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase">Booking with</p>
              <p className="font-cinzel text-cosmic-cream font-semibold">{agent?.name}</p>
            </div>
            <div className="border-l border-cosmic-gold/20 pl-4">
              <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase">Service</p>
              <p className="font-cinzel text-cosmic-cream font-semibold">{service?.name}</p>
            </div>
            <div className="border-l border-cosmic-gold/20 pl-4">
              <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase">Duration</p>
              <p className="font-cinzel text-cosmic-cream font-semibold">{service?.durationMins} mins</p>
            </div>
            {price && (
              <div className="border-l border-cosmic-gold/20 pl-4 ml-auto">
                <p className="font-raleway text-cosmic-gold/60 text-xs tracking-widest uppercase">Price</p>
                <p className="font-cinzel text-cosmic-gold font-bold text-lg">{symbol}{price?.toLocaleString()}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

            {/* Left — Calendar */}
            <div>
              <h2 className="font-cinzel text-cosmic-cream font-semibold mb-4 flex items-center gap-2">
                <Calendar size={16} className="text-cosmic-gold" /> Select Date
              </h2>

              {/* Month nav */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="text-cosmic-cream/40 hover:text-cosmic-gold transition-colors p-1">
                  <ChevronLeft size={18} />
                </button>
                <p className="font-cinzel text-cosmic-cream text-sm tracking-wider">
                  {MONTHS[calMonth]} {calYear}
                </p>
                <button onClick={nextMonth} className="text-cosmic-cream/40 hover:text-cosmic-gold transition-colors p-1">
                  <ChevronRight size={18} />
                </button>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 mb-1">
                {DAYS.map(d => (
                  <div key={d} className="text-center font-raleway text-cosmic-cream/30 text-xs py-1 tracking-widest">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {[...Array(firstDay)].map((_, i) => <div key={`e-${i}`} />)}
                {[...Array(daysInMonth)].map((_, i) => {
                  const day      = i + 1
                  const dateStr  = formatDate(calYear, calMonth, day)
                  const disabled = isDayDisabled(calYear, calMonth, day)
                  const isSelected = selDate === dateStr
                  return (
                    <button key={day}
                      disabled={disabled}
                      onClick={() => { setSelDate(dateStr); setSelSlot(null) }}
                      className={`aspect-square flex items-center justify-center rounded-sm text-sm font-raleway transition-all ${
                        isSelected
                          ? 'bg-cosmic-gold text-cosmic-black font-bold'
                          : disabled
                          ? 'text-cosmic-cream/15 cursor-not-allowed'
                          : 'text-cosmic-cream/70 hover:bg-cosmic-gold/20 hover:text-cosmic-gold cursor-pointer'
                      }`}>
                      {day}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right — Slots + Form */}
            <div>
              {selDate ? (
                <>
                  <h2 className="font-cinzel text-cosmic-cream font-semibold mb-4 flex items-center gap-2">
                    <Clock size={16} className="text-cosmic-gold" /> Available Times
                    <span className="font-raleway text-cosmic-cream/40 text-xs font-normal ml-1">IST</span>
                  </h2>

                  {slotsLoading ? (
                    <div className="grid grid-cols-3 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div key={i} className="h-10 animate-pulse bg-cosmic-gold/5 rounded-sm" />
                      ))}
                    </div>
                  ) : slots.length === 0 ? (
                    <div className="text-center py-8 border border-cosmic-gold/10 rounded-sm">
                      <p className="font-cormorant text-cosmic-cream/40 italic">No available slots on this date</p>
                      <p className="font-raleway text-cosmic-cream/25 text-xs mt-1 tracking-widest">Please select another date</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 gap-2">
                      {slots.map(slot => (
                        <button key={slot.startTime}
                          onClick={() => { setSelSlot(slot); setStep('details') }}
                          className={`py-2.5 text-center font-raleway text-xs tracking-wider transition-all rounded-sm border ${
                            selSlot?.startTime === slot.startTime
                              ? 'border-cosmic-gold bg-cosmic-gold text-cosmic-black font-bold'
                              : 'border-cosmic-gold/20 text-cosmic-cream/70 hover:border-cosmic-gold/50 hover:text-cosmic-gold'
                          }`}>
                          {slot.startTime}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-full min-h-48 border border-cosmic-gold/10 rounded-sm">
                  <p className="font-cormorant text-cosmic-cream/30 italic text-lg">Select a date to see available times</p>
                </div>
              )}

              {/* Customer details form */}
              {selSlot && (
                <div className="mt-6 border-t border-cosmic-gold/10 pt-6">
                  <h2 className="font-cinzel text-cosmic-cream font-semibold mb-4 flex items-center gap-2">
                    <User size={16} className="text-cosmic-gold" /> Your Details
                  </h2>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3 border border-cosmic-gold/20 px-3">
                      <User size={13} className="text-cosmic-cream/30 shrink-0" />
                      <input type="text" placeholder="Full Name *" value={form.name}
                        onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                        className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-3" />
                    </div>
                    <div className="flex items-center gap-3 border border-cosmic-gold/20 px-3">
                      <Mail size={13} className="text-cosmic-cream/30 shrink-0" />
                      <input type="email" placeholder="Email Address *" value={form.email}
                        onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                        className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-3" />
                    </div>
                    <div className="flex items-center gap-3 border border-cosmic-gold/20 px-3">
                      <Phone size={13} className="text-cosmic-cream/30 shrink-0" />
                      <input type="tel" placeholder="Phone Number *" value={form.phone}
                        onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                        className="flex-1 bg-transparent font-raleway text-sm text-cosmic-cream placeholder-cosmic-cream/25 outline-none py-3" />
                    </div>
                  </div>

                  {/* Booking summary */}
                  <div className="mt-4 p-3 bg-cosmic-deepPurple/30 border border-cosmic-gold/10 rounded-sm space-y-1">
                    <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-2">Booking Summary</p>
                    <p className="font-raleway text-cosmic-cream/70 text-xs">{service?.name} with {agent?.name}</p>
                    <p className="font-raleway text-cosmic-cream/70 text-xs">{selDate} at {selSlot.startTime} IST ({service?.durationMins} mins)</p>
                    <p className="font-raleway text-cosmic-gold font-semibold text-sm mt-2">{symbol}{price?.toLocaleString()}</p>
                  </div>

                  {error && <p className="font-raleway text-red-400 text-xs mt-3 tracking-wide">{error}</p>}

                  <button
                    onClick={handlePayment}
                    disabled={!form.name || !form.email || !form.phone || paying}
                    className="btn-primary w-full mt-4 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
                    {paying ? 'Redirecting to payment...' : `Pay ${symbol}${price?.toLocaleString()} & Confirm`}
                  </button>

                  <p className="font-raleway text-cosmic-cream/25 text-xs text-center mt-2 tracking-widest">
                    Secure payment · Google Meet link sent after confirmation
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
