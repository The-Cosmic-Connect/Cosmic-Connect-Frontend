import { useState } from 'react'
import Layout from '@/components/layout/Layout'
import { MapPin, Phone, Mail, Clock, Send, CheckCircle, MessageCircle } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Status = 'idle' | 'sending' | 'sent' | 'error'

const SUBJECTS = [
  'General Enquiry',
  'Book a Session',
  'Shop / Order',
  'Course Enquiry',
  'Media / Press',
  'Other',
]

const HOURS = [
  { day: 'Monday – Friday', time: '10:00 AM – 7:00 PM' },
  { day: 'Saturday',        time: '10:00 AM – 5:00 PM' },
  { day: 'Sunday',          time: 'Closed' },
]

export default function ContactPage() {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [subject, setSubject] = useState(SUBJECTS[0])
  const [message, setMessage] = useState('')
  const [status,  setStatus]  = useState<Status>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone || !message) return
    setStatus('sending')
    try {
      const r = await fetch(`${API}/contact/general`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, subject, message }),
      })
      if (!r.ok) throw new Error()
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  return (
    <Layout
      title="Contact Us | The Cosmic Connect | Dr. Usha Bhatt"
      description="Get in touch with Dr. Usha Bhatt. Book a session, ask a question, or visit us at our New Delhi studio. We respond within 24 hours."
      canonical="/contact"
    >
      {/* Hero */}
      <section className="relative pt-36 pb-12 px-4 bg-cosmic-gradient overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,44,138,0.18), transparent 70%)' }} />
        <div className="container-cosmic relative z-10 text-center">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3"
            style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
            Get In <span className="text-gradient-gold">Touch</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant italic text-cosmic-cream/60 text-xl max-w-xl mx-auto">
            We respond to all enquiries within 24 hours. For urgent matters, WhatsApp is fastest.
          </p>
        </div>
      </section>

      {/* Main grid */}
      <section className="section bg-cosmic-section">
        <div className="container-cosmic">
          <div className="grid lg:grid-cols-5 gap-10">

            {/* Left — info */}
            <div className="lg:col-span-2 space-y-6">

              {/* Contact details */}
              <div className="cosmic-card p-6">
                <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-5">
                  Contact Details
                </p>
                <div className="space-y-4">
                  {[
                    { icon: <Phone size={15} />,   label: 'Phone', value: '+91 95994 74758', href: 'tel:+919599474758' },
                    { icon: <Mail size={15} />,    label: 'Email', value: 'hello@thecosmicconnect.com', href: 'mailto:hello@thecosmicconnect.com' },
                    { icon: <MapPin size={15} />,  label: 'Address', value: 'GG1/5A PVR Road, Vikaspuri\nNew Delhi 110018', href: 'https://maps.google.com/?q=Vikaspuri+New+Delhi' },
                  ].map(({ icon, label, value, href }) => (
                    <a key={label} href={href} target={href.startsWith('http') ? '_blank' : undefined}
                      rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="flex items-start gap-3 group">
                      <span className="text-cosmic-gold/60 mt-0.5 shrink-0 group-hover:text-cosmic-gold transition-colors">
                        {icon}
                      </span>
                      <div>
                        <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-0.5">
                          {label}
                        </p>
                        <p className="font-cormorant text-cosmic-cream/80 text-base leading-snug whitespace-pre-line group-hover:text-cosmic-cream transition-colors">
                          {value}
                        </p>
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Office hours */}
              <div className="cosmic-card p-6">
                <div className="flex items-center gap-2 mb-5">
                  <Clock size={14} className="text-cosmic-gold/60" />
                  <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">
                    Office Hours
                  </p>
                </div>
                <div className="space-y-2">
                  {HOURS.map(({ day, time }) => (
                    <div key={day} className="flex items-center justify-between border-b border-cosmic-gold/8 pb-2 last:border-0">
                      <span className="font-raleway text-cosmic-cream/60 text-xs">{day}</span>
                      <span className={`font-cinzel text-xs font-semibold ${time === 'Closed' ? 'text-cosmic-cream/25' : 'text-cosmic-gold/70'}`}>
                        {time}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="font-cormorant text-cosmic-cream/30 italic text-sm mt-4">
                  Online sessions available outside these hours by arrangement.
                </p>
              </div>

              {/* WhatsApp CTA */}
              <a href="https://wa.me/919599474758?text=Hello%2C%20I%27d%20like%20to%20enquire%20about%20a%20session"
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-3 px-5 py-4 border border-[#25D366]/30 bg-[#25D366]/5 hover:bg-[#25D366]/10 hover:border-[#25D366]/50 transition-all duration-200 group w-full">
                <MessageCircle size={20} className="text-[#25D366] shrink-0" />
                <div>
                  <p className="font-cinzel text-cosmic-cream text-sm font-semibold group-hover:text-[#25D366] transition-colors">
                    WhatsApp Us
                  </p>
                  <p className="font-cormorant text-cosmic-cream/40 text-sm italic">
                    Fastest response — usually within 1 hour
                  </p>
                </div>
                <span className="ml-auto text-[#25D366]/60 group-hover:text-[#25D366] transition-colors">→</span>
              </a>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3">
              <div className="cosmic-card p-6 md:p-8">
                {status === 'sent' ? (
                  <div className="text-center py-12">
                    <CheckCircle size={52} className="text-cosmic-gold mx-auto mb-4" />
                    <h3 className="font-cinzel text-cosmic-cream text-xl font-semibold mb-3">
                      Message Sent!
                    </h3>
                    <p className="font-cormorant text-cosmic-cream/60 text-lg italic leading-relaxed max-w-sm mx-auto">
                      Thank you for reaching out, {name}. Dr. Bhatt's team will
                      reply within 24–48 hours.
                    </p>
                    <button onClick={() => { setStatus('idle'); setName(''); setEmail(''); setPhone(''); setMessage('') }}
                      className="btn-outline mt-6 text-xs">
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={submit} className="space-y-5">
                    <div>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-4">
                        Send a Message
                      </p>
                    </div>

                    {/* Name + Email */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      {[
                        { label: 'Full Name', val: name, set: setName, type: 'text' },
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

                    {/* Phone + Subject */}
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                          Phone Number <span className="text-cosmic-gold">*</span>
                        </label>
                        <input type="tel" required value={phone} onChange={e => setPhone(e.target.value)}
                          className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors" />
                      </div>
                      <div>
                        <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                          Subject
                        </label>
                        <select value={subject} onChange={e => setSubject(e.target.value)}
                          className="w-full bg-cosmic-black/80 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors appearance-none">
                          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase block mb-1.5">
                        Message <span className="text-cosmic-gold">*</span>
                      </label>
                      <textarea required rows={5} value={message} onChange={e => setMessage(e.target.value)}
                        placeholder="How can Dr. Usha Bhatt help you?"
                        className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors resize-none placeholder-cosmic-cream/20" />
                    </div>

                    {status === 'error' && (
                      <p className="font-raleway text-red-400 text-xs">
                        Something went wrong. Please WhatsApp us directly instead.
                      </p>
                    )}

                    <button type="submit" disabled={status === 'sending'}
                      className="btn-primary w-full justify-center disabled:opacity-60">
                      {status === 'sending' ? (
                        <><div className="w-4 h-4 border-2 border-cosmic-black border-t-transparent rounded-full animate-spin" /> Sending...</>
                      ) : (
                        <><Send size={14} /> Send Message</>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Google Maps */}
      <section className="bg-cosmic-gradient">
        <div className="container-cosmic pb-16">
          <div className="text-center mb-8">
            <p className="ornament text-xs tracking-[0.5em] mb-3">✦ ✦ ✦</p>
            <h2 className="font-cinzel text-xl text-cosmic-cream font-bold mb-2">
              Find <span className="text-gradient-gold">Us</span>
            </h2>
            <div className="gold-divider" />
            <p className="font-cormorant text-cosmic-cream/50 italic mt-3">
              GG1/5A PVR Road, Vikaspuri, New Delhi 110018
            </p>
          </div>
          <div className="border border-cosmic-gold/20 overflow-hidden">
            <iframe
              title="The Cosmic Connect location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.7550704571318!2d77.0771809!3d28.637102!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d056ada47273f%3A0x78c57d06a1c2ea8f!2sThe%20Cosmic%20Connect%20-%20White%20Light%20Tarot%20%26%20Crystals%20by%20Dr.%20Usha%20Bhatt!5e0!3m2!1sen!2sin!4v1772390325154!5m2!1sen!2sin"
              width="100%"
              height="380"
              style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) brightness(0.85) contrast(0.9)' }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="font-cormorant text-cosmic-cream/30 italic text-sm text-center mt-3">
            📍 Note: Replace the Maps embed src with your exact Google Maps embed URL from
            <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer"
              className="text-cosmic-gold/50 hover:text-cosmic-gold ml-1">maps.google.com</a>
            → Share → Embed a map.
          </p>
        </div>
      </section>
    </Layout>
  )
}