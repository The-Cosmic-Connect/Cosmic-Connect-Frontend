import Layout from '@/components/layout/Layout'
import { Youtube, ExternalLink } from 'lucide-react'

const YOUTUBE_CHANNEL = 'https://www.youtube.com/@TheCosmicConnect'

export default function VideosPage() {
  return (
    <Layout
      title="Videos | The Cosmic Connect"
      description="Watch spiritual guidance, crystal healing, Tarot, and wellness videos by Dr. Usha Bhatt on The Cosmic Connect YouTube channel."
      canonical="/videos"
    >
      <section className="min-h-screen flex items-center justify-center bg-cosmic-gradient pt-24 px-4">
        <div className="text-center max-w-xl">
          <p className="ornament text-sm tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center mx-auto mb-6">
            <Youtube size={28} className="text-red-500" />
          </div>
          <h1 className="font-cinzel text-3xl md:text-4xl text-cosmic-cream font-bold mb-4">
            Videos &amp; <span className="text-gradient-gold">Teachings</span>
          </h1>
          <div className="gold-divider mb-6" />
          <p className="font-cormorant text-cosmic-cream/60 text-xl italic mb-8 leading-relaxed">
            Watch spiritual guidance, crystal healing demos, Tarot readings, and wellness content
            by Dr. Usha Bhatt on our YouTube channel.
          </p>
          <a
            href={YOUTUBE_CHANNEL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary inline-flex"
          >
            <Youtube size={16} />
            Visit Our YouTube Channel
            <ExternalLink size={13} className="opacity-60" />
          </a>
          <p className="font-raleway text-cosmic-cream/30 text-xs mt-6 tracking-widest">
            Full video gallery with playlists coming soon
          </p>
        </div>
      </section>
    </Layout>
  )
}
