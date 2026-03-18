import { Html, Head, Main, NextScript } from 'next/document'

const GA_ID = 'G-HXFKKJN8X6'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* GA4 */}
        <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', '${GA_ID}', { page_path: window.location.pathname });
            `,
          }}
        />

        {/* Organization JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'The Cosmic Connect',
              url: 'https://www.thecosmicconnect.in',
              logo: 'https://www.thecosmicconnect.in/logo.png',
              description: 'Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience.',
              telephone: '+91-95994-74758',
              email: 'hello@thecosmicconnect.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'GG1/5A PVR Road, Vikaspuri',
                addressLocality: 'New Delhi',
                postalCode: '110018',
                addressCountry: 'IN',
              },
              sameAs: [
                'https://www.instagram.com/thecosmicconnect',
                'https://www.youtube.com/thecosmicconnect',
              ],
            }),
          }}
        />

        {/* LocalBusiness JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'LocalBusiness',
              '@id': 'https://www.thecosmicconnect.in/#business',
              name: 'The Cosmic Connect',
              image: 'https://www.thecosmicconnect.in/og-image.jpg',
              telephone: '+91-95994-74758',
              email: 'hello@thecosmicconnect.com',
              url: 'https://www.thecosmicconnect.in',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'GG1/5A PVR Road, Vikaspuri',
                addressLocality: 'New Delhi',
                postalCode: '110018',
                addressCountry: 'IN',
              },
              geo: {
                '@type': 'GeoCoordinates',
                latitude: 28.6355,
                longitude: 77.0511,
              },
              openingHoursSpecification: {
                '@type': 'OpeningHoursSpecification',
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
                opens: '10:00',
                closes: '20:00',
              },
              priceRange: '₹₹',
            }),
          }}
        />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}