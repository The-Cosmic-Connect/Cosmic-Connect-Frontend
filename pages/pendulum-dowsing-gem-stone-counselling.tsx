import ServiceCategoryPageTemplate from '@/components/sections/ServiceCategoryPage'
import { getCategoryBySlug } from '@/lib/serviceCategories'

const category = getCategoryBySlug('pendulum-dowsing-gem-stone-counselling')!

export default function Page() {
  return <ServiceCategoryPageTemplate category={category} />
}
