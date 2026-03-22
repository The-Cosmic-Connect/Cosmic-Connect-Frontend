import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { CheckCircle, Calendar, Clock, Video, Mail } from 'lucide-react'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function BookingConfirmed() {
  const router = useRouter()
  const { bookingId, payment_id } = router.query as { bookingId: string; payment_id: string }
  const [booking,  setBooking]  = useState<any>(null)
  const [loading,  setLoading]  = useState(true)
  const [confirmed, setConfirmed] = useState(false)

  useEffect(() => {
    if (!bookingId || !payment_id) return
    // Confirm booking with backend
    fetch(`${API}/bookings/${bookingId}/confirm?payment_id=${payment_id}`, { method: 'POST' })
      .then(r => r.json())
      .then(data => { setBooking(data); setConfirmed(true); setLoading(false) })
      .catch(() => setLoading(false))
  }, [bookingId, payment_id])

  return (
    <Layout title="Booking Confirmed | The Cosmic Connect" noIndex={true}>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4" style={{ background: '#0A0708' }}>
        <div className="max-w-lg w-full text-center">
          {loading ? (
            <div className="text-cosmic-gold text-5xl animate-pulse">✦</div>
          ) : booking ? (
            <>
              <div className="flex justify-center mb-6">
                <CheckCircle size={64} className="text-cosmic-gold" strokeWidth={1.5} />
              </div>
              <p className="font-raleway text-cosmic-gold text-xs tracking-[0.4em] uppercase mb-3">✦ Booking Confirmed ✦</p>
              <h1 className="font-cinzel text-cosmic-cream text-3xl font-bold mb-2">You're All Set!</h1>
              <p className="font-cormorant text-cosmic-cream/60 italic text-lg mb-8">
                Your session has been confirmed. A confirmation email has been sent to {booking.customerEmail}.
              </p>

              <div className="border border-cosmic-gold/20 bg-cosmic-deepPurple/20 rounded-sm p-6 text-left space-y-4 mb-8">
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-cosmic-gold shrink-0" />
                  <div>
                    <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">Date & Time</p>
                    <p className="font-cinzel text-cosmic-cream">{booking.date} at {booking.startTime} IST</p>
                  </div>
                </div>
                {booking.meetLink && (
                  <div className="flex items-center gap-3">
                    <Video size={16} className="text-cosmic-gold shrink-0" />
                    <div>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">Google Meet Link</p>
                      <a href={booking.meetLink} target="_blank" rel="noopener noreferrer"
                        className="font-raleway text-cosmic-gold hover:underline text-sm break-all">
                        {booking.meetLink}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-cosmic-gold shrink-0" />
                  <div>
                    <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">Confirmation sent to</p>
                    <p className="font-cinzel text-cosmic-cream">{booking.customerEmail}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 justify-center">
                <Link href="/" className="btn-outline text-xs">Return Home</Link>
                <Link href="/services" className="btn-primary text-xs">Book Another Session</Link>
              </div>
            </>
          ) : (
            <div>
              <p className="font-cinzel text-cosmic-cream/60">Could not confirm booking. Please contact us.</p>
              <Link href="/services" className="btn-outline mt-6 inline-block text-xs">Back to Services</Link>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
