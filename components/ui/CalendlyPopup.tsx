import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface CalendlyPopupProps {
  isOpen: boolean
  onClose: () => void
}

export default function CalendlyPopup({ isOpen, onClose }: CalendlyPopupProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  // Load Calendly widget script once
  useEffect(() => {
    if (!document.querySelector('#calendly-script')) {
      const script = document.createElement('script')
      script.id = 'calendly-script'
      script.src = 'https://assets.calendly.com/assets/external/widget.js'
      script.async = true
      document.body.appendChild(script)
    }
  }, [])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  if (!isOpen) return null

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-cosmic-black/90 backdrop-blur-md" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-2xl bg-cosmic-deepPurple border border-cosmic-gold/30 shadow-gold-lg rounded-sm overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cosmic-gold/20">
          <div>
            <p className="font-cinzel text-cosmic-gold text-base tracking-widest">Book a Session</p>
            <p className="font-cormorant text-cosmic-cream/60 text-sm italic mt-0.5">
              with Dr. Usha Bhatt
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-cosmic-cream/60 hover:text-cosmic-gold transition-colors p-1"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Calendly Widget */}
        <div
          className="calendly-inline-widget"
          data-url="https://calendly.com/thecosmicconnect"
          style={{ minWidth: '100%', height: '580px' }}
        />
      </div>
    </div>
  )
}
