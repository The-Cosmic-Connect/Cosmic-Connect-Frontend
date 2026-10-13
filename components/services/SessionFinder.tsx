// "Not sure where to start?" — visitors describe what's going on and how they
// feel; the backend (/recommend, Claude Haiku) suggests 1-3 sessions from the
// live catalogue. Tap-through topics work without typing and are the fallback
// whenever the AI is unavailable. Nothing typed here is stored.
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight, Loader2, Sparkles, MessageCircle, Phone, HeartHandshake } from 'lucide-react'
import { TOPICS, pathBySlug } from '@/lib/servicePaths'
import { useGeo } from '@/context/GeoContext'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const MAX = 1000
const WA = `https://wa.me/919599474758?text=${encodeURIComponent("Hi, I'd like some help choosing the right session.")}`

interface Rec {
  categorySlug: string; serviceId?: string | null; reason: string
  serviceName?: string; durationMins?: number; priceINR?: number; bookUrl?: string | null
}
interface Result {
  crisis?: boolean; healthNote?: boolean; offTopic?: boolean; fallback?: boolean
  message?: string; recommendations?: Rec[]
}

export const HANDOFF_KEY = 'cc_finder_q'

export default function SessionFinder() {
  const { isIndia } = useGeo()
  const [text, setText]       = useState('')
  const [busy, setBusy]       = useState(false)
  const [result, setResult]   = useState<Result | null>(null)
  const [topic, setTopic]     = useState<number | null>(null)
  const [aiDown, setAiDown]   = useState(false)

  // Hand-off from the home page "Find your path" box: the text travels via
  // sessionStorage (never the URL) and the search runs once on arrival.
  useEffect(() => {
    let q: string | null = null
    try { q = sessionStorage.getItem(HANDOFF_KEY); sessionStorage.removeItem(HANDOFF_KEY) } catch { /* storage blocked */ }
    if (q && q.trim().length >= 3) {
      const msg = q.slice(0, MAX)
      setText(msg)
      document.getElementById('finder')?.scrollIntoView({ block: 'start' })
      ask(msg)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function ask(override?: string) {
    const msg = (override ?? text).trim()
    if (msg.length < 3 || busy) return
    setBusy(true); setResult(null); setTopic(null)
    try {
      const r = await fetch(`${API}/recommend`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: msg }),
      })
      if (r.status === 429) { setAiDown(true); setResult({ fallback: true }); return }
      const d: Result = await r.json()
      if (d.fallback) setAiDown(true)
      setResult(d)
    } catch {
      setAiDown(true); setResult({ fallback: true })
    } finally { setBusy(false) }
  }

  function pickTopic(i: number) {
    setTopic(i); setResult({
      recommendations: TOPICS[i].slugs.map(slug => ({ categorySlug: slug, reason: '' })),
    })
  }

  const recs = result?.recommendations || []

  return (
    <section id="finder" className="px-4 py-16 md:py-20 scroll-mt-24" style={{ background: 'rgb(var(--cosmic-black))' }}>
      <div className="container-cosmic max-w-3xl">
        <div className="text-center mb-8">
          <p className="font-raleway text-cosmic-gold text-[11px] tracking-[0.3em] uppercase mb-3">Not sure where to start?</p>
          <h2 className="font-cinzel text-cosmic-cream mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>Tell us what&apos;s on your mind.</h2>
          <p className="font-raleway text-cosmic-cream/55 text-sm">Share what you&apos;re going through and how you&apos;re feeling — in your own words. We&apos;ll suggest where to begin.</p>
        </div>

        <div className="cosmic-card rounded-md p-5 md:p-6">
          <label htmlFor="finder-text" className="sr-only">Describe what you are going through</label>
          <textarea id="finder-text" rows={4} maxLength={MAX} value={text}
            onChange={e => setText(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) ask() }}
            placeholder="e.g. I've been feeling stuck in my career and can't stop overthinking a big decision…"
            className="w-full bg-transparent border border-cosmic-gold/20 focus:border-cosmic-gold/50 outline-none rounded-sm p-3 font-raleway text-sm text-cosmic-cream placeholder:text-cosmic-cream/30 resize-y" />
          <div className="flex flex-wrap items-center justify-between gap-3 mt-3">
            <span className="font-raleway text-[11px] text-cosmic-cream/35">{text.length}/{MAX} · Nothing you type is stored</span>
            <button type="button" onClick={() => ask()} disabled={busy || text.trim().length < 3} className="btn-primary text-xs disabled:opacity-50">
              {busy ? <><Loader2 size={14} className="animate-spin" /> Finding…</> : <>Find my session <Sparkles size={14} /></>}
            </button>
          </div>

          <div className="mt-5 pt-5 border-t border-cosmic-gold/10">
            <p className="font-raleway text-xs text-cosmic-cream/50 mb-3">
              {aiDown ? "Our guide isn't available right now — pick what feels closest:" : 'Or tap what feels closest:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {TOPICS.map((t, i) => (
                <button key={t.label} type="button" onClick={() => pickTopic(i)}
                  className={`font-raleway text-xs px-3 py-1.5 rounded-full border transition-colors ${
                    topic === i ? 'bg-cosmic-gold text-cosmic-ink border-cosmic-gold'
                    : 'border-cosmic-gold/20 text-cosmic-cream/70 hover:border-cosmic-gold/50 hover:text-cosmic-cream'}`}>
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        <div aria-live="polite">
          {result?.crisis ? (
            <div className="mt-6 cosmic-card rounded-md p-6 border-l-4" style={{ borderLeftColor: 'rgb(var(--cosmic-rose))' }}>
              <div className="flex items-start gap-3">
                <HeartHandshake size={22} className="text-cosmic-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-raleway text-cosmic-cream text-sm leading-relaxed mb-4">{result.message}</p>
                  <ul className="font-raleway text-sm text-cosmic-cream/80 space-y-2">
                    <li><b>Tele-MANAS</b> (Govt. of India, free, 24×7): <a href="tel:14416" className="text-cosmic-gold hover:underline">14416</a> or <a href="tel:18008914416" className="text-cosmic-gold hover:underline">1-800-891-4416</a></li>
                    <li>In immediate danger, call emergency services: <a href="tel:112" className="text-cosmic-gold hover:underline">112</a></li>
                  </ul>
                  <p className="font-raleway text-xs text-cosmic-cream/50 mt-4">Please also reach out to someone you trust. You don&apos;t have to go through this alone.</p>
                </div>
              </div>
            </div>
          ) : recs.length > 0 ? (
            <div className="mt-6">
              {result?.message && <p className="font-raleway text-cosmic-cream/80 text-sm leading-relaxed mb-4">{result.message}</p>}
              <div className="grid gap-4 sm:grid-cols-2">
                {recs.map((r, i) => {
                  const p = pathBySlug(r.categorySlug)
                  if (!p) return null
                  return (
                    <div key={`${r.categorySlug}-${r.serviceId || i}`} className="cosmic-card rounded-md p-5 flex flex-col">
                      <p className="font-raleway text-cosmic-gold/80 text-[10px] tracking-[0.25em] uppercase mb-1">{p.eyebrow}</p>
                      <h3 className="font-cinzel text-cosmic-cream text-lg mb-1">{r.serviceName || p.title}</h3>
                      {r.serviceName && (
                        <p className="font-raleway text-cosmic-cream/45 text-xs mb-2">
                          {p.title}{r.durationMins ? ` · ${r.durationMins} min` : ''}{isIndia && r.priceINR ? ` · ₹${Number(r.priceINR).toLocaleString('en-IN')}` : ''}
                        </p>
                      )}
                      <p className="font-raleway text-cosmic-cream/65 text-sm leading-relaxed mb-4">{r.reason || p.description}</p>
                      <div className="mt-auto flex flex-wrap items-center gap-3">
                        {r.bookUrl && (
                          <Link href={r.bookUrl} className="btn-primary text-[11px] py-2 px-4">Book this session <ArrowRight size={12} /></Link>
                        )}
                        <Link href={`/${p.slug}`} className="inline-flex items-center gap-1 font-raleway text-xs text-cosmic-cream/75 hover:text-cosmic-gold">
                          {r.bookUrl ? 'See all options' : 'View sessions'} <ArrowUpRight size={12} />
                        </Link>
                      </div>
                    </div>
                  )
                })}
              </div>
              {result?.healthNote && (
                <p className="font-raleway text-xs text-cosmic-cream/60 mt-4">
                  Our sessions are complementary spiritual practices. For any health concern, please keep working with your doctor or counsellor alongside them.
                </p>
              )}
            </div>
          ) : null}
        </div>

        <p className="font-raleway text-[11px] text-cosmic-cream/40 text-center mt-6 leading-relaxed">
          Suggestions are generated by AI from what you share and are not medical, psychological or legal advice. Sessions
          complement — they don&apos;t replace — professional care.{' '}
          Prefer a person? <a href={WA} target="_blank" rel="noopener noreferrer" className="text-cosmic-gold hover:underline inline-flex items-center gap-1"><MessageCircle size={11} />WhatsApp us</a>{' '}
          or call <a href="tel:+919599474758" className="text-cosmic-gold hover:underline inline-flex items-center gap-1"><Phone size={11} />+91 95994 74758</a>.
        </p>
      </div>
    </section>
  )
}
