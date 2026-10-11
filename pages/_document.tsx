import { Html, Head, Main, NextScript } from 'next/document'

const GA_ID = 'G-HXFKKJN8X6'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* Apply saved theme before paint to avoid a flash. Default is dark
            (no data-theme attribute = dark); 'light' is the opt-in theme. */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('cosmic-theme');if(t==='light'){document.documentElement.setAttribute('data-theme','light');}}catch(e){}})();`,
          }}
        />

        {/* Preconnect */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://www.googletagmanager.com" />

        {/* Google Fonts: loaded WITHOUT blocking first paint. Previously this was a
            CSS @import in globals.css, which chained after the main stylesheet and
            blocked rendering (~0.75s on slow mobile). display=swap shows text in a
            fallback font immediately, then swaps. */}
        <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){var l=document.createElement('link');l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap';document.head.appendChild(l);})();`,
          }}
        />
        <noscript>
          <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Roboto:ital,wght@0,300;0,400;0,500;0,700;1,400&family=Dancing+Script:wght@400;500;600;700&display=swap" />
        </noscript>

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
              url: 'https://www.thecosmicconnect.com',
              logo: 'https://www.thecosmicconnect.com/logo.png',
              description: 'Dr. Usha Bhatt — renowned psychic healer, tarot reader, and spiritual guide with 20+ years of experience.',
              telephone: '+91-95994-74758',
              email: 'info@thecosmicconnect.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'KG1/298, KG1 Road, near Coffeegram, Vikaspuri',
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
              '@id': 'https://www.thecosmicconnect.com/#business',
              name: 'The Cosmic Connect',
              image: 'https://www.thecosmicconnect.com/og-image.jpg',
              telephone: '+91-95994-74758',
              email: 'info@thecosmicconnect.com',
              url: 'https://www.thecosmicconnect.com',
              address: {
                '@type': 'PostalAddress',
                streetAddress: 'KG1/298, KG1 Road, near Coffeegram, Vikaspuri',
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
                dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
                opens: '11:00',
                closes: '20:30',
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