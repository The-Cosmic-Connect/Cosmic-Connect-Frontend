import Layout from '@/components/layout/Layout'
import HeroSection from '@/components/sections/HeroSection'
import ServicesSection from '@/components/sections/ServicesSection'
import ShopTeaserSection from '@/components/sections/ShopTeaserSection'
import CoursesTeaserSection from '@/components/sections/CoursesTeaserSection'

export default function Home() {
  return (
    <Layout
      title="The Cosmic Connect | Dr. Usha Bhatt — Psychic Healer & Tarot Reader in India"
      description="Connect with Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience. Book Akashic readings, healing sessions, past life therapy, and more."
      canonical="/"
    >
      <HeroSection />
      <ServicesSection />
      <ShopTeaserSection />
      <CoursesTeaserSection />
    </Layout>
  )
}