import ServiceCategoryPageTemplate from '@/components/sections/ServiceCategoryPage'
import { getCategoryBySlug } from '@/lib/serviceCategories'

const category = getCategoryBySlug('crystal-grids')!

export default function Page() {
  return <ServiceCategoryPageTemplate category={category} />
}
