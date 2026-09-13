// The 7 booking-flow service categories, matching the equivalent pages on the
// old thecosmicconnect.com (Wix) site — slugs kept identical for URL/SEO
// continuity, since the plan is to eventually point thecosmicconnect.com at
// this app. Each slug must match a page file in frontend/pages/ and the
// `category` field admins assign to a Service in the admin panel.

export interface ServiceCategory {
  slug: string
  title: string       // category card headline (matches old site copy)
  tagline: string      // one-line description (matches old site copy)
  icon: string          // lucide-react icon name, rendered by the caller
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: 'tarot-reading-services',
    title: "Unlock Life's Mysteries",
    tagline: 'Guiding Souls, Families & Spirits with Tarot Reading Insights',
    icon: 'Sparkles',
  },
  {
    slug: 'akashic-mokshapat-pastlife',
    title: 'Soul Legacy Healing',
    tagline: 'Healing Lifetimes, Clearing Karma: Past Life Regression, Mokshapat & Akashic Reading',
    icon: 'Infinity',
  },
  {
    slug: 'reiki-crystal-photo-healing',
    title: 'Energy Healing Modalities',
    tagline: 'Harmonizing Hearts, Healing Spirits: Reiki, Animal, Crystal & Distance Healing',
    icon: 'Zap',
  },
  {
    slug: 'sound-healing-services',
    title: 'Sound Healing',
    tagline: 'Ancient Sounds for Modern Healing',
    icon: 'Music',
  },
  {
    slug: 'black-magic-evil-eye-removal',
    title: 'Shielding from Dark Energies',
    tagline: 'Empowering Protection: Black Magic & Evil Eye - Scanning & Negation',
    icon: 'ShieldAlert',
  },
  {
    slug: 'crystal-grids',
    title: 'Sacred Crystal Alchemy',
    tagline: 'Weaving protection, healing, and prosperity through the power of crystal grids',
    icon: 'Gem',
  },
  {
    slug: 'pendulum-dowsing-gem-stone-counselling',
    title: 'SoulPath Guidance',
    tagline: 'Discover clarity and balance through gemstones, pendulum dowsing, and heartfelt guidance',
    icon: 'Compass',
  },
]

export function getCategoryBySlug(slug: string): ServiceCategory | undefined {
  return SERVICE_CATEGORIES.find(c => c.slug === slug)
}
