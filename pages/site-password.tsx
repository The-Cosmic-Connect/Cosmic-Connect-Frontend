// ============================================================
// TEMPORARY SITE PASSWORD GATE — REMOVE BEFORE GOING LIVE
// Part of the temp gate along with /middleware.ts and /pages/api/site-password.ts
// ============================================================
import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function SitePassword() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/site-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()

      if (data.ok) {
        const redirect = (router.query.redirect as string) || '/'
        window.location.href = redirect
      } else {
        setError('Incorrect password')
      }
    } catch {
      setError('Something went wrong. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Preview Access — The Cosmic Connect</title>
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#f5f2ef',
          fontFamily: 'sans-serif',
          padding: '1rem',
        }}
      >
        <form
          onSubmit={handleSubmit}
          style={{
            background: '#fff',
            padding: '2.5rem',
            borderRadius: '12px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
            width: '100%',
            maxWidth: '360px',
          }}
        >
          <h1 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: '#3B2B5F' }}>
            Site Preview
          </h1>
          <p style={{ fontSize: '0.875rem', color: '#666', marginBottom: '1.5rem' }}>
            This site is not yet live. Enter password to continue.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoFocus
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: '1px solid #ddd',
              marginBottom: '1rem',
              fontSize: '1rem',
              boxSizing: 'border-box',
            }}
          />
          {error && (
            <p style={{ color: '#c0392b', fontSize: '0.875rem', marginBottom: '1rem' }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '0.75rem',
              borderRadius: '8px',
              border: 'none',
              background: '#3B2B5F',
              color: '#fff',
              fontSize: '1rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
      </div>
    </>
  )
}
