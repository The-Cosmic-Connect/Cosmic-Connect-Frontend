import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  AuthUser, AuthSession,
  getStoredSession, setStoredSession, clearStoredSession,
  signup as apiSignup, login as apiLogin, loginWithGoogle as apiLoginWithGoogle,
  fetchMe, updateProfileName, AuthApiError,
} from '@/lib/auth'

interface AuthContextValue {
  user: AuthUser | null
  token: string | null
  loading: boolean            // still hydrating from localStorage / verifying session
  isLoggedIn: boolean
  signup: (name: string, email: string, password: string) => Promise<void>
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (credential: string) => Promise<void>
  logout: () => void
  updateName: (name: string) => Promise<void>
}

const AuthContext = createContext<AuthContextValue>({
  user: null,
  token: null,
  loading: true,
  isLoggedIn: false,
  signup: async () => {},
  login: async () => {},
  loginWithGoogle: async () => {},
  logout: () => {},
  updateName: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]     = useState<AuthUser | null>(null)
  const [token, setToken]   = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Hydrate from localStorage on mount, then re-verify against the backend
  // in the background — if the token expired or the account was somehow
  // removed, this signs the browser out instead of showing stale data.
  useEffect(() => {
    const stored = getStoredSession()
    if (!stored) {
      setLoading(false)
      return
    }
    setUser(stored.user)
    setToken(stored.token)
    setLoading(false)

    fetchMe(stored.token)
      .then((freshUser) => {
        setUser(freshUser)
        setStoredSession({ token: stored.token, user: freshUser })
      })
      .catch((e) => {
        if (e instanceof AuthApiError && e.status === 401) {
          setUser(null)
          setToken(null)
          clearStoredSession()
        }
        // Any other error (network blip, backend briefly down) — keep the
        // cached session rather than signing the shopper out over a
        // transient failure.
      })
  }, [])

  function applySession(session: AuthSession) {
    setUser(session.user)
    setToken(session.token)
    setStoredSession(session)
  }

  async function signup(name: string, email: string, password: string) {
    const session = await apiSignup(name, email, password)
    applySession(session)
  }

  async function login(email: string, password: string) {
    const session = await apiLogin(email, password)
    applySession(session)
  }

  async function loginWithGoogle(credential: string) {
    const session = await apiLoginWithGoogle(credential)
    applySession(session)
  }

  function logout() {
    setUser(null)
    setToken(null)
    clearStoredSession()
  }

  async function updateName(name: string) {
    if (!token) return
    const freshUser = await updateProfileName(token, name)
    setUser(freshUser)
    setStoredSession({ token, user: freshUser })
  }

  return (
    <AuthContext.Provider value={{
      user, token, loading,
      isLoggedIn: !!user && !!token,
      signup, login, loginWithGoogle, logout, updateName,
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
