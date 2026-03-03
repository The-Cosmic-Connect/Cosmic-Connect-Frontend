import { useState } from 'react'
import { X, Send, CheckCircle } from 'lucide-react'

interface Props {
  isOpen:   boolean
  onClose:  () => void
  course:   string
  mode:     'online' | 'in-person' | null
}

type Status = 'idle' | 'sending' | 'sent' | 'error'

export default function EnrollModal({ isOpen, onClose, course, mode }: Props) {
  const [name,    setName]    = useState('')
  const [email,   setEmail]   = useState('')
  const [phone,   setPhone]   = useState('')
  const [message, setMessage] = useState('')
  const [pref,    setPref]    = useState<'online' | 'in-person'>(mode || 'online')
  const [status,  setStatus]  = useState<Status>('idle')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name || !email || !phone) return

    setStatus('sending')
    try {
      const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
      const r = await fetch(`${backendUrl}/contact/course-inquiry`, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, message, course, mode: pref }),
      })
      if (!r.ok) throw new Error('Failed')
      setStatus('sent')
    } catch {
      setStatus('error')
    }
  }

  function close() {
    onClose()
    // Reset after close animation
    setTimeout(() => {
      setName(''); setEmail(''); setPhone(''); setMessage('')
      setStatus('idle')
    }, 300)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-black/85 backdrop-blur-md" onClick={close} />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg bg-cosmic-deepPurple border border-cosmic-gold/30 shadow-gold-lg">

        {/* Header */}
        <div className="flex items-start justify-between px-6 py-5 border-b border-cosmic-gold/20">
          <div>
            <p className="font-cinzel text-cosmic-gold text-sm tracking-widest font-semibold">
              Enroll Inquiry
            </p>
            <p className="font-cormorant text-cosmic-cream/60 text-base italic mt-0.5">
              {course}
            </p>
          </div>
          <button onClick={close} className="text-cosmic-cream/40 hover:text-cosmic-gold transition-colors mt-1">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6">
          {status === 'sent' ? (
            <div className="text-center py-8">
              <CheckCircle size={48} className="text-cosmic-gold mx-auto mb-4" />
              <h3 className="font-cinzel text-cosmic-cream text-lg font-semibold mb-2">
                Inquiry Sent!
              </h3>
              <p className="font-cormorant text-cosmic-cream/60 text-base italic leading-relaxed mb-6">
                Thank you, {name}. Dr. Usha Bhatt's team will contact you within
                24 hours to confirm your enrollment and share batch details.
              </p>
              <button onClick={close} className="btn-outline text-sm">Close</button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              {/* Mode toggle */}
              <div>
                <p className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase mb-2">
                  Preferred Mode
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {(['online', 'in-person'] as const).map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setPref(m)}
                      className={`py-2.5 font-raleway text-xs tracking-widest uppercase border transition-all duration-200 ${
                        pref === m
                          ? 'border-cosmic-gold bg-cosmic-gold/10 text-cosmic-gold'
                          : 'border-cosmic-gold/20 text-cosmic-cream/50 hover:border-cosmic-gold/40'
                      }`}
                    >
                      {m === 'online' ? '🌐 Online' : '🏛 In-Person'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fields */}
              {[
                { label: 'Full Name',     val: name,    set: setName,    type: 'text' },
                { label: 'Email Address', val: email,   set: setEmail,   type: 'email' },
                { label: 'Phone Number',  val: phone,   set: setPhone,   type: 'tel' },
              ].map(({ label, val, set, type }) => (
                <div key={label}>
                  <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                    {label} <span className="text-cosmic-gold">*</span>
                  </label>
                  <input
                    type={type}
                    required
                    value={val}
                    onChange={e => set(e.target.value)}
                    className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors"
                  />
                </div>
              ))}

              <div>
                <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                  Any Questions? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="e.g. When is the next batch? Do you offer EMI?"
                  className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 px-4 py-3 font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors resize-none placeholder-cosmic-cream/20"
                />
              </div>

              {status === 'error' && (
                <p className="font-raleway text-red-400 text-xs">
                  Something went wrong. Please try WhatsApp or email instead.
                </p>
              )}

              <button
                type="submit"
                disabled={status === 'sending'}
                className="btn-primary w-full justify-center disabled:opacity-60"
              >
                {status === 'sending' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-cosmic-black border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send size={14} />
                    Send Enrollment Inquiry
                  </>
                )}
              </button>

              <p className="font-cormorant text-cosmic-cream/30 text-sm italic text-center">
                Or WhatsApp us directly at{' '}
                <a
                  href="https://wa.me/919599474758"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cosmic-gold/60 hover:text-cosmic-gold transition-colors"
                >
                  +91 95994 74758
                </a>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
