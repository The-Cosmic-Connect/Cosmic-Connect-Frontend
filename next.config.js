/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'static.wixstatic.com',
      'thecosmicconnect-assets.s3.ap-south-1.amazonaws.com',
      'thecosmicconnect-images-dev.s3.ap-south-1.amazonaws.com',
      'thecosmicconnect-images-staging.s3.ap-south-1.amazonaws.com',
      'thecosmicconnect-images.s3.ap-south-1.amazonaws.com',
      'thecosmicconnect-crystal-cover-images.s3.ap-south-1.amazonaws.com',
    ],
    formats: ['image/avif', 'image/webp'],
  },
  // -------------------------------------------------------------------------
  // Old Wix site URLs -> new site (permanent). Added for the move of
  // thecosmicconnect.com from Wix to this app so existing Google rankings,
  // backlinks and customer bookmarks keep working.
  //   /our-product/*, /product-page/*, /post/*  -> handled by small SSR pages
  //   (pages/our-product, pages/product-page, pages/post) that look the slug up.
  // -------------------------------------------------------------------------
  async redirects() {
    const to = (map) => Object.entries(map).flatMap(([dest, sources]) =>
      sources.map((source) => ({ source, destination: dest, permanent: true })))

    // Wix shop category slug -> shop collection slug (see lib/shopTaxonomy.toSlug)
    const wixCategory = {
      'meditation-essentials': 'healing-meditation', 'idols': 'idols-figurines',
      'feng-shui': 'feng-shui', 'puffy-hearts': 'puffy-hearts', 'rakhi': 'rakhi',
      'energy-generator-orgones': 'orgones', 'intention-coin': 'intention-coin',
      'gemstone': 'gemstone', 'rollers-gua-sha': 'rollers-gua-sha',
      'towers-pencils-wands': 'towers', 'water-charging-coasters': 'energized-water',
      'pyramids': 'pyramids', 'sage-incense': 'sage-incense', 'rudraksh': 'rudraksh',
      'jewellery': 'jewellery', 'healing-crystals-natural-raw-rough-stones': 'raw-crystals',
      'angels': 'angels', 'balls-spheres': 'balls-spheres', 'dowsers': 'dowsers',
      'free-form': 'free-form', 'jap-mala': 'jap-mala', 'lamp': 'lamp',
      'therapy-bracelets': 'therapy', 'feature-products': 'feature-products',
      'tumbles-for-healing': 'tumble-stone-pebbles', 'crystal-tree': 'crystal-tree',
      'zodiac-bracelets': 'zodiac-bracelets', 'cleansing-charging': 'cleansing-charging',
      'bracelets': 'bracelets',
    }
    const categoryRedirects = Object.entries(wixCategory).map(([wix, col]) => ({
      source: `/category/${wix}`, destination: `/shop/collection/${col}`, permanent: true,
    }))

    return [
      ...to({
        '/': ['/homepage', '/copy-of-home', '/copy-of-home-1', '/homepage-preview-new-layout',
              '/homepage-preview-quick-look-html-embe', '/testimonials', '/challenges', '/loyalty',
              '/paywall', '/payment-request-page', '/webinar-registration', '/event-list',
              '/event-details/:path*'],
        '/shop': ['/our-shop', '/new-shop-page', '/shop-28122025', '/rider-waite-deck',
                  '/combo-packages', '/gift-card', '/category/top-categories',
                  '/category/evil-eye-products', '/category/palm-stones'],
        '/shop/all': ['/category/all-products'],
        '/about': ['/about-thecosmicconnect'],
        '/courses': ['/courses-we-offer', '/courses-1', '/courses-2', '/copy-of-courses',
                     '/coursesdata/:path*', '/energy-healing-coach', '/mudras-meditation',
                     '/visualization-mindfulness', '/reiki-level-1', '/reiki-level-2',
                     '/reiki-level-3a', '/reiki-level-3b', '/karuna-reiki-master',
                     '/karuna-reiki-practitioner'],
        '/courses/crystal-therapy': ['/crystal-therapy-basic', '/crystal-therapy-intermediate',
                                     '/crystal-therapy-advance'],
        '/videos': ['/free-videos'],
        '/terms-of-use': ['/terms-and-conditions'],
        '/shipping-returns': ['/shipping-policy', '/return-exchange-and-refund-policy'],
        '/booking-usha-bhatt': ['/book-online', '/booking-services', '/booking-usha-bhatt-1',
                                '/service-page/:path*', '/booking-service/:path*',
                                '/energy-healing', '/angel-healing', '/psychic-healing',
                                '/therapy-combinations'],
        '/contact': ['/inquiry-services-page'],
        '/tarot-reading-services': ['/tarot-card-reader-in-mumbai', '/tarot-card-reader-in-delhi',
                                    '/tarot-card-reading-bangalore', '/psychic-tarot',
                                    '/oracle-card-reading'],
        '/akashic-mokshapat-pastlife': ['/akashic-records-reading', '/mokshapat-reading'],
        '/crystal-grids': ['/ancestral-healing'],
        '/pendulum-dowsing-gem-stone-counselling': ['/gemstone-consultation',
                                                    '/gemstone-consultant-in-delhi',
                                                    '/dowsing-pendulum'],
        '/shop/collection/bracelets': ['/crystal-bracelets'],
        '/shop/collection/pyramids': ['/crystal-pyramids'],
        '/shop/collection/angels': ['/crystal-angels'],
        '/shop/collection/crystal-tree': ['/crystal-tree'],
        '/shop/collection/puffy-hearts': ['/crystal-puffy-hearts'],
        '/shop/collection/idols-figurines': ['/idols-and-figurines'],
        '/shop/collection/jap-mala': ['/jap-mala'],
        '/shop/collection/raw-crystals': ['/raw-rough-stones'],
        '/shop/collection/tumble-stone-pebbles': ['/pebbles-and-tumbles'],
        '/shop/collection/orgones': ['/crystal-energy-generator'],
        '/shop/collection/energized-water': ['/healed-energized-water'],
        '/shop/collection/cleansing-charging': ['/crystal-cleansing-and-charging'],
        '/shop/collection/dowsers': ['/crystal-pendulum-dowser'],
        '/blog': ['/blog/category/:path*'],
      }),
      ...categoryRedirects,
    ]
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        ],
      },
    ]
  },
}

module.exports = nextConfig