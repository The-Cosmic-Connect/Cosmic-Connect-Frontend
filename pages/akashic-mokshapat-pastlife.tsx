import ServiceCategoryPageTemplate from '@/components/sections/ServiceCategoryPage'
import { getCategoryBySlug } from '@/lib/serviceCategories'

const category = getCategoryBySlug('akashic-mokshapat-pastlife')!

export default function Page() {
  return <ServiceCategoryPageTemplate category={category} />
}
