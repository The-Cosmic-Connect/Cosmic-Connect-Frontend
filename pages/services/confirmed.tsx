import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import Link from 'next/link'
import { CheckCircle, Calendar, Clock, Video, Mail, MapPin, ExternalLink } from 'lucide-react'

const API      = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
// Was still showing the old, pre-move address — kept in sync with
// pages/services/book.tsx's ADDRESS/MAP_LINK (see the address-cleanup work
// that already updated every other page to the KG1/298 location).
const ADDRESS  = 'KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018'
const MAP_LINK = 'https://maps.app.goo.gl/s18vSeAsM7fB85zf7'

export default function BookingConfirmed() {
  const router = useRouter()
  // Cashfree's redirect (see backend/handlers/booking.py's return_url) only
  // ever sends bookingId + order_id — there is no payment_id on this URL,
  // so waiting on one here meant this effect never fired and the page sat
  // on its loading spinner forever.
  const { bookingId, order_id } = router.query as { bookingId: string; order_id: string }
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!bookingId || !order_id) return
    fetch(`${API}/bookings/${bookingId}/confirm?order_id=${order_id}`, { method: 'POST' })
      .then(async r => {
        const data = await r.json()
        // A non-OK response (e.g. payment not actually PAID yet, or
        // Cashfree verification failed) must NOT be treated as a
        // confirmed booking — fall through to the "could not confirm"
        // state below instead of rendering success with a malformed
        // booking object.
        if (!r.ok) throw new Error(data.detail || 'Could not confirm booking')
        setBooking(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [bookingId, order_id])

  const isOnline = booking?.mode !== 'inperson'

  return (
    <Layout title="Booking Confirmed | The Cosmic Connect" noIndex={true}>
      <div className="min-h-screen flex items-center justify-center pt-24 pb-16 px-4" style={{ background: 'rgb(var(--cosmic-black))' }}>
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

                {/* Online — show Meet link */}
                {isOnline && booking.meetLink && (
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

                {isOnline && !booking.meetLink && (
                  <div className="flex items-center gap-3">
                    <Video size={16} className="text-cosmic-gold shrink-0" />
                    <div>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase">Session Mode</p>
                      <p className="font-cinzel text-cosmic-cream">Online — Meet link will be sent via email</p>
                    </div>
                  </div>
                )}

                {/* In-person — show address */}
                {!isOnline && (
                  <div className="flex items-start gap-3">
                    <MapPin size={16} className="text-cosmic-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-raleway text-cosmic-cream/40 text-xs tracking-widest uppercase mb-1">Healing Center Address</p>
                      <p className="font-cinzel text-cosmic-cream mb-2">{ADDRESS}</p>
                      <a href={MAP_LINK} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-raleway text-cosmic-gold text-xs tracking-widest hover:underline">
                        <ExternalLink size={11} /> Open in Google Maps
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

              {/* In-person reminder */}
              {!isOnline && (
                <div className="border border-cosmic-gold/20 bg-cosmic-gold/5 rounded-sm p-4 mb-6 text-left">
                  <p className="font-raleway text-cosmic-gold text-xs tracking-widest uppercase mb-2">Before You Visit</p>
                  <p className="font-cormorant text-cosmic-cream/70 italic text-sm leading-relaxed">
                    Please arrive 5–10 minutes before your scheduled time. Wear comfortable clothing and bring any crystals you'd like cleansed. Avoid eating a heavy meal within 2 hours of your session.
                  </p>
                </div>
              )}

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