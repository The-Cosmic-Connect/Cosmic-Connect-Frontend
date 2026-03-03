import Link from 'next/link'
import { Phone, Mail, MapPin, Instagram, Youtube, Facebook } from 'lucide-react'

const services = [
  { label: 'Tarot Card Reading',   href: '/services/tarot-card-reading' },
  { label: 'Akashic Reading',      href: '/services/akashic-reading' },
  { label: 'Healing Sessions',     href: '/services/healing-sessions' },
  { label: 'Past Life Healing',    href: '/services/past-life-healing' },
  { label: 'Black Magic Removal',  href: '/services/black-magic-removal' },
]

const quickLinks = [
  { label: 'About Dr. Usha Bhatt', href: '/about' },
  { label: 'Courses',              href: '/courses' },
  { label: 'Shop',                 href: '/shop' },
  { label: 'Videos',               href: '/videos' },
  { label: 'Blog',                 href: '/blog' },
  { label: 'Contact',              href: '/contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="relative border-t border-cosmic-gold/20 bg-gradient-to-b from-cosmic-deepPurple/30 to-cosmic-black">
      {/* Top ornament */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="bg-cosmic-black px-6 py-1">
          <span className="text-cosmic-gold text-2xl font-cinzel">✦</span>
        </div>
      </div>

      <div className="container-cosmic pt-16 pb-8">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">

          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full border border-cosmic-gold/50 flex items-center justify-center text-cosmic-gold text-lg">
                ✦
              </div>
              <div>
                <p className="font-cinzel text-cosmic-cream font-semibold tracking-wider">The Cosmic</p>
                <p className="font-cinzel text-cosmic-gold text-xs tracking-[0.25em] uppercase">Connect</p>
              </div>
            </Link>
            <p className="font-cormorant text-cosmic-cream/60 text-base leading-relaxed mb-6">
              Let the Universe guide you. Explore the depths of your existence and unlock new paths to self-discovery with Dr. Usha Bhatt.
            </p>
            {/* Social */}
            <div className="flex gap-4">
              {[
                { icon: Instagram, href: 'https://instagram.com/thecosmicconnect', label: 'Instagram' },
                { icon: Youtube,   href: 'https://youtube.com/@thecosmicconnect',  label: 'YouTube' },
                { icon: Facebook,  href: 'https://facebook.com/thecosmicconnect',  label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 rounded-full border border-cosmic-gold/30 flex items-center justify-center text-cosmic-gold/60 hover:text-cosmic-gold hover:border-cosmic-gold hover:shadow-gold transition-all duration-300"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-cinzel text-cosmic-gold text-sm tracking-widest uppercase mb-5">
              Our Services
            </h4>
            <ul className="space-y-3">
              {services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="font-raleway text-cosmic-cream/60 text-sm hover:text-cosmic-gold transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="text-cosmic-gold/30 group-hover:text-cosmic-gold transition-colors">›</span>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-cinzel text-cosmic-gold text-sm tracking-widest uppercase mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="font-raleway text-cosmic-cream/60 text-sm hover:text-cosmic-gold transition-colors duration-300 flex items-center gap-2 group"
                  >
                    <span className="text-cosmic-gold/30 group-hover:text-cosmic-gold transition-colors">›</span>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-cinzel text-cosmic-gold text-sm tracking-widest uppercase mb-5">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="tel:+919599474758"
                  className="flex items-start gap-3 text-cosmic-cream/60 hover:text-cosmic-gold transition-colors duration-300 group"
                >
                  <Phone size={15} className="mt-0.5 text-cosmic-gold/50 group-hover:text-cosmic-gold shrink-0" />
                  <span className="font-raleway text-sm">+91 95994 74758</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@thecosmicconnect.com"
                  className="flex items-start gap-3 text-cosmic-cream/60 hover:text-cosmic-gold transition-colors duration-300 group"
                >
                  <Mail size={15} className="mt-0.5 text-cosmic-gold/50 group-hover:text-cosmic-gold shrink-0" />
                  <span className="font-raleway text-sm">hello@thecosmicconnect.com</span>
                </a>
              </li>
              <li>
                <div className="flex items-start gap-3 text-cosmic-cream/60">
                  <MapPin size={15} className="mt-0.5 text-cosmic-gold/50 shrink-0" />
                  <span className="font-raleway text-sm">New Delhi, India<br />Sessions available Online & In-Person</span>
                </div>
              </li>
            </ul>

            {/* Book CTA */}
            <Link href="/services" className="btn-outline mt-6 inline-flex text-xs py-2 px-5">
              Book a Session
            </Link>
          </div>
        </div>

        {/* Divider */}
        <div className="gold-divider-full mb-6" />

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-raleway text-cosmic-cream/40 text-xs text-center md:text-left">
            © {year} The Cosmic Connect. All rights reserved.
          </p>
          <div className="flex gap-6">
            {[
              { label: 'Privacy Policy', href: '/privacy-policy' },
              { label: 'Terms of Use',   href: '/terms-of-use' },
              { label: 'Shipping & Returns',  href: '/shipping-returns' },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="font-raleway text-cosmic-cream/40 text-xs hover:text-cosmic-gold transition-colors duration-300"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
