import ServiceCategoryPageTemplate from '@/components/sections/ServiceCategoryPage'
import { getCategoryBySlug } from '@/lib/serviceCategories'

const category = getCategoryBySlug('black-magic-evil-eye-removal')!

export default function Page() {
  return <ServiceCategoryPageTemplate category={category} />
}
