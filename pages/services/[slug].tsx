import { GetStaticProps, GetStaticPaths } from 'next'
import { services, getServiceBySlug, ServiceData } from '@/lib/servicesData'
import ServicePageTemplate from '@/components/sections/ServicePageTemplate'

interface Props {
  service: ServiceData
}

export default function ServicePage({ service }: Props) {
  return <ServicePageTemplate service={service} />
}

// Tell Next.js which slugs to pre-build at build time
export const getStaticPaths: GetStaticPaths = async () => {
  const paths = services.map(s => ({ params: { slug: s.slug } }))
  return { paths, fallback: false }
}

// Fetch the data for each slug
export const getStaticProps: GetStaticProps = async ({ params }) => {
  const slug = params?.slug as string
  const service = getServiceBySlug(slug)

  if (!service) return { notFound: true }

  return {
    props: { service },
  }
}
