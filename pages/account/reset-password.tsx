import { useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Lock, CheckCircle2 } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { resetPassword } from '@/lib/auth'

export default function ResetPasswordPage() {
  const router = useRouter()
  const email = typeof router.query.email === 'string' ? router.query.email : ''
  const token = typeof router.query.token === 'string' ? router.query.token : ''

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone]         = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) {
      setError('Password must be at least 8 characters')
      return
    }
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    if (!email || !token) {
      setError('This reset link is missing information. Please request a new one.')
      return
    }
    setSubmitting(true)
    try {
      await resetPassword(email, token, password)
      setDone(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout title="Reset Password | The Cosmic Connect" canonical="/account/reset-password" noIndex>
      <section className="min-h-screen bg-cosmic-section pt-28 pb-16 px-4 flex items-start justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-cosmic-cream text-2xl font-bold mb-2">Choose a New Password</h1>
          </div>

          <div className="cosmic-card p-6 sm:p-8">
            {done ? (
              <div className="text-center space-y-4">
                <CheckCircle2 className="mx-auto text-cosmic-gold" size={32} />
                <p className="font-cormorant text-cosmic-cream/80 text-base">
                  Your password has been updated.
                </p>
                <Link href="/account/login" className="btn-primary w-full justify-center inline-flex">
                  Sign In
                </Link>
              </div>
            ) : !email || !token ? (
              <p className="font-cormorant text-cosmic-cream/70 text-base leading-relaxed text-center">
                This reset link is invalid or incomplete.{' '}
                <Link href="/account/forgot-password" className="text-cosmic-gold hover:underline">
                  Request a new one
                </Link>.
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                    New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cream/30" />
                    <input
                      type="password"
                      required
                      minLength={8}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 pl-10 pr-4 py-3
                        font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors"
                      placeholder="At least 8 characters"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                    Confirm New Password
                  </label>
                  <div className="relative">
                    <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cream/30" />
                    <input
                      type="password"
                      required
                      autoComplete="new-password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 pl-10 pr-4 py-3
                        font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors"
                      placeholder="Retype your new password"
                    />
                  </div>
                </div>

                {error && <p className="font-raleway text-red-400 text-xs">{error}</p>}

                <button type="submit" disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : 'Update Password'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
