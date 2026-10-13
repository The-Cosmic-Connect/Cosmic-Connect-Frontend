// /services — the start of the booking journey.
//
// The Cosmic Connect has a single healer (Dr. Usha Bhatt), so there is no
// "choose a healer" step any more. Visitors pick a *path* (one of the 7
// service categories in lib/serviceCategories.ts), which opens that
// category's existing page listing its bookable services, then the slot
// picker (/services/book). Colours follow the site theme tokens, so the page
// is dark-cosmic by default and minimal black & white on the light theme.
import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { ArrowUpRight, ArrowRight, MessageCircle, Plus, Phone, Sparkles } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import PathArt, { type PathArtKind } from '@/components/services/PathArt'

const PHONE_DISPLAY = '+91 95994 74758'
const PHONE_TEL = '+919599474758'
const wa = (text: string) => `https://wa.me/919599474758?text=${encodeURIComponent(text)}`
const WA_HELP = wa("Hi, I'd like some help choosing the right session.")
const WA_FIRST = wa("Hi, I'm booking my first session and would like some guidance.")
const WA_QUESTION = wa('Hi, I have a question before I book a session.')

type Need = 'clarity' | 'calm' | 'discovery' | 'support'

const NEEDS: { key: Need | 'all'; label: string }[] = [
  { key: 'all', label: 'All sessions' },
  { key: 'clarity', label: 'Clarity & direction' },
  { key: 'calm', label: 'Calm & balance' },
  { key: 'discovery', label: 'Self-discovery' },
  { key: 'support', label: 'Spiritual support' },
]

interface Path {
  slug: string            // existing category page (lib/serviceCategories.ts)
  eyebrow: string
  title: string
  description: string
  includes: string
  art: PathArtKind
  tint: string            // RGB channels for the soft card-header wash
  needs: Need[]
}

const PATHS: Path[] = [
  { slug: 'tarot-reading-services', eyebrow: 'For clarity & direction', title: 'Tarot reading',
    description: "Explore a question, a decision, or what's on your mind through a guided Tarot reading.",
    includes: 'Tarot reading services', art: 'tarot', tint: '168 132 214', needs: ['clarity'] },
  { slug: 'reiki-crystal-photo-healing', eyebrow: 'For calm & balance', title: 'Energy healing',
    description: 'Explore gentle energy-based practices, with Reiki, crystal and distance healing options.',
    includes: 'Reiki · Crystal · Distance · Animal healing', art: 'lotus', tint: '134 180 120', needs: ['calm'] },
  { slug: 'akashic-mokshapat-pastlife', eyebrow: 'For deeper self-discovery', title: 'Soul & past life exploration',
    description: 'Explore recurring patterns and your spiritual story through reflective soul-focused practices.',
    includes: 'Akashic reading · Mokshapat · Past life', art: 'mandala', tint: '214 182 120', needs: ['discovery'] },
  { slug: 'sound-healing-services', eyebrow: 'For a moment of stillness', title: 'Sound healing',
    description: 'Discover sound-based practices and explore a different way to pause and reconnect.',
    includes: 'Sound healing sessions', art: 'bowl', tint: '120 150 200', needs: ['calm'] },
  { slug: 'black-magic-evil-eye-removal', eyebrow: 'For spiritual support', title: 'Spiritual protection',
    description: "Explore the practice's spiritual protection services and discuss your concerns with the team.",
    includes: 'Black magic & evil eye · Scanning & negation', art: 'shield', tint: '176 150 214', needs: ['support'] },
  { slug: 'crystal-grids', eyebrow: 'For intention & connection', title: 'Crystal grids',
    description: 'Explore crystal arrangements used in spiritual practice for healing, protection and prosperity intentions.',
    includes: 'Sacred crystal alchemy', art: 'crystals', tint: '120 190 170', needs: ['discovery', 'support'] },
  { slug: 'pendulum-dowsing-gem-stone-counselling', eyebrow: 'For a personal starting point', title: 'Personal spiritual guidance',
    description: 'Explore gemstone guidance, pendulum dowsing and a conversation about your spiritual interests.',
    includes: 'Gemstones · Pendulum dowsing · Guidance', art: 'pendulum', tint: '214 150 150', needs: ['clarity', 'support'] },
]

const STEPS = [
  { n: '01', title: 'Find your fit', text: "Start with what's on your mind." },
  { n: '02', title: 'Explore the details', text: 'Check session options, fees and availability.' },
  { n: '03', title: 'Book your session', text: 'Complete your booking on the service page.' },
]

const FAQS: { q: string; a: ReactNode; text: string }[] = [
  { q: 'How do I choose the right session?',
    text: "Start with what's on your mind and pick the path that feels closest. If you're unsure, message us on WhatsApp and we'll help you choose.",
    a: <>Start with what&apos;s on your mind and pick the path that feels closest. If you&apos;re unsure, <a href={WA_HELP} target="_blank" rel="noopener noreferrer" className="text-cosmic-gold hover:underline">message us on WhatsApp</a> and we&apos;ll help you choose.</> },
  { q: 'Can I have a session online?',
    text: 'Yes. Most sessions can be taken online over Google Meet, or in person at our studio in Vikaspuri, New Delhi. You choose when you book.',
    a: <>Yes. Most sessions can be taken online over Google Meet, or in person at our studio in Vikaspuri, New Delhi. You choose when you book.</> },
  { q: 'Where can I see prices and session length?',
    text: 'Open any path above. Each session shows its fee and duration before you pick a time.',
    a: <>Open any path above. Each session shows its fee and duration before you pick a time.</> },
  { q: 'Do I need any experience or preparation?',
    text: 'No experience is needed. Come with an open mind and, if you like, a question or area of life you would like to explore.',
    a: <>No experience is needed. Come with an open mind and, if you like, a question or area of life you&apos;d like to explore.</> },
  { q: 'What if I need to change my booking?',
    text: 'Contact us at least 24 hours before your session and we will help you reschedule or cancel.',
    a: <>Contact us at least 24 hours before your session and we&apos;ll help you reschedule or cancel. See our <Link href="/shipping-returns" className="text-cosmic-gold hover:underline">cancellation policy</Link> for details.</> },
]

const eyebrowCls = 'font-raleway text-cosmic-gold text-[11px] tracking-[0.3em] uppercase'

export default function ServicesPage() {
  const [need, setNeed] = useState<Need | 'all'>('all')
  const shown = need === 'all' ? PATHS : PATHS.filter(p => p.needs.includes(need))

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQS.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.text } })),
  }

  return (
    <Layout
      title="Book a Session with Dr. Usha Bhatt | The Cosmic Connect"
      description="One-to-one Tarot, energy healing, past life, sound healing, spiritual protection, crystal grids and personal guidance sessions with Dr. Usha Bhatt — online or in New Delhi."
      canonical="/services"
      jsonLd={faqJsonLd}
    >
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 md:pt-40 pb-16 md:pb-24 px-4 overflow-hidden" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className={`${eyebrowCls} mb-6`}>✦ &nbsp;One-to-one sessions with Dr. Usha Bhatt</p>
            <h1 className="font-cinzel text-cosmic-cream font-semibold leading-[1.1] mb-6" style={{ fontSize: 'clamp(2.4rem, 5.5vw, 4rem)' }}>
              Your next chapter begins with <span className="italic font-normal text-gradient-gold">clarity.</span>
            </h1>
            <p className="font-raleway text-cosmic-cream/65 text-base md:text-lg leading-relaxed max-w-xl mb-8">
              You don&apos;t need to have it all figured out. Whether you&apos;re looking for direction, balance, or a deeper
              connection to yourself, we&apos;ll help you find a place to begin.
            </p>
            <div className="flex flex-wrap items-center gap-4 mb-8">
              <a href="#paths" className="btn-primary text-xs">Find your session <ArrowUpRight size={14} /></a>
              <a href={WA_HELP} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 font-raleway text-sm text-cosmic-cream/80 hover:text-cosmic-gold border-b border-cosmic-gold/30 pb-0.5 transition-colors">
                Help me choose <ArrowRight size={14} />
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 font-raleway text-xs text-cosmic-cream/55">
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold" />Online &amp; in New Delhi</span>
              <span className="flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cosmic-gold" />First-time visitors welcome</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[420px]">
            <Sparkles className="absolute -right-2 top-10 text-cosmic-gold/70 z-10" size={30} strokeWidth={1.2} />
            <div className="relative rounded-t-full border border-cosmic-gold/25 p-3">
              <div className="rounded-t-full overflow-hidden aspect-[4/5] bg-cosmic-deepPurple">
                <img src="/images/usha-aunty.jpg" alt="Dr. Usha Bhatt" width={1080} height={1350}
                  className="w-full h-full object-cover" />
              </div>
            </div>
            <div className="absolute left-0 sm:-left-6 bottom-28 cosmic-card px-4 py-3 flex items-center gap-3">
              <span className="font-cinzel text-cosmic-cream text-3xl font-semibold">20<span className="text-cosmic-gold">+</span></span>
              <span className="font-raleway text-cosmic-cream/60 text-[11px] leading-tight">years of<br />spiritual practice</span>
            </div>
            <div className="cosmic-card mx-3 -mt-2 px-6 py-5 text-center">
              <p className={`${eyebrowCls} text-[10px] mb-1`}>Your guide</p>
              <p className="font-cinzel text-cosmic-cream text-xl">Dr. Usha Bhatt</p>
              <p className="font-raleway text-cosmic-cream/55 text-xs mt-1">Tarot Grand Master &amp; Spiritual Guide</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── How it works ─────────────────────────────────────────────────── */}
      <section className="px-4 py-12 border-y border-cosmic-gold/10" style={{ background: 'rgb(var(--cosmic-deep-purple) / 0.5)' }}>
        <div className="container-cosmic grid md:grid-cols-[1fr_2.2fr] gap-8 items-center">
          <div>
            <p className={`${eyebrowCls} mb-3`}>A simple way to begin</p>
            <h2 className="font-cinzel text-cosmic-cream text-2xl md:text-3xl leading-snug">A little guidance,<br />every step of the way.</h2>
          </div>
          <ol className="grid sm:grid-cols-3 gap-6">
            {STEPS.map(s => (
              <li key={s.n} className="flex gap-3">
                <span className="font-cinzel text-cosmic-gold/80 text-3xl leading-none">{s.n}</span>
                <span>
                  <span className="block font-raleway text-cosmic-cream text-sm font-semibold mb-1">{s.title}</span>
                  <span className="block font-raleway text-cosmic-cream/55 text-xs leading-relaxed">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Paths ────────────────────────────────────────────────────────── */}
      <section id="paths" className="px-4 py-16 md:py-24 scroll-mt-24" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic">
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <p className={`${eyebrowCls} mb-3`}>Start with what you need</p>
              <h2 className="font-cinzel text-cosmic-cream mb-3" style={{ fontSize: 'clamp(2rem, 4vw, 3rem)' }}>What brings you here?</h2>
              <p className="font-raleway text-cosmic-cream/55 text-sm">Explore a path that feels right. There&apos;s no need to know the terminology.</p>
            </div>
            <a href={WA_HELP} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-raleway text-xs text-cosmic-cream/70 hover:text-cosmic-gold transition-colors">
              <Sparkles size={13} className="text-cosmic-gold" /> Not sure? Let us guide you <ArrowUpRight size={13} />
            </a>
          </div>

          <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Filter sessions by need">
            {NEEDS.map(n => (
              <button key={n.key} type="button" role="tab" aria-selected={need === n.key} onClick={() => setNeed(n.key)}
                className={`font-raleway text-xs px-4 py-2 rounded-full border transition-colors ${
                  need === n.key
                    ? 'bg-cosmic-gold text-cosmic-ink border-cosmic-gold'
                    : 'border-cosmic-gold/20 text-cosmic-cream/70 hover:border-cosmic-gold/50 hover:text-cosmic-cream'
                }`}>
                {n.label}
              </button>
            ))}
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {shown.map(p => (
              <Link key={p.slug} href={`/${p.slug}`}
                className="group cosmic-card flex flex-col overflow-hidden rounded-md">
                <div className="relative h-36 flex items-center justify-center overflow-hidden"
                  style={{ background: `linear-gradient(180deg, rgb(${p.tint} / 0.22), rgb(${p.tint} / 0.08))` }}>
                  <svg className="absolute inset-0 w-full h-full text-cosmic-gold/15" viewBox="0 0 300 140" preserveAspectRatio="none" aria-hidden="true">
                    <path d="M0 120 Q150 10 300 120" fill="none" stroke="currentColor" strokeWidth="1" />
                  </svg>
                  <PathArt kind={p.art} className="relative w-32 h-24 text-cosmic-gold/80 transition-transform duration-500 group-hover:scale-105" />
                </div>
                <div className="flex flex-col flex-1 p-6">
                  <p className="font-raleway text-cosmic-gold/80 text-[10px] tracking-[0.25em] uppercase mb-2">{p.eyebrow}</p>
                  <h3 className="font-cinzel text-cosmic-cream text-xl mb-2">{p.title}</h3>
                  <p className="font-raleway text-cosmic-cream/60 text-sm leading-relaxed mb-5">{p.description}</p>
                  <p className="font-raleway text-cosmic-cream/40 text-[11px] mb-5 mt-auto">{p.includes}</p>
                  <div className="flex items-center justify-between pt-4 border-t border-cosmic-gold/10">
                    <span className="font-raleway text-cosmic-cream text-xs font-semibold">View sessions</span>
                    <span className="w-8 h-8 rounded-full border border-cosmic-gold/25 flex items-center justify-center text-cosmic-gold group-hover:bg-cosmic-gold group-hover:text-cosmic-ink transition-colors">
                      <ArrowUpRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* First-session help */}
          <div className="mt-12 cosmic-card rounded-md px-6 py-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-start gap-4">
              <Sparkles size={26} strokeWidth={1.2} className="text-cosmic-gold shrink-0 mt-1" />
              <div>
                <p className="font-cinzel text-cosmic-cream text-base mb-1">Your first session? You&apos;re in the right place.</p>
                <p className="font-raleway text-cosmic-cream/55 text-sm">Tell us a little about what you&apos;re looking for. We&apos;ll help you explore the options.</p>
              </div>
            </div>
            <a href={WA_FIRST} target="_blank" rel="noopener noreferrer" className="btn-outline text-xs">
              <MessageCircle size={14} /> Ask us on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Meet your guide ──────────────────────────────────────────────── */}
      <section className="px-4 py-16 md:py-24 border-y border-cosmic-gold/10" style={{ background: 'rgb(var(--cosmic-deep-purple) / 0.5)' }}>
        <div className="container-cosmic grid md:grid-cols-2 gap-10 md:gap-16">
          <div>
            <p className={`${eyebrowCls} mb-4`}>A human connection</p>
            <h2 className="font-cinzel text-cosmic-cream mb-6" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)' }}>Meet the person<br />behind your session.</h2>
            <Link href="/about" className="inline-flex items-center gap-2 font-raleway text-sm text-cosmic-cream/80 hover:text-cosmic-gold border-b border-cosmic-gold/30 pb-0.5 transition-colors">
              More about Dr. Usha Bhatt <ArrowUpRight size={14} />
            </Link>
          </div>
          <div className="flex gap-5">
            <Sparkles size={26} strokeWidth={1.2} className="text-cosmic-gold shrink-0 mt-1 hidden sm:block" />
            <div>
              <h3 className="font-cinzel text-cosmic-cream text-2xl mb-4 leading-snug">Spiritual insight.<br />Grounded conversation.</h3>
              <p className="font-raleway text-cosmic-cream/65 text-sm leading-relaxed mb-4">
                Dr. Usha Bhatt brings over 20 years of experience across Tarot, Reiki, crystal therapy and other spiritual
                practices. Her background in training and counselling shapes an empathetic, practical approach.
              </p>
              <p className="font-raleway text-cosmic-cream/65 text-sm leading-relaxed mb-6">
                Her work invites you to explore your circumstances, patterns and choices — with space for your own perspective.
              </p>
              <div className="flex flex-wrap gap-2">
                {['Tarot Grand Master', 'Reiki practitioner', 'Spiritual guide'].map(t => (
                  <span key={t} className="font-raleway text-[11px] text-cosmic-cream/60 border border-cosmic-gold/20 rounded-full px-3 py-1">{t}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="px-4 py-16 md:py-24" style={{ background: 'rgb(var(--cosmic-black))' }}>
        <div className="container-cosmic grid md:grid-cols-[1fr_1.5fr] gap-10 md:gap-16">
          <div>
            <p className={`${eyebrowCls} mb-4`}>A little reassurance</p>
            <h2 className="font-cinzel text-cosmic-cream mb-3" style={{ fontSize: 'clamp(1.9rem, 3.5vw, 2.7rem)' }}>Before you begin.</h2>
            <p className="font-raleway text-cosmic-cream/55 text-sm mb-6">New to this? It&apos;s okay to have questions.</p>
            <a href={WA_QUESTION} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 font-raleway text-sm text-cosmic-cream/80 hover:text-cosmic-gold border-b border-cosmic-gold/30 pb-0.5 transition-colors">
              Ask us something else <ArrowUpRight size={14} />
            </a>
          </div>
          <div className="border-t border-cosmic-gold/15">
            {FAQS.map(f => (
              <details key={f.q} className="group border-b border-cosmic-gold/15">
                <summary className="flex items-center justify-between gap-4 py-5 cursor-pointer list-none font-raleway text-cosmic-cream text-sm md:text-base">
                  {f.q}
                  <Plus size={16} className="text-cosmic-gold shrink-0 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-raleway text-cosmic-cream/60 text-sm leading-relaxed pb-5 pr-8">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Closing CTA ─────────────────────────────────────────────────── */}
      <section className="px-4 py-16 md:py-20 text-center border-t border-cosmic-gold/10" style={{ background: 'rgb(var(--cosmic-deep-purple))' }}>
        <Sparkles size={22} strokeWidth={1.2} className="text-cosmic-gold mx-auto mb-5" />
        <h2 className="font-cinzel text-cosmic-cream mb-3" style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)' }}>You can start with a question.</h2>
        <p className="font-raleway text-cosmic-cream/60 text-sm mb-8">You don&apos;t have to choose alone. We&apos;re here to help you take the next step.</p>
        <a href={WA_HELP} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs">Talk to our team</a>
        <p className="font-raleway text-cosmic-cream/50 text-xs mt-5">
          or call <a href={`tel:${PHONE_TEL}`} className="text-cosmic-cream/80 hover:text-cosmic-gold inline-flex items-center gap-1"><Phone size={11} /> {PHONE_DISPLAY}</a>
        </p>
      </section>
    </Layout>
  )
}
