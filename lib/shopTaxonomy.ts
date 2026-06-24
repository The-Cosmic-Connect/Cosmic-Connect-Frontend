// lib/shopTaxonomy.ts
// ---------------------------------------------------------------------------
// Curated grouping of the flat product `collections` into parent categories,
// used by the Shop landing page and the navbar "Shop" mega-menu. Editing the
// groups/icons here updates both places at once.
//
// `items` must match your real collection NAMES exactly (same strings the
// /collections endpoint returns) so the links resolve to the right listing.
// Any collection that exists in your data but isn't listed here is shown
// automatically under "More Collections", so nothing ever gets hidden.
// ---------------------------------------------------------------------------

export function toSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

export const CATEGORY_ICONS: Record<string, string> = {
  'Bracelets': '📿',
  'Zodiac Bracelets': '♈',
  'Therapy Bracelets': '💚',
  'Raw / Rough Stones': '🪨',
  'Tumble Stones': '💎',
  'Crystal Clusters': '✨',
  'Towers, Wands & Pencils': '🔮',
  'Balls & Spheres': '🔵',
  'Pyramids': '🔺',
  'Puffy Hearts': '💜',
  'Palm Stones': '🖐️',
  'Crystal Tree': '🌳',
  'Rollers & Gua Sha': '🌿',
  'Pendants & Jewellery': '💍',
  'Angels': '👼',
  'Idols & Figurines': '🪷',
  'Evil Eye Products': '🧿',
  'Jap Mala': '📿',
  'Rudraksh': '🌰',
  'Feng Shui': '☯️',
  'Dowsers': '🌀',
  'Energy Generator Orgones': '⚡',
  'Intention Coin': '🪙',
  'Sage & Incense': '🌿',
  'Cleansing & Charging': '🌙',
  'Meditation Essentials': '🧘',
  'Energized Water': '💧',
  'Lamp': '🕯️',
}

export interface CategoryGroup {
  title: string
  icon: string
  items: string[]   // collection names, in display order
}

export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    title: 'Bracelets & Malas',
    icon: '📿',
    items: ['Bracelets', 'Zodiac Bracelets', 'Therapy Bracelets', 'Jap Mala', 'Rudraksh'],
  },
  {
    title: 'Jewellery',
    icon: '💍',
    items: ['Pendants & Jewellery'],
  },
  {
    title: 'Raw & Natural',
    icon: '🪨',
    items: ['Raw / Rough Stones', 'Tumble Stones', 'Crystal Clusters'],
  },
  {
    title: 'Shapes & Figures',
    icon: '🔮',
    items: [
      'Towers, Wands & Pencils', 'Balls & Spheres', 'Pyramids',
      'Puffy Hearts', 'Palm Stones', 'Crystal Tree', 'Angels', 'Idols & Figurines',
    ],
  },
  {
    title: 'Healing Tools',
    icon: '🌿',
    items: ['Rollers & Gua Sha', 'Dowsers', 'Energy Generator Orgones', 'Intention Coin'],
  },
  {
    title: 'Home & Vaastu',
    icon: '☯️',
    items: ['Feng Shui', 'Lamp', 'Evil Eye Products'],
  },
  {
    title: 'Rituals & Cleansing',
    icon: '🌙',
    items: ['Sage & Incense', 'Cleansing & Charging', 'Meditation Essentials', 'Energized Water'],
  },
]

/**
 * Buckets a list of category objects (anything with a `name`) into the parent
 * groups above, preserving the curated order. Categories not in any group are
 * collected under "More Collections" so they always remain visible.
 */
export function groupCategories<T extends { name: string }>(
  cats: T[],
): { title: string; icon: string; items: T[] }[] {
  const byName = new Map(cats.map((c) => [c.name, c]))
  const used = new Set<string>()

  const groups = CATEGORY_GROUPS.map((g) => {
    const items: T[] = []
    for (const name of g.items) {
      const c = byName.get(name)
      if (c) {
        items.push(c)
        used.add(name)
      }
    }
    return { title: g.title, icon: g.icon, items }
  }).filter((g) => g.items.length > 0)

  const leftover = cats.filter((c) => !used.has(c.name))
  if (leftover.length) {
    groups.push({ title: 'More Collections', icon: '✦', items: leftover })
  }
  return groups
}

// ── Category cover images (parallel to crystal covers) ────────────────────────
// When you have custom photos per category, set the base URL and list each
// category's filename below. Until then, categories use a representative
// product photo automatically (handled by pages/shop/categories.tsx).
//
//   export const CATEGORY_IMAGE_BASE =
//     'https://your-bucket.s3.ap-south-1.amazonaws.com/categories'
// and add entries like
//   'Bracelets': 'Bracelets_1.webp',
export const CATEGORY_IMAGE_BASE = ''
export const CATEGORY_COVER_FILES: Record<string, string> = {
  // 'Bracelets': 'Bracelets_1.webp',
}
export function categoryCoverUrl(name: string): string {
  const file =
    CATEGORY_COVER_FILES[name] ||
    Object.entries(CATEGORY_COVER_FILES).find(([k]) => k.toLowerCase() === name.toLowerCase())?.[1]
  return file && CATEGORY_IMAGE_BASE
    ? `${CATEGORY_IMAGE_BASE}/${encodeURIComponent(file)}`
    : ''
}
