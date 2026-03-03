import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Menu, X, Phone } from 'lucide-react'

const navLinks = [
  { label: 'Home',     href: '/' },
  { label: 'Services', href: '/services' },
  { label: 'Shop',     href: '/shop' },
  { label: 'Courses',  href: '/courses' },
  { label: 'About',    href: '/about' },
  { label: 'Videos',   href: '/videos' },
  { label: 'Blog',     href: '/blog' },
]

export default function Navbar() {
  const [scrolled,     setScrolled]     = useState(false)
  const [menuOpen,     setMenuOpen]     = useState(false)
  const router = useRouter()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false)
  }, [router.pathname])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? 'bg-cosmic-black/95 backdrop-blur-md border-b border-cosmic-gold/20 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="container-cosmic flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10">
              {/* Decorative ring */}
              <div className="absolute inset-0 rounded-full border border-cosmic-gold/40 group-hover:border-cosmic-gold/80 transition-all duration-300 group-hover:shadow-gold" />
              <div className="absolute inset-1 rounded-full border border-cosmic-gold/20 group-hover:border-cosmic-gold/40 transition-all duration-300" />
              {/* Star symbol */}
              <div className="absolute inset-0 flex items-center justify-center text-cosmic-gold text-lg font-cinzel">
                ✦
              </div>
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-cinzel text-base font-semibold text-cosmic-cream tracking-wider">
                The Cosmic
              </span>
              <span className="font-cinzel text-xs font-normal text-cosmic-gold tracking-[0.25em] uppercase">
                Connect
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`nav-link ${router.pathname === link.href ? 'active' : ''}`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            {/* Phone — desktop */}
            <a
              href="tel:+919599474758"
              className="hidden lg:flex items-center gap-2 text-cosmic-gold/70 hover:text-cosmic-gold transition-colors duration-300 text-sm font-raleway"
            >
              <Phone size={14} />
              <span>+91 95994 74758</span>
            </a>

            {/* Book Now — desktop */}
            <Link href="/book" className="hidden lg:inline-flex btn-primary text-xs py-2 px-6">
              Book Now
            </Link>

            {/* Hamburger — mobile */}
            <button
              className="lg:hidden text-cosmic-cream hover:text-cosmic-gold transition-colors p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-cosmic-black/90 backdrop-blur-md"
          onClick={() => setMenuOpen(false)}
        />

        {/* Menu Panel */}
        <div
          className={`absolute top-0 right-0 h-full w-72 bg-gradient-to-b from-cosmic-deepPurple to-cosmic-black border-l border-cosmic-gold/20 flex flex-col transition-transform duration-500 ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          {/* Close */}
          <div className="flex justify-end p-6">
            <button
              onClick={() => setMenuOpen(false)}
              className="text-cosmic-cream hover:text-cosmic-gold transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Logo in panel */}
          <div className="px-8 pb-6 border-b border-cosmic-gold/20">
            <p className="font-cinzel text-cosmic-gold text-lg">The Cosmic Connect</p>
            <p className="font-cormorant text-cosmic-cream/60 text-sm mt-1 italic">
              Let the Universe Guide You
            </p>
          </div>

          {/* Links */}
          <nav className="flex flex-col px-8 py-6 gap-1">
            {navLinks.map((link, i) => (
              <Link
                key={link.href}
                href={link.href}
                className={`py-3 font-cinzel text-sm tracking-widest uppercase transition-all duration-300 border-b border-cosmic-gold/10 ${
                  router.pathname === link.href
                    ? 'text-cosmic-gold'
                    : 'text-cosmic-cream/80 hover:text-cosmic-gold hover:pl-2'
                }`}
                style={{ animationDelay: `${i * 50}ms` }}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Bottom CTA */}
          <div className="mt-auto px-8 pb-10 flex flex-col gap-4">
            <Link href="/services" className="btn-primary justify-center text-xs">
              Book a Session
            </Link>
            <a
              href="tel:+919599474758"
              className="flex items-center justify-center gap-2 text-cosmic-gold/70 hover:text-cosmic-gold transition-colors text-sm font-raleway"
            >
              <Phone size={14} />
              +91 95994 74758
            </a>
          </div>
        </div>
      </div>

      {/* WhatsApp Floating Button */}
      <a
        href="https://wa.me/919599474758"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-gold-lg hover:scale-110 transition-transform duration-300"
        style={{ background: '#25D366' }}
        aria-label="Chat on WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="white" className="w-7 h-7">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
          <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.558 4.122 1.532 5.857L.057 23.882a.5.5 0 0 0 .61.61l6.055-1.488A11.945 11.945 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22a9.947 9.947 0 0 1-5.073-1.388l-.363-.217-3.762.923.951-3.688-.236-.38A9.947 9.947 0 0 1 2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
        </svg>
      </a>
    </>
  )
}
