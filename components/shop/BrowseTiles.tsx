// components/shop/BrowseTiles.tsx
// A responsive grid of "browse" cards (image + title + product count), used by
// the Shop-by-Crystal and Shop-by-Purpose landing pages.
//
// Each tile can carry a primary `image` (e.g. an S3 cover) and a `fallback`
// (a representative product photo). If the cover 404s or is missing, the tile
// silently downgrades: cover -> fallback -> emoji icon. So the grid always
// looks complete while you upload covers.
import { useState } from 'react'
import Link from 'next/link'

export interface BrowseTile {
  name: string
  count: number
  image: string       // primary cover url (may be '')
  href: string
  fallback?: string   // product photo to use if cover is missing
  icon?: string       // emoji fallback when no image at all
}

function Tile({ t }: { t: BrowseTile }) {
  const sources = [t.image, t.fallback].filter(Boolean) as string[]
  const [idx, setIdx] = useState(0)
  const src = sources[idx]

  return (
    <Link href={t.href} className="group block">
      <div className="relative overflow-hidden rounded-sm border border-cosmic-gold/10 bg-cosmic-deepPurple
        hover:border-cosmic-gold/40 transition-all duration-400 hover:-translate-y-1
        hover:shadow-[0_8px_30px_rgb(var(--cosmic-gold)/0.12)]">
        <div className="relative aspect-[4/3] overflow-hidden">
          {src ? (
            <img src={src} alt={t.name}
              onError={() => setIdx((i) => i + 1)}
              className="w-full h-full object-cover transition-transform duration-600 group-hover:scale-108" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-5xl"
              style={{ background: 'linear-gradient(135deg, rgb(var(--cosmic-violet) / 0.4), rgb(var(--cosmic-black) / 0.8))' }}>
              {t.icon || '✦'}
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-cosmic-black/80 via-cosmic-black/20 to-transparent" />
          <div className="absolute top-3 right-3 bg-cosmic-black/60 backdrop-blur-sm border border-cosmic-gold/30 px-2 py-0.5 rounded-sm">
            <span className="font-raleway text-cosmic-gold text-xs tracking-widest">{t.count}</span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-cinzel text-cosmic-cream font-semibold text-sm leading-snug
              group-hover:text-cosmic-gold transition-colors duration-300">
              {t.name}
            </h3>
          </div>
        </div>
        <div className="px-4 py-3 flex items-center justify-between border-t border-cosmic-gold/10">
          <span className="font-cormorant text-cosmic-cream/50 text-sm italic">{t.count} products</span>
          <span className="font-raleway text-cosmic-gold text-xs tracking-widest uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300">
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
