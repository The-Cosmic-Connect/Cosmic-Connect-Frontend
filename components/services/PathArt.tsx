// Simple line illustrations for the service-path cards on /services.
// Drawn with currentColor so they follow the site theme (gold on dark,
// grey/black on the light theme).
export type PathArtKind = 'tarot' | 'lotus' | 'mandala' | 'bowl' | 'shield' | 'crystals' | 'pendulum'

export default function PathArt({ kind, className = '' }: { kind: PathArtKind; className?: string }) {
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.3, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
  return (
    <svg viewBox="0 0 120 80" className={className} aria-hidden="true" {...common}>
      {kind === 'tarot' && (<>
        <rect x="34" y="16" width="24" height="38" rx="2" transform="rotate(-14 46 35)" />
        <rect x="62" y="16" width="24" height="38" rx="2" transform="rotate(14 74 35)" />
        <rect x="48" y="12" width="24" height="40" rx="2" />
        <path d="M60 22l2.2 6.3 6.3 2.2-6.3 2.2L60 39l-2.2-6.3-6.3-2.2 6.3-2.2z" />
        <path d="M22 30l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </>)}
      {kind === 'lotus' && (<>
        <path d="M60 18c7 8 9 18 0 30-9-12-7-22 0-30z" />
        <path d="M60 48c-4-10-14-16-24-15 2 9 11 16 24 15z" />
        <path d="M60 48c4-10 14-16 24-15-2 9-11 16-24 15z" />
        <path d="M60 48c-9-3-19-1-28 6 9 4 19 3 28-6z" />
        <path d="M60 48c9-3 19-1 28 6-9 4-19 3-28-6z" />
        <path d="M40 60h40" />
      </>)}
      {kind === 'mandala' && (<>
        <circle cx="60" cy="38" r="22" />
        <circle cx="60" cy="38" r="13" />
        <path d="M60 16v44M38 38h44M44.4 22.4l31.2 31.2M75.6 22.4L44.4 53.6" />
        <circle cx="60" cy="38" r="3" />
        <path d="M22 22l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </>)}
      {kind === 'bowl' && (<>
        <path d="M34 42h44c0 12-10 20-22 20s-22-8-22-20z" />
        <path d="M40 66h32" />
        <path d="M80 18l-12 22" /><circle cx="81" cy="16" r="3" />
        <path d="M48 22c-2 3 2 6 0 9M56 18c-2 3 2 6 0 9M64 22c-2 3 2 6 0 9" />
      </>)}
      {kind === 'shield' && (<>
        <path d="M60 14l20 7v15c0 13-9 22-20 27-11-5-20-14-20-27V21z" />
        <path d="M60 28l2.4 6.1 6.1 2.4-6.1 2.4L60 45l-2.4-6.1-6.1-2.4 6.1-2.4z" />
        <path d="M30 28l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM90 22l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
      </>)}
      {kind === 'crystals' && (<>
        <path d="M60 12l9 12-3 34h-12l-3-34z" /><path d="M51 24h18M60 12v46" />
        <path d="M36 30l7 9-2 21h-10l-2-21z" /><path d="M29 39h14" />
        <path d="M84 30l7 9-2 21h-10l-2-21z" /><path d="M77 39h14" />
        <path d="M60 4v3M48 8l2 2M72 8l-2 2" />
      </>)}
      {kind === 'pendulum' && (<>
        <path d="M60 8v30" /><path d="M50 38h20l-10 22z" /><path d="M50 38l10 6 10-6" />
        <path d="M36 50l1 3 3 1-3 1-1 3-1-3-3-1 3-1zM84 24l1 3 3 1-3 1-1 3-1-3-3-1 3-1z" />
        <path d="M40 68h40" />
      </>)}
    </svg>
  )
}
