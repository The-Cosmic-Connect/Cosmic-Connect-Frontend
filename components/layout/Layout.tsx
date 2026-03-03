import { ReactNode } from 'react'
import Head from 'next/head'
import Navbar from './Navbar'
import Footer from './Footer'
import StarField from '../ui/StarField'

interface LayoutProps {
  children:    ReactNode
  title?:      string
  description?: string
  canonical?:  string
  ogImage?:    string
}

const DEFAULT_TITLE = 'The Cosmic Connect | Dr. Usha Bhatt — Psychic Healer & Tarot Reader'
const DEFAULT_DESC  = 'Connect with Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience. Book Akashic readings, healing sessions, past life therapy, and more.'
const SITE_URL      = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.thecosmicconnect.com'

export default function Layout({
  children,
  title       = DEFAULT_TITLE,
  description = DEFAULT_DESC,
  canonical,
  ogImage     = '/og-image.jpg',
}: LayoutProps) {
  const fullCanonical = canonical ? `${SITE_URL}${canonical}` : SITE_URL

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary SEO */}
        <title>{title}</title>
        <meta name="description" content={description} />
        <link rel="canonical" href={fullCanonical} />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={fullCanonical} />
        <meta property="og:title"       content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:image"       content={`${SITE_URL}${ogImage}`} />
        <meta property="og:site_name"   content="The Cosmic Connect" />
        <meta property="og:locale"      content="en_IN" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content={title} />
        <meta name="twitter:description" content={description} />
        <meta name="twitter:image"       content={`${SITE_URL}${ogImage}`} />

        {/* Favicon */}
        <link rel="icon"             href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Theme */}
        <meta name="theme-color" content="#0A0708" />
      </Head>

      {/* Star background — fixed, behind everything */}
      <StarField />

      {/* Page wrapper */}
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
