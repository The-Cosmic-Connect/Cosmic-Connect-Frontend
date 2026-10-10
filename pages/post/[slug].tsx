import type { GetServerSideProps } from 'next'
import { resolveLegacyPost } from '../../lib/legacyRedirect'

// Old Wix URL (/post/<slug>) kept alive as a permanent redirect for SEO.
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const destination = await resolveLegacyPost(String(params?.slug || ''))
  return { redirect: { destination, permanent: true } }
}

export default function LegacyRedirect() {
  return null
}
