import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import StarField from '../ui/StarField'

interface LayoutProps {
  children:      ReactNode
  title?:        string
  description?:  string
  canonical?:    string
  ogImage?:      string
  ogType?:       'website' | 'article' | 'product'
  jsonLd?:       object | object[]   // pass page-specific structured data
  noIndex?:      boolean
}

const DEFAULT_TITLE = 'The Cosmic Connect | Dr. Usha Bhatt — Psychic Healer & Tarot Reader'
const DEFAULT_DESC  = 'Connect with Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience. Book Akashic readings, healing sessions, past life therapy, and more.'
// const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecosmicconnect.in'
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.arkasuryacrystals.com'

export default function Layout({
  children,
  title       = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  canonical,
  ogImage     = '/og-image.jpg',
  ogType      = 'website',
  jsonLd,
  noIndex     = false,
}: LayoutProps) {
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL
  const fullOgImage   = ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`

  const schemas = jsonLd
    ? Array.isArray(jsonLd) ? jsonLd : [jsonLd]
    : []

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullCanonical} />
        {noIndex && <meta name="robots" content="noindex,nofollow" />}

        {/* Open Graph */}
        <meta property="og:type"        content={ogType} />
        <meta property="og:url"         content={fullCanonical} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image"       content={fullOgImage} />
        <meta property="og:image:width"  content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name"   content="The Cosmic Connect" />
        <meta property="og:locale"      content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@cosmicconnect" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={fullOgImage} />

        {/* Favicon */}
        <link rel="icon"             href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest"         href="/site.webmanifest" />

        {/* Theme */}
        <meta name="theme-color" content="#0A0708" />

        {/* Page-specific JSON-LD */}
        {schemas.map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </Head>

      <StarField />

      <div className="relative z-10 min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </>
  )
}