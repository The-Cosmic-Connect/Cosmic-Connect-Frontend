import type { GetServerSideProps } from 'next'
import { resolveLegacyProduct } from '../../lib/legacyRedirect'

// Old Wix URL (/our-product/<slug>) kept alive as a permanent redirect for SEO.
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const destination = await resolveLegacyProduct(String(params?.slug || ''))
  return { redirect: { destination, permanent: true } }
}

export default function LegacyRedirect() {
  return null
}
