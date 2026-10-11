import Layout from '@/components/layout/Layout'
import HomeCarousel from '@/components/sections/HomeCarousel'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ShopTeaserSection from '@/components/sections/ShopTeaserSection'
import CoursesTeaserSection from '@/components/sections/CoursesTeaserSection'
import TestimonialsSection, { type Testimonial } from '@/components/sections/TestimonialsSection'
import type { GetStaticProps } from 'next'
import AwardsSection from '@/components/sections/AwardsSection'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export default function Home({ testimonials }: { testimonials: Testimonial[] }) {
  return (
    <Layout
      title="The Cosmic Connect | Dr. Usha Bhatt — Psychic Healer & Tarot Reader in India"
      description="Connect with Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience. Book Akashic readings, healing sessions, past life therapy, and more."
      canonical="/"
    >
      <HomeCarousel />
      <HeroSection />
      <ServicesSection />
      <ShopTeaserSection />
      <CoursesTeaserSection />
      <TestimonialsSection items={testimonials} />
      <AwardsSection />
    </Layout>
  )
}

// Reviews come from the admin (Reviews page). Fetched at build time and
// refreshed every 10 minutes (ISR), so they're in the page HTML (good for
// SEO and no layout jump) without a request on every visit. Any failure
// falls back to the built-in review inside TestimonialsSection.
export const getStaticProps: GetStaticProps = async () => {
  let testimonials: Testimonial[] = []
  try {
    const res = await fetch(`${API}/testimonials`)
    if (res.ok) {
      const data = await res.json()
      testimonials = (data.testimonials || []).map((t: any) => ({
        id: t.id || null,
        author: String(t.author || ''),
        text: String(t.text || ''),
        rating: Number(t.rating) || 5,
        reviewDate: t.reviewDate || '',
        sourceUrl: t.sourceUrl || '',
        photo: t.photo || '',
      })).filter((t: Testimonial) => t.author && t.text)
    }
  } catch (e) {
    console.error('getStaticProps /: testimonials fetch failed', e)
  }
  return { props: { testimonials }, revalidate: 600 }
}
