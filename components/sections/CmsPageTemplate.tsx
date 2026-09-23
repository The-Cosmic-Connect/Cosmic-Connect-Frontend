import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Sparkles } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import CalendlyPopup from '@/components/ui/CalendlyPopup'
import EnrollModal from '@/components/courses/EnrollModal'
import BlockRenderer, { type CmsBlock } from '@/components/cms/BlockRenderer'
import { getCategoryBySlug } from '@/lib/serviceCategories'
import { getCourseBySlug } from '@/lib/coursesData'

export interface CmsPage {
  id: string
  slug: string
  title: string
  seoTitle: string
  seoDesc: string
  tagline: string
  heroImage: string
  icon: string
  accentColor: string
  // Legacy content field from before the drag-and-drop block editor — only
  // used now as a fallback render path (see BlockRenderer) for a page that
  // was never re-opened/re-saved in the admin after the block editor shipped.
  bodyHtml: string
  blocks?: CmsBlock[]
  boundCategorySlug: string | null
  boundCourseSlug: string | null
  isPublished: boolean
}

// Renders an admin-authored CMS page (see admin's CMS tab) — the target of
// a "Know More" button, either on a category card (/booking-usha-bhatt) or
// on a course card (/courses). Visually modelled on ServicePageTemplate,
// but content-driven from the CMS row instead of a hardcoded data file.
export default function CmsPageTemplate({ page }: { page: CmsPage }) {
  const [calendlyOpen, setCalendlyOpen] = useState(false)
  const [enrollOpen,   setEnrollOpen]   = useState(false)

  const category = page.boundCategorySlug ? getCategoryBySlug(page.boundCategorySlug) : undefined
  // Courses have no backend record — they're a hardcoded lookup, same as
  // categories, so no fetch is needed here (unlike a database-backed bind
  // target would require).
  const course = page.boundCourseSlug ? getCourseBySlug(page.boundCourseSlug) : undefined
  const accent = page.accentColor || course?.accentColor || '#C9A84C'
  const backLink = category ? `/${category.slug}` : course ? '/courses' : '/booking-usha-bhatt'
  const backLabel = category ? 'All Categories' : course ? 'All Courses' : 'All Categories'

  return (
    <>
      <Layout
        title={page.seoTitle || `${page.title} | The Cosmic Connect`}
        description={page.seoDesc || page.tagline || page.title}
        canonical={`/learn/${page.slug}`}
      >
        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          className="relative pt-36 pb-16 px-4 overflow-hidden"
          style={{ background: 'linear-gradient(180deg, rgb(var(--cosmic-deep-purple)) 0%, rgb(var(--cosmic-black)) 100%)' }}
        >
          <div
            className="absolute inset-0 pointer-events-none"
            style={{ background: `radial-gradient(ellipse 60% 50% at 50% 40%, ${accent}18, transparent 70%)` }}
          />
          <div className="container-cosmic relative z-10 text-center max-w-2xl mx-auto">
            <Link
              href={backLink}
              className="inline-flex items-center gap-1 font-raleway text-cosmic-cream/40 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-6 transition-colors"
            >
              <ArrowLeft size={14} /> {backLabel}
            </Link>

            {page.icon && <p className="text-5xl mb-4">{page.icon}</p>}

            <h1 className="font-cinzel font-bold text-cosmic-cream mb-4" style={{ fontSize: 'clamp(2rem, 5vw, 3rem)' }}>
              {page.title}
            </h1>

            {page.tagline && (
              <p className="font-cormorant italic text-cosmic-cream/60 text-xl">{page.tagline}</p>
            )}
          </div>
        </section>

        {/* ── HERO IMAGE (optional) ────────────────────────────────────── */}
        {page.heroImage && (
          <section className="px-4 -mt-6 relative z-10">
            <div className="container-cosmic max-w-4xl">
              <img
                src={page.heroImage}
                alt={page.title}
                className="w-full aspect-video object-cover rounded-sm border border-cosmic-gold/20"
              />
            </div>
          </section>
        )}

        {/* ── BODY ──────────────────────────────────────────────────────── */}
        <section className="section bg-cosmic-section">
          <div className="container-cosmic max-w-3xl">
            <BlockRenderer blocks={page.blocks} fallbackHtml={page.bodyHtml} />
          </div>
        </section>

        {/* ── CTA ───────────────────────────────────────────────────────── */}
        <section
          className="py-16 px-4 relative overflow-hidden"
          style={{ background: `linear-gradient(135deg, ${accent}33, rgb(var(--cosmic-deep-purple)), ${accent}22)` }}
        >
          <div className="container-cosmic text-center relative z-10">
            <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
            <h2 className="font-cinzel text-2xl md:text-3xl text-cosmic-cream font-bold mb-3">
              Ready to Begin Your <span className="text-gradient-gold">Journey?</span>
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
              {course ? (
                <>
                  <button onClick={() => setEnrollOpen(true)} className="btn-primary">
                    <Sparkles size={15} />
                    Enroll in {course.title}
                  </button>
                  <Link href={`/courses/${course.slug}`} className="btn-outline">
                    View Full Course Details
                  </Link>
                </>
              ) : (
                <>
                  <button onClick={() => setCalendlyOpen(true)} className="btn-primary">
                    <Sparkles size={15} />
                    Book a Session
                  </button>
                  {category && (
                    <Link href={`/${category.slug}`} className="btn-outline">
                      View {category.title} Sessions
                    </Link>
                  )}
                </>
              )}
            </div>
          </div>
        </section>
      </Layout>

      <CalendlyPopup isOpen={calendlyOpen} onClose={() => setCalendlyOpen(false)} />
      <EnrollModal
        isOpen={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        course={course?.title || page.title}
        mode={null}
      />
    </>
  )
}
