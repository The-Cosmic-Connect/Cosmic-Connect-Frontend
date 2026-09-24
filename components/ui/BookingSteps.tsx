import { ChevronRight } from 'lucide-react'

export type BookingStep = 'agent' | 'service' | 'slot'

const STEPS: { key: BookingStep; label: string }[] = [
  { key: 'agent',   label: 'Choose Healer' },
  { key: 'service', label: 'Select Service' },
  { key: 'slot',    label: 'Pick Time' },
]

// Shared 1-2-3 progress bar for the booking flow. Extracted out of
// pages/services/index.tsx (which previously drew it inline, keyed off its
// own local `step` state) so it can also appear on the pages that make up
// the *real* booking journey for Dr. Usha Bhatt (currently the only active
// healer) — that journey never touches index.tsx's step-2/step-3 UI at all,
// since picking her on /services immediately redirects to
// /booking-usha-bhatt instead:
//   Step 1 "Choose Healer" — /services (its own agent-picker; only reachable
//     for a healer other than Usha, since selecting her redirects away).
//   Step 2 "Select Service" — components/sections/ServiceCategoryPage.tsx,
//     the per-category list of bookable services.
//   Step 3 "Pick Time"      — pages/services/book.tsx.
// Steps before the current one render as "completed" (soft gold) rather
// than plain gray, since on the category page, for example, a healer has
// implicitly already been settled on.
export default function BookingSteps({ current }: { current: BookingStep }) {
  const currentIndex = STEPS.findIndex(s => s.key === current)

  return (
    <div className="flex items-center justify-center gap-3">
      {STEPS.map((s, i) => (
        <div key={s.key} className="flex items-center gap-3">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full border font-raleway text-xs font-bold transition-all ${
            s.key === current ? 'border-cosmic-gold bg-cosmic-gold text-cosmic-ink'
            : i < currentIndex ? 'border-cosmic-gold/60 bg-cosmic-gold/20 text-cosmic-gold'
            : 'border-cosmic-gold/20 text-cosmic-cream/30'
          }`}>
            {i + 1}
          </div>
          <span className={`font-raleway text-xs tracking-widest uppercase hidden sm:block ${
            s.key === current ? 'text-cosmic-gold'
            : i < currentIndex ? 'text-cosmic-gold/60'
            : 'text-cosmic-cream/30'
          }`}>
            {s.label}
          </span>
          {i < STEPS.length - 1 && <ChevronRight size={14} className="text-cosmic-gold/20" />}
        </div>
      ))}
    </div>
  )
}
