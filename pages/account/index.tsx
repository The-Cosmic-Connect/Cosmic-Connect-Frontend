import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import {
  User, LogOut, Package, CalendarClock, Check, Pencil, Video,
} from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { useAuth } from '@/context/AuthContext'
import {
  fetchMyOrders, fetchMyBookings, MyOrder, MyBooking, AuthApiError,
} from '@/lib/auth'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

type Tab = 'orders' | 'bookings'

const STATUS_STYLES: Record<string, string> = {
  paid:      'text-green-400 border-green-400/30 bg-green-400/5',
  confirmed: 'text-green-400 border-green-400/30 bg-green-400/5',
  pending:   'text-cosmic-gold border-cosmic-gold/30 bg-cosmic-gold/5',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/5',
  refunded:  'text-cosmic-cream/50 border-cosmic-cream/20 bg-cosmic-cream/5',
  failed:    'text-red-400 border-red-400/30 bg-red-400/5',
}

function StatusBadge({ status }: { status: string }) {
  const style = STATUS_STYLES[status] || 'text-cosmic-cream/50 border-cosmic-cream/20 bg-cosmic-cream/5'
  return (
    <span className={`font-raleway text-[10px] tracking-widest uppercase px-2 py-1 rounded-sm border ${style}`}>
      {status}
    </span>
  )
}

function formatDate(iso: string) {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch {
    return iso
  }
}

export default function AccountPage() {
  const router = useRouter()
  const { user, token, loading, isLoggedIn, logout, updateName } = useAuth()

  const [tab, setTab] = useState<Tab>('orders')

  const [orders, setOrders]     = useState<MyOrder[] | null>(null)
  const [bookings, setBookings] = useState<MyBooking[] | null>(null)
  const [dataError, setDataError] = useState('')

  const [agentNames, setAgentNames]     = useState<Record<string, string>>({})
  const [serviceNames, setServiceNames] = useState<Record<string, string>>({})

  const [editingName, setEditingName] = useState(false)
  const [nameDraft, setNameDraft]     = useState('')
  const [savingName, setSavingName]   = useState(false)

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.replace(`/account/login?redirect=${encodeURIComponent('/account')}`)
    }
  }, [loading, isLoggedIn, router])

  useEffect(() => {
    if (user) setNameDraft(user.name)
  }, [user])

  // Order + booking history, plus agent/service name lookups so bookings
  // show "Tarot Reading with Dr. Usha Bhatt" instead of raw ids.
  useEffect(() => {
    if (!token) return
    let cancelled = false

    Promise.all([fetchMyOrders(token), fetchMyBookings(token)])
      .then(([myOrders, myBookings]) => {
        if (cancelled) return
        setOrders(myOrders)
        setBookings(myBookings)
      })
      .catch((e) => {
        if (cancelled) return
        setDataError(e instanceof AuthApiError ? e.message : 'Could not load your account data')
      })

    Promise.all([
      fetch(`${API}/agents`).then((r) => (r.ok ? r.json() : { agents: [] })),
      fetch(`${API}/services`).then((r) => (r.ok ? r.json() : { services: [] })),
    ]).then(([agentsData, servicesData]) => {
      if (cancelled) return
      const aNames: Record<string, string> = {}
      for (const a of agentsData.agents || []) aNames[a.id] = a.name
      setAgentNames(aNames)
      const sNames: Record<string, string> = {}
      for (const s of servicesData.services || []) sNames[s.id] = s.name
      setServiceNames(sNames)
    }).catch(() => {})

    return () => { cancelled = true }
  }, [token])

  const totalOrders   = orders?.length ?? 0
  const totalBookings = bookings?.length ?? 0

  const memberSince = useMemo(() => user ? formatDate(user.createdAt) : '', [user])

  async function handleSaveName() {
    if (!nameDraft.trim()) return
    setSavingName(true)
    try {
      await updateName(nameDraft.trim())
      setEditingName(false)
    } catch {
      // Silently keep editing state open — the input itself still shows
      // the attempted value, which is enough signal without an intrusive
      // error banner for what's a low-stakes profile edit.
    } finally {
      setSavingName(false)
    }
  }

  function handleLogout() {
    logout()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <Layout title="My Account | The Cosmic Connect" noIndex>
        <div className="min-h-screen flex items-center justify-center pt-24">
          <div className="w-8 h-8 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    )
  }

  return (
    <Layout title="My Account | The Cosmic Connect" canonical="/account" noIndex>
      <section className="min-h-screen bg-cosmic-section pt-28 pb-16 px-4">
        <div className="container-cosmic max-w-4xl">

          {/* Profile header */}
          <div className="cosmic-card p-6 sm:p-8 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-6">
              <div className="w-16 h-16 rounded-full border border-cosmic-gold/30 bg-cosmic-gold/5 flex items-center justify-center shrink-0 overflow-hidden">
                {user.picture
                  ? <img src={user.picture} alt={user.name} className="w-full h-full object-cover" />
                  : <User className="text-cosmic-gold" size={26} />}
              </div>
              <div className="flex-1 min-w-0">
                {editingName ? (
                  <div className="flex items-center gap-2 mb-1">
                    <input
                      value={nameDraft}
                      onChange={(e) => setNameDraft(e.target.value)}
                      className="bg-cosmic-black/30 border border-cosmic-gold/30 px-3 py-1.5 font-cinzel text-cosmic-cream text-lg outline-none focus:border-cosmic-gold/60"
                    />
                    <button onClick={handleSaveName} disabled={savingName}
                      className="text-cosmic-gold hover:text-cosmic-cream transition-colors disabled:opacity-50">
                      <Check size={18} />
                    </button>
                  </div>
                ) : (
                  <h1 className="font-cinzel text-cosmic-cream text-xl font-bold mb-1 flex items-center gap-2">
                    {user.name}
                    <button onClick={() => setEditingName(true)} className="text-cosmic-cream/30 hover:text-cosmic-gold transition-colors">
                      <Pencil size={13} />
                    </button>
                  </h1>
                )}
                <p className="font-cormorant text-cosmic-cream/50">{user.email}</p>
                {memberSince && (
                  <p className="font-raleway text-cosmic-cream/30 text-xs mt-1">Member since {memberSince}</p>
                )}
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-xs tracking-widest uppercase transition-colors self-start sm:self-center"
              >
                <LogOut size={14} /> Sign Out
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-6 border-b border-cosmic-gold/15 mb-6">
            <button
              onClick={() => setTab('orders')}
              className={`flex items-center gap-2 pb-3 font-cinzel text-sm tracking-wide transition-colors border-b-2 -mb-px
                ${tab === 'orders' ? 'text-cosmic-gold border-cosmic-gold' : 'text-cosmic-cream/50 border-transparent hover:text-cosmic-cream'}`}
            >
              <Package size={15} /> Orders {totalOrders > 0 && `(${totalOrders})`}
            </button>
            <button
              onClick={() => setTab('bookings')}
              className={`flex items-center gap-2 pb-3 font-cinzel text-sm tracking-wide transition-colors border-b-2 -mb-px
                ${tab === 'bookings' ? 'text-cosmic-gold border-cosmic-gold' : 'text-cosmic-cream/50 border-transparent hover:text-cosmic-cream'}`}
            >
              <CalendarClock size={15} /> Bookings {totalBookings > 0 && `(${totalBookings})`}
            </button>
          </div>

          {dataError && <p className="font-raleway text-red-400 text-xs mb-4">{dataError}</p>}

          {/* Orders */}
          {tab === 'orders' && (
            orders === null ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : orders.length === 0 ? (
              <div className="cosmic-card p-10 text-center">
                <p className="font-cormorant text-cosmic-cream/50 italic mb-4">You haven't placed any orders yet.</p>
                <Link href="/shop" className="btn-primary inline-flex">Browse the Shop</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => {
                  const symbol = order.currency === 'USD' ? '$' : '₹'
                  const total  = order.currency === 'USD' ? order.totalUSD : order.totalINR
                  return (
                    <div key={order.id} className="cosmic-card p-5 sm:p-6">
                      <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-cosmic-gold/10">
                        <div>
                          <p className="font-raleway text-cosmic-cream/40 text-[10px] tracking-widest uppercase mb-1">
                            Order · {formatDate(order.createdAt)}
                          </p>
                          <p className="font-cinzel text-cosmic-cream text-sm font-semibold tracking-wide">
                            #{order.id.slice(0, 8).toUpperCase()}
                          </p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>
                      <div className="space-y-2 mb-4">
                        {order.items.map((item, i) => (
                          <div key={`${item.id}-${i}`} className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-sm overflow-hidden shrink-0 border border-cosmic-gold/15 bg-cosmic-black/30 flex items-center justify-center">
                              {item.image && !item.image.includes('placeholder')
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                : <span className="text-sm">💎</span>}
                            </div>
                            <p className="font-cormorant text-cosmic-cream/80 text-sm flex-1 min-w-0 line-clamp-1">{item.name}</p>
                            <p className="font-raleway text-cosmic-cream/40 text-xs shrink-0">× {item.quantity}</p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-3 border-t border-cosmic-gold/10">
                        <span className="font-raleway text-cosmic-cream/40 text-xs capitalize">
                          {order.gateway ? `via ${order.gateway}` : ''}
                        </span>
                        <span className="font-cinzel text-cosmic-gold font-bold text-sm">
                          {symbol}{typeof total === 'number' ? total.toLocaleString('en-IN') : '—'}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          )}

          {/* Bookings */}
          {tab === 'bookings' && (
            bookings === null ? (
              <div className="flex justify-center py-12">
                <div className="w-6 h-6 border-2 border-cosmic-gold border-t-transparent rounded-full animate-spin" />
              </div>
            ) : bookings.length === 0 ? (
              <div className="cosmic-card p-10 text-center">
                <p className="font-cormorant text-cosmic-cream/50 italic mb-4">You haven't booked a session yet.</p>
                <Link href="/services" className="btn-primary inline-flex">Book a Session</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="cosmic-card p-5 sm:p-6">
                    <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                      <p className="font-cinzel text-cosmic-cream text-sm font-semibold">
                        {serviceNames[booking.serviceId] || 'Session'}
                        {agentNames[booking.agentId] && (
                          <span className="font-cormorant text-cosmic-cream/50 font-normal italic"> with {agentNames[booking.agentId]}</span>
                        )}
                      </p>
                      <StatusBadge status={booking.status} />
                    </div>
                    <p className="font-raleway text-cosmic-cream/50 text-xs mb-3">
                      {formatDate(booking.date)} · {booking.startTime} IST
                    </p>
                    {booking.meetLink && booking.status === 'confirmed' && (
                      <a
                        href={booking.meetLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 font-raleway text-cosmic-gold hover:text-cosmic-cream text-xs tracking-widest uppercase transition-colors"
                      >
                        <Video size={13} /> Join Google Meet
                      </a>
                    )}
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>
    </Layout>
  )
}
