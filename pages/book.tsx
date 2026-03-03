import { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Calendar, Clock, Globe, MapPin, Send, CheckCircle, ChevronDown } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const SERVICES = [
  'Tarot Card Reading',
  'Akashic Records Reading',
  'Past Life Regression',
  'Psychic Healing',
  'Black Magic Removal',
  'Reiki Healing',
  'Crystal Therapy Session',
  'Numerology Reading',
  'Vastu Consultation',
  'Other / Not Sure',
]

const TIMES = [
  'Morning (10 AM – 12 PM)',
  'Afternoon (12 PM – 3 PM)',
  'Late Afternoon (3 PM – 5 PM)',
  'Evening (5 PM – 7 PM)',
]

export default function BookPage() {
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [phone,         setPhone]         = useState('')
  const [service,       setService]       = useState(SERVICES[0])
  const [mode,          setMode]          = useState<'online' | 'in-person'>('online')
  const [preferredDate, setPreferredDate] = useState('')
  const [preferredTime, setPreferredTime] = useState(TIMES[0])
  const [message,       setMessage]       = useState('')
  const [status,        setStatus]        = useState<Status>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone) return
    setStatus('sending')
    try {
      const r = await fetch(`${API}/contact/booking`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, service, mode, preferredDate, preferredTime, message }),
      })
      if (!r.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Layout
      title="Book a Session | Dr. Usha Bhatt | The Cosmic Connect"
      description="Book a personal session with Dr. Usha Bhatt — Tarot reading, Akashic Records, past life regression, healing, and more. Online and in-person sessions available."
      canonical="/book"
    >
      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 bg-cosmic-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(138,58,82,0.18), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Book a <span className="text-gradient-gold">Session</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto">
            Fill in the form below and Dr. Bhatt's team will confirm your appointment
            within 24 hours with session details and payment information.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="py-10 px-4 bg-cosmic-section border-b border-cosmic-gold/10">
        <div className="container-cosmic">
          <div className="grid sm:grid-cols-4 gap-4">
            {[
              { step: '01', label: 'Fill the form', desc: 'Choose your service, date, and mode' },
              { step: '02', label: 'We confirm',    desc: 'Team responds within 24 hours' },
              { step: '03', label: 'Payment',       desc: 'Secure payment link shared with you' },
              { step: '04', label: 'Your session',  desc: 'Online via video or in-person in Delhi' },
            ].map(({ step, label, desc }) => (
              <div key={step} className="text-center">
                <p className="font-cinzel text-cosmic-gold/40 text-3xl font-bold mb-1">{step}</p>
                <p className="font-cinzel text-cosmic-cream text-xs font-semibold mb-1">{label}</p>
                <p className="font-cormorant text-cosmic-cream/40 text-sm italic">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Booking form */}
      <section className="section bg-cosmic-gradient">
        <div className="container-cosmic max-w-2xl">
          <div className="cosmic-card p-6 md:p-10">
            {status === 'sent' ? (
              <div className="text-center py-12">
                <CheckCircle size={52} className="text-cosmic-gold mx-auto mb-4" />
                <h3 className="font-cinzel text-cosmic-cream text-xl font-semibold mb-3">
                  Booking Request Sent!
                </h3>
                <p className="font-cormorant text-cosmic-cream/60 text-lg italic leading-relaxed max-w-sm mx-auto mb-2">
                  Thank you, {name}. Dr. Bhatt's team will confirm your
                  <strong className="text-cosmic-cream/80"> {service}</strong> session
                  within 24 hours.
                </p>
                <p className="font-cormorant text-cosmic-cream/40 italic text-base mb-6">
                  A confirmation has been sent to {email}.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <button onClick={() => { setStatus('idle'); setName(''); setEmail(''); setPhone(''); setMessage(''); setPreferredDate('') }}
                    className="btn-outline text-xs">
                    Book Another Session
                  </button>
                  <Link href="/services" className="btn-primary text-xs inline-flex justify-center">
                    Explore More Services
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-6">
                <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-2">
                  Session Details
                </p>

                {/* Service selector */}
                <div>
                  <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-2">
                    Service <span className="text-cosmic-gold">*</span>
                  </label>
                  <div className="relative">
                    <select value={service} onChange={e => setService(e.target.value)}
                      className="w-full bg-cosmic-black/50 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors appearance-none pr-10">
                      {SERVICES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-cream/40 pointer-events-none" />
                  </div>
                </div>

                {/* Mode toggle */}
                <div>
                  <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-2">
                    Session Mode <span className="text-cosmic-gold">*</span>
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {([
                      { val: 'online',    icon: <Globe size={14} />,  label: 'Online (Video Call)' },
                      { val: 'in-person', icon: <MapPin size={14} />, label: 'In-Person · New Delhi' },
                    ] as const).map(({ val, icon, label }) => (
                      <button key={val} type="button" onClick={() => setMode(val)}
                        className={`flex items-center justify-center gap-2 py-3 border transition-all duration-200 font-raleway text-xs tracking-widest uppercase ${
                          mode === val
                            ? 'border-cosmic-gold bg-cosmic-gold/10 text-cosmic-gold'
                            : 'border-cosmic-gold/20 text-cosmic-cream/50 hover:border-cosmic-gold/40'
                        }`}>
                        {icon} {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name',     val: name,  set: setName,  type: 'text' },
                    { label: 'Email Address', val: email, set: setEmail, type: 'email' },
                  ].map(({ label, val, set, type }) => (
                    <div key={label}>
                      <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                        {label} <span className="text-cosmic-gold">*</span>
                      </label>
                      <input type={type} required value={val} onChange={e => set(e.target.value)}
                        className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors" />
                    </div>
                  ))}
                </div>

                {/* Phone */}
                <div>
                  <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                    Phone Number <span className="text-cosmic-gold">*</span>
                  </label>
                  <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                    className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors" />
                </div>

                {/* Preferred date + time */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                      <Calendar size={11} className="inline mr-1" />Preferred Date
                    </label>
                    <input type="date" value={preferredDate} onChange={e => setPreferredDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors" />
                  </div>
                  <div>
                    <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                      <Clock size={11} className="inline mr-1" />Preferred Time
                    </label>
                    <div className="relative">
                      <select value={preferredTime} onChange={e => setPreferredTime(e.target.value)}
                        className="w-full bg-cosmic-black/50 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors appearance-none pr-10">
                        {TIMES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-cosmic-cream/40 pointer-events-none" />
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                    Any Questions or Context? (Optional)
                  </label>
                  <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)}
                    placeholder="Share anything that might help Dr. Bhatt prepare for your session..."
                    className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors resize-none placeholder-cosmic-cream/20" />
                </div>

                {status === 'error' && (
                  <p className="font-raleway text-red-400 text-xs">
                    Something went wrong. Please WhatsApp us at +91 95994 74758.
                  </p>
                )}

                <button type="submit" disabled={status === 'sending'}
                  className="btn-primary w-full justify-center disabled:opacity-60">
                  {status === 'sending' ? (
                    <><div className="w-4 h-4 border-2 border-cosmic-black border-t-transparent rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send size={14} /> Submit Booking Request</>
                  )}
                </button>

                <p className="font-cormorant text-cosmic-cream/30 italic text-sm text-center">
                  Or WhatsApp us directly at{' '}
                  <a href="https://wa.me/919599474758" target="_blank" rel="noopener noreferrer"
                    className="text-cosmic-gold/60 hover:text-cosmic-gold transition-colors">
                    +91 95994 74758
                  </a>
                </p>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
