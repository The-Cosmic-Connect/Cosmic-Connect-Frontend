import { useState } from 'react'
import Link from 'next/link'
import { Mail, ArrowLeft } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import { forgotPassword } from '@/lib/auth'

export default function ForgotPasswordPage() {
  const [email, setEmail]         = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError]         = useState('')
  const [sent, setSent]           = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      await forgotPassword(email.trim())
      // Backend always returns the same generic message whether or not the
      // email is registered — this page reflects that same "sent" state
      // either way, so it never reveals which emails have accounts.
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Layout title="Reset Password | The Cosmic Connect" canonical="/account/forgot-password" noIndex>
      <section className="min-h-screen bg-cosmic-section pt-28 pb-16 px-4 flex items-start justify-center">
        <div className="w-full max-w-md">
          <Link href="/account/login" className="inline-flex items-center gap-2 font-raleway text-cosmic-cream/50 hover:text-cosmic-gold text-xs tracking-widest uppercase mb-6 transition-colors">
            <ArrowLeft size={13} /> Back to Sign In
          </Link>

          <div className="text-center mb-8">
            <h1 className="font-cinzel text-cosmic-cream text-2xl font-bold mb-2">Forgot Password</h1>
            <p className="font-cormorant text-cosmic-cream/50 italic">
              We'll email you a link to reset it
            </p>
          </div>

          <div className="cosmic-card p-6 sm:p-8">
            {sent ? (
              <p className="font-cormorant text-cosmic-cream/80 text-base leading-relaxed text-center">
                If an account exists for <span className="text-cosmic-gold">{email}</span>, a password
                reset link has been sent. Please check your inbox (and spam folder).
              </p>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cream/30" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 pl-10 pr-4 py-3
                        font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                {error && <p className="font-raleway text-red-400 text-xs">{error}</p>}

                <button type="submit" disabled={submitting}
                  className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                  {submitting
                    ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    : 'Send Reset Link'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  )
}
