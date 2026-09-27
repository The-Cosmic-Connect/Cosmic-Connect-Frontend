import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { Mail, Lock, User, UserPlus } from 'lucide-react'
import Layout from '@/components/layout/Layout'
import GoogleSignInButton from '@/components/account/GoogleSignInButton'
import { useAuth } from '@/context/AuthContext'

export default function SignupPage() {
  const router = useRouter()
  const { signup, loginWithGoogle, isLoggedIn } = useAuth()

  const [name, setName]         = useState('')
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [error, setError]       = useState('')
  const [submitting, setSubmitting] = useState(false)

  const redirectTo = typeof router.query.redirect === 'string' ? router.query.redirect : '/account'

  useEffect(() => {
    if (isLoggedIn) router.replace(redirectTo)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn])

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
    setSubmitting(true)
    try {
      await signup(name.trim(), email.trim(), password)
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleGoogleCredential(credential: string) {
    setError('')
    try {
      await loginWithGoogle(credential)
      router.push(redirectTo)
    } catch (err: any) {
      setError(err.message || 'Google sign-in failed. Please try again.')
    }
  }

  return (
    <Layout title="Create Account | The Cosmic Connect" canonical="/account/signup" noIndex>
      <section className="min-h-screen bg-cosmic-section pt-28 pb-16 px-4 flex items-start justify-center">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="font-cinzel text-cosmic-cream text-2xl font-bold mb-2">Create Your Account</h1>
            <p className="font-cormorant text-cosmic-cream/50 italic">
              Save your orders, bookings, and receipts in one place
            </p>
          </div>

          <div className="cosmic-card p-6 sm:p-8 space-y-5">
            <GoogleSignInButton onCredential={handleGoogleCredential} onError={setError} text="signup_with" />

            <div className="flex items-center gap-3 py-1">
              <div className="flex-1 h-px bg-cosmic-gold/15" />
              <span className="font-raleway text-cosmic-cream/30 text-xs tracking-widest uppercase">or</span>
              <div className="flex-1 h-px bg-cosmic-gold/15" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-cosmic-cream/30" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-cosmic-black/30 border border-cosmic-gold/20 pl-10 pr-4 py-3
                      font-cormorant text-cosmic-cream text-base outline-none focus:border-cosmic-gold/50 transition-colors"
                    placeholder="Your name"
                  />
                </div>
              </div>

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

              <div>
                <label className="font-raleway text-cosmic-cream/50 text-xs tracking-widest uppercase block mb-1.5">
                  Password
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
                  Confirm Password
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
                    placeholder="Retype your password"
                  />
                </div>
              </div>

              {error && <p className="font-raleway text-red-400 text-xs">{error}</p>}

              <button type="submit" disabled={submitting}
                className="btn-primary w-full justify-center disabled:opacity-60 disabled:cursor-not-allowed">
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={14} />
                    Create Account
                  </>
                )}
              </button>
            </form>
          </div>

          <p className="font-cormorant text-cosmic-cream/50 text-center mt-6">
            Already have an account?{' '}
            <Link href="/account/login" className="text-cosmic-gold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </Layout>
  )
}
