// components/shop/BrowseTiles.tsx
// A responsive grid of "browse" cards (image + title + product count), used by
// the Shop-by-Crystal and Shop-by-Purpose landing pages.
//
// Each tile can carry a primary `image` (e.g. an S3 cover) and a `fallback`
// (a representative product photo). If both 404 or are missing, the tile shows
// a minimal placeholder — a warm gradient with the name and a small ornament,
// so the grid always looks intentional rather than broken.
import { useState } from 'react'
import Link from 'next/link'

export interface BrowseTile {
  name: string
  count: number
  image: string       // primary cover url (may be '')
  href: string
  fallback?: string   // product photo to use if cover is missing
  icon?: string       // emoji fallback (kept for compatibility; not used)
}

function PlaceholderArt({ name }: { name: string }) {
  // Initials kept short — pick the first letter of the first two words.
  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0] || '')
    .join('')
    .toUpperCase()

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-4"
      style={{
        background:
          'radial-gradient(ellipse 70% 60% at 50% 35%, rgb(var(--cosmic-gold) / 0.10), transparent 70%),' +
          'linear-gradient(180deg, rgb(var(--cosmic-purple) / 0.7) 0%, rgb(var(--cosmic-deep-purple)) 100%)',
      }}>
      <span className="font-cinzel text-cosmic-gold/50 font-light"
        style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', letterSpacing: '0.15em' }}>
        {initials}
      </span>
      <div className="mt-2.5 w-10 h-px bg-cosmic-gold/35" />
      <p className="font-cormorant italic text-cosmic-cream/45 text-xs mt-2.5 text-center leading-tight">
        {name}
      </p>
    </div>
  )
}

function Tile({ t }: { t: BrowseTile }) {
  const sources = [t.image, t.fallback].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const src = sources[idx]
  const hasImage = !!src

  return (
    <Link href={t.href} className="group block">
      <div className="relative overflow-hidden rounded-sm border border-cosmic-gold/10 bg-cosmic-deepPurple
        hover:border-cosmic-gold/40 transition-all duration-400 hover:-translate-y-1
        hover:shadow-[0_8px_30px_rgb(var(--cosmic-gold)/0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          {hasImage ? (
            <>
              <img src={src} alt={t.name}
                onError={() => setIdx((i) => i + 1)}
                className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108" />
              {/* Title sits on a subtle bottom gradient so it reads on any photo */}
              <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/75 via-cosmic-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="font-cinzel text-cosmic-cream font-medium text-sm leading-snug tracking-wide
                  group-hover:text-cosmic-gold transition-colors duration-300">
                  {t.name}
                </h3>
              </div>
            </>
          ) : (
            <PlaceholderArt name={t.name} />
          )}
        </div>

        {/* Bottom strip: count (tabular sans) + view affordance */}
        <div className="px-4 py-3 flex items-center justify-between border-t border-cosmic-gold/10">
          <span className="font-raleway text-cosmic-cream/55 text-[12px] tracking-wide tabular-nums">
            <span className="text-cosmic-cream/85 font-medium">{t.count.toLocaleString()}</span>
            <span className="ml-1 text-cosmic-cream/45">{t.count === 1 ? 'product' : 'products'}</span>
          </span>
          <span className="font-raleway text-cosmic-gold text-[11px] tracking-[0.2em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            View →
          </span>
        </div>
      </div>
    </Link>
  )
}

export default function BrowseTiles({ tiles }: { tiles: BrowseTile[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {tiles.map((t) => <Tile key={t.name} t={t} />)}
    </div>
  )
}
