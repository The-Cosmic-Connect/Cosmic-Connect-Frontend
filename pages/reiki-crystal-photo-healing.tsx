import ServiceCategoryPageTemplate from '@/components/sections/ServiceCategoryPage'
import { getCategoryBySlug } from '@/lib/serviceCategories'

const category = getCategoryBySlug('reiki-crystal-photo-healing')!

export default function Page() {
  return <ServiceCategoryPageTemplate category={category} />
}
