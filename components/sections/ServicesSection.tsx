// Home page "Find your path" — mirrors the /services flow:
// a quick "what's on your mind" box (hands off to the session finder),
// the 7 service paths linking straight to their category pages, and a
// "not sure?" tile for anyone who wants help choosing.
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react'
import PathArt from '@/components/services/PathArt'
import { HANDOFF_KEY } from '@/components/services/SessionFinder'
import { PATHS } from '@/lib/servicePaths'

const PROMPTS = ['A decision I keep going back and forth on', 'Feeling drained and unsettled', 'The same patterns keep repeating']

export default function ServicesSection() {
  const router = useRouter()
  const [text, setText] = useState('')

  function go(e?: FormEvent, preset?: string) {
    e?.preventDefault()
    const q = (preset ?? text).trim()
    if (q.length >= 3) {
      try { sessionStorage.setItem(HANDOFF_KEY, q.slice(0, 1000)) } catch { /* storage blocked: finder still opens */ }
    }
    router.push('/services#finder')
  }

  return (
    <section id="services" className="section bg-cosmic-section">
      <div className="container-cosmic">

        {/* Header */}
        <div className="text-center mb-10">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h2 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-4">
            Find Your <span className="text-gradient-gold">Path</span>
          </h2>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/60 text-lg italic max-w-xl mx-auto leading-relaxed">
            Choose the kind of session that feels closest to what you&apos;re looking for,
            or tell us what&apos;s on your mind and we&apos;ll suggest one.
          </p>
        </div>

        {/* What's on your mind → session finder */}
        <form onSubmit={go} className="max-w-2xl mx-auto mb-12">
          <label htmlFor="home-finder" className="sr-only">Describe what you&apos;re going through</label>
          <div className="cosmic-card rounded-md p-2 flex flex-col sm:flex-row gap-2">
            <input id="home-finder" type="text" value={text} maxLength={1000}
              onChange={e => setText(e.target.value)}
              placeholder="What's on your mind? e.g. I feel stuck in my career…"
              className="flex-1 bg-transparent px-4 py-3 font-raleway text-sm text-cosmic-cream placeholder:text-cosmic-cream/35 focus:outline-none" />
            <button type="submit" className="btn-primary text-xs justify-center whitespace-nowrap">
              <Sparkles size={14} /> Suggest a session
            </button>
          </div>
          <div className="flex flex-wrap justify-center gap-2 mt-3">
            {PROMPTS.map(p => (
              <button key={p} type="button" onClick={() => go(undefined, p)}
                className="font-raleway text-[11px] text-cosmic-cream/55 border border-cosmic-gold/15 rounded-full px-3 py-1.5 hover:text-cosmic-gold hover:border-cosmic-gold/40 transition-colors">
                {p}
              </button>
            ))}
          </div>
        </form>

        {/* Paths: 7 categories + "not sure" tile = clean 2 × 4 grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5 mb-10">
          {PATHS.map(p => (
            <Link key={p.slug} href={`/${p.slug}`}
              className="group cosmic-card flex flex-col overflow-hidden rounded-md">
              <div className="h-24 md:h-28 flex items-center justify-center"
                style={{ background: `linear-gradient(180deg, rgb(${p.tint} / 0.22), rgb(${p.tint} / 0.08))` }}>
                <PathArt kind={p.art} className="w-24 h-16 md:w-28 md:h-20 text-cosmic-gold/80 transition-transform duration-500 group-hover:scale-105" />
              </div>
              <div className="flex flex-col flex-1 p-4 md:p-5">
                <p className="font-raleway text-cosmic-gold/80 text-[9px] md:text-[10px] tracking-[0.2em] uppercase mb-1.5">{p.eyebrow}</p>
                <h3 className="font-cinzel text-cosmic-cream text-sm md:text-base leading-snug mb-3 group-hover:text-cosmic-gold transition-colors">{p.title}</h3>
                <span className="mt-auto inline-flex items-center gap-1 font-raleway text-[11px] text-cosmic-cream/60 group-hover:text-cosmic-gold transition-colors">
                  View sessions <ArrowUpRight size={12} />
                </span>
              </div>
            </Link>
          ))}

          <Link href="/services#finder"
            className="group rounded-md border border-dashed border-cosmic-gold/30 flex flex-col items-center justify-center text-center p-5 hover:border-cosmic-gold/60 transition-colors">
            <Sparkles size={26} strokeWidth={1.2} className="text-cosmic-gold mb-3" />
            <h3 className="font-cinzel text-cosmic-cream text-sm md:text-base mb-2">Not sure where to start?</h3>
            <p className="font-raleway text-cosmic-cream/50 text-[11px] leading-relaxed mb-3">Answer a few words and we&apos;ll point you to the right session.</p>
            <span className="inline-flex items-center gap-1 font-raleway text-[11px] text-cosmic-gold">Help me choose <ArrowRight size={12} /></span>
          </Link>
        </div>

        <div className="text-center">
          <Link href="/services" className="btn-primary">Explore All Sessions &amp; Book</Link>
        </div>
      </div>
    </section>
  )
}
