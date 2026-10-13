// Service "paths" shown on /services and used by the session finder.
// Each path is one of the 7 booking categories (lib/serviceCategories.ts).
import type { PathArtKind } from '@/components/services/PathArt'

export type Need = 'clarity' | 'calm' | 'discovery' | 'support'

export const NEEDS: { key: Need | 'all'; label: string }[] = [
  { key: 'all', label: 'All sessions' },
  { key: 'clarity', label: 'Clarity & direction' },
  { key: 'calm', label: 'Calm & balance' },
  { key: 'discovery', label: 'Self-discovery' },
  { key: 'support', label: 'Spiritual support' },
]

export interface Path {
  slug: string            // existing category page (lib/serviceCategories.ts)
  eyebrow: string
  title: string
  description: string
  includes: string
  art: PathArtKind
  tint: string            // RGB channels for the soft card-header wash
  needs: Need[]
}

export const PATHS: Path[] = [
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


export const pathBySlug = (slug: string) => PATHS.find(p => p.slug === slug)

// Tap-through questions for the session finder (used when someone would
// rather tap than type, or when the AI is unavailable).
export const TOPICS: { label: string; slugs: string[] }[] = [
  { label: 'A decision or a question about my future', slugs: ['tarot-reading-services', 'pendulum-dowsing-gem-stone-counselling'] },
  { label: 'Relationships or family', slugs: ['tarot-reading-services', 'reiki-crystal-photo-healing'] },
  { label: 'Feeling drained, anxious or unsettled', slugs: ['reiki-crystal-photo-healing', 'sound-healing-services'] },
  { label: 'I just want to relax and reset', slugs: ['sound-healing-services', 'reiki-crystal-photo-healing'] },
  { label: 'The same patterns keep repeating', slugs: ['akashic-mokshapat-pastlife', 'tarot-reading-services'] },
  { label: 'Something negative feels around me', slugs: ['black-magic-evil-eye-removal', 'crystal-grids'] },
  { label: 'Career, money or prosperity', slugs: ['crystal-grids', 'tarot-reading-services'] },
  { label: "I'm not sure — I'd like to talk it through", slugs: ['pendulum-dowsing-gem-stone-counselling'] },
]
