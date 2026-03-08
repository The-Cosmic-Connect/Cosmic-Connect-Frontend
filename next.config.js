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
    ],
    formats: ['image/avif', 'image/webp'],
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