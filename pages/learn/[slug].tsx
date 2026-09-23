import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Layout from '@/components/layout/Layout'
import CmsPageTemplate, { CmsPage } from '@/components/sections/CmsPageTemplate'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

// Static "Know More" pages, admin-managed from the CMS tab and fetched live
// (not statically generated) so admin edits show up without a redeploy —
// same client-fetch pattern as ServiceCategoryPageTemplate / booking-usha-bhatt.
export default function CmsSlugPage() {
  const router = useRouter()
  const slug = typeof router.query.slug === 'string' ? router.query.slug : undefined

  const [page,      setPage]      = useState<CmsPage | null>(null)
  const [notFound,  setNotFound]  = useState(false)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    if (!slug) return
    setLoading(true)
    setNotFound(false)
    fetch(`${API}/cms-pages/slug/${slug}`)
      .then(r => {
        if (!r.ok) throw new Error('not found')
        return r.json()
      })
      .then((d: CmsPage) => { setPage(d); setLoading(false) })
      .catch(() => { setNotFound(true); setLoading(false) })
  }, [slug])

  if (loading) {
    return (
      <Layout title="Loading... | The Cosmic Connect" canonical={`/learn/${slug || ''}`}>
        <div style={{ minHeight: '60vh' }} />
      </Layout>
    )
  }

  if (notFound || !page) {
    return (
      <Layout title="Page Not Found | The Cosmic Connect" canonical={`/learn/${slug || ''}`}>
        <div className="container-cosmic text-center" style={{ paddingTop: 170, paddingBottom: 100 }}>
          <h1 className="font-cinzel text-cosmic-cream text-2xl mb-4">Page Not Found</h1>
          <p className="font-cormorant text-cosmic-cream/60 italic">
            This page isn't available right now — please check back soon.
          </p>
        </div>
      </Layout>
    )
  }

  return <CmsPageTemplate page={page} />
}
