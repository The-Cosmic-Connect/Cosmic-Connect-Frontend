import { useState } from 'react'
import Link from 'next/link'
import { Play } from 'lucide-react'

// Mirrors admin/components/cms/blockTypes.ts — the admin writes these
// shapes, this file reads them. Kept as a plain duplicate rather than a
// shared package since admin/frontend are separate repos/deploys (same
// pattern already used for the category/course lists in cms.tsx).
interface HeadingBlock  { id: string; type: 'heading';   text: string; level: 2 | 3 }
interface ParagraphBlock { id: string; type: 'paragraph'; html: string }
interface ImageBlock    { id: string; type: 'image';     url: string; alt: string; caption: string }
interface YoutubeBlock  { id: string; type: 'youtube';   videoId: string; url: string; caption: string }
interface ButtonBlock   { id: string; type: 'button';    label: string; href: string; style: 'primary' | 'outline' }
interface DividerBlock  { id: string; type: 'divider' }
interface FaqBlock      { id: string; type: 'faq';       items: { q: string; a: string }[] }
interface HtmlBlock     { id: string; type: 'html';      html: string }

export type CmsBlock =
  | HeadingBlock | ParagraphBlock | ImageBlock | YoutubeBlock
  | ButtonBlock | DividerBlock | FaqBlock | HtmlBlock

// Click-to-play YouTube embed: shows the real thumbnail (no API key needed —
// YouTube serves these from a predictable URL per video ID) and only loads
// the actual YouTube iframe once the visitor clicks play, so the page stays
// fast until then.
function YoutubeBlockView({ block }: { block: YoutubeBlock }) {
  const [playing, setPlaying] = useState(false)
  const [thumb, setThumb] = useState(`https://img.youtube.com/vi/${block.videoId}/maxresdefault.jpg`)

  if (!block.videoId) return null

  return (
    <figure className="my-8">
      <div className="relative aspect-video rounded-sm overflow-hidden border border-cosmic-gold/20 bg-black">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${block.videoId}?autoplay=1&rel=0`}
            title="YouTube video player"
            allow="autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
            aria-label="Play video"
          >
            <img
              src={thumb}
              onError={() => setThumb(`https://img.youtube.com/vi/${block.videoId}/hqdefault.jpg`)}
              alt=""
              className="w-full h-full object-cover"
            />
            <span className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/45 transition-colors">
              <span className="w-16 h-16 rounded-full bg-cosmic-gold/90 flex items-center justify-center shadow-gold group-hover:scale-110 transition-transform">
                <Play size={26} className="text-cosmic-ink ml-1" fill="currentColor" />
              </span>
            </span>
          </button>
        )}
      </div>
      {block.caption && (
        <figcaption className="font-cormorant italic text-cosmic-cream/40 text-sm text-center mt-2">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function BlockView({ block }: { block: CmsBlock }) {
  switch (block.type) {
    case 'heading': {
      if (!block.text) return null
      const cls = block.level === 3
        ? 'font-cinzel text-cosmic-cream text-xl md:text-2xl font-bold mt-8 mb-3'
        : 'font-cinzel text-cosmic-cream text-2xl md:text-3xl font-bold mt-10 mb-4'
      return block.level === 3 ? <h3 className={cls}>{block.text}</h3> : <h2 className={cls}>{block.text}</h2>
    }
    case 'paragraph':
      if (!block.html) return null
      return (
        <div
          className="font-cormorant text-cosmic-cream/75 text-lg leading-relaxed mb-5"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )
    case 'image':
      if (!block.url) return null
      return (
        <figure className="my-8">
          <img
            src={block.url}
            alt={block.alt || ''}
            className="w-full rounded-sm border border-cosmic-gold/20 object-cover"
          />
          {block.caption && (
            <figcaption className="font-cormorant italic text-cosmic-cream/40 text-sm text-center mt-2">
              {block.caption}
            </figcaption>
          )}
        </figure>
      )
    case 'youtube':
      return <YoutubeBlockView block={block} />
    case 'button': {
      if (!block.label || !block.href) return null
      const cls = block.style === 'outline' ? 'btn-outline' : 'btn-primary'
      const isExternal = /^https?:\/\//i.test(block.href)
      return (
        <div className="my-6 text-center">
          {isExternal ? (
            <a href={block.href} target="_blank" rel="noopener noreferrer" className={cls}>{block.label}</a>
          ) : (
            <Link href={block.href} className={cls}>{block.label}</Link>
          )}
        </div>
      )
    }
    case 'divider':
      return <div className="gold-divider my-10" />
    case 'faq':
      if (!block.items?.length) return null
      return (
        <div className="space-y-3 my-8">
          {block.items.filter(it => it.q).map((it, i) => (
            <details key={i} className="border border-cosmic-gold/15 rounded-sm p-4 group">
              <summary className="font-cinzel text-cosmic-cream cursor-pointer list-none flex items-center justify-between">
                {it.q}
                <span className="text-cosmic-gold/50 group-open:rotate-45 transition-transform ml-3">+</span>
              </summary>
              <p className="font-cormorant text-cosmic-cream/60 mt-3 leading-relaxed">{it.a}</p>
            </details>
          ))}
        </div>
      )
    case 'html':
      if (!block.html) return null
      return (
        <div
          className="font-cormorant text-cosmic-cream/75 text-lg leading-relaxed mb-5"
          dangerouslySetInnerHTML={{ __html: block.html }}
        />
      )
  }
}

export default function BlockRenderer({
  blocks, fallbackHtml,
}: { blocks?: CmsBlock[]; fallbackHtml?: string }) {
  if (blocks && blocks.length > 0) {
    return (
      <div className="cms-body">
        {blocks.map(block => <BlockView key={block.id} block={block} />)}
      </div>
    )
  }

  // Safety net for a page saved before the block editor existed that was
  // never re-opened/re-saved in the admin (so it never got auto-migrated
  // into a single HTML block) — render its old bodyHtml directly, same as
  // this page always did before.
  if (fallbackHtml) {
    return (
      <div
        className="cms-body font-cormorant text-cosmic-cream/75 text-lg leading-relaxed"
        dangerouslySetInnerHTML={{ __html: fallbackHtml }}
      />
    )
  }

  return null
}
