import { useEffect, useState } from 'react'
import Link from 'next/link'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface Announcement {
  id: string
  text: string
  link?: string
  isActive: boolean
  order: number
}

export default function AnnouncementScroller() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    fetch(`${API}/announcements?active_only=true`)
      .then(r => r.json())
      .then(d => setAnnouncements(d.announcements || []))
      .catch(() => {})
      .finally(() => setLoaded(true))
  }, [])

  // Navbar (fixed) and the page's top padding both read this CSS var so they
  // shift down exactly by the scroller's height — 0px when there's nothing
  // to show, so an empty admin list doesn't leave a dead gap under the nav.
  useEffect(() => {
    const height = loaded && announcements.length > 0 ? '34px' : '0px'
    document.documentElement.style.setProperty('--announcement-height', height)
    return () => { document.documentElement.style.setProperty('--announcement-height', '0px') }
  }, [loaded, announcements.length])

  if (!loaded || announcements.length === 0) return null

  // Duplicate the track so the CSS marquee can loop seamlessly at -50%.
  const track = [...announcements, ...announcements]

  return (
    <div className="announcement-scroller" role="marquee" aria-label="Announcements">
      <div className="announcement-scroller-track">
        {track.map((a, i) => (
          <span className="announcement-item" key={`${a.id}-${i}`}>
            {a.link ? (
              <Link href={a.link}>{a.text}</Link>
            ) : (
              a.text
            )}
            <span className="announcement-sep" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  )
}
