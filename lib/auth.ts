// lib/auth.ts
//
// Customer account API calls (signup / login / Google Sign-In / password
// reset / My Account data) plus the localStorage session helpers used by
// AuthContext. Kept separate from fetchProducts.ts's catalog-cache concerns
// — this file only ever talks to /auth/* and the customer-scoped "mine"
// endpoints.
//
// Session storage: unlike the admin panel (sessionStorage — deliberately
// wiped when the tab closes), customer sessions live in localStorage so a
// shopper who signs in today is still signed in next week. The JWT itself
// still expires server-side (CUSTOMER_JWT_EXPIRY_MINUTES, 30 days by
// default) — this is convenience, not indefinite trust.

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export interface AuthUser {
  id: string
  name: string
  email: string
  picture: string
  authProviders: string[]
  emailVerified: boolean
  createdAt: string
}

export interface AuthSession {
  token: string
  user: AuthUser
}

const TOKEN_KEY = 'cosmic_auth_token'
const USER_KEY  = 'cosmic_auth_user'

export function getStoredSession(): AuthSession | null {
  try {
    const token = localStorage.getItem(TOKEN_KEY)
    const userRaw = localStorage.getItem(USER_KEY)
    if (!token || !userRaw) return null
    return { token, user: JSON.parse(userRaw) as AuthUser }
  } catch {
    return null
  }
}

export function setStoredSession(session: AuthSession) {
  try {
    localStorage.setItem(TOKEN_KEY, session.token)
    localStorage.setItem(USER_KEY, JSON.stringify(session.user))
  } catch {}
}

export function clearStoredSession() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  } catch {}
}

// ── Error shape ───────────────────────────────────────────────────────────────
export class AuthApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function parseErrorMessage(r: Response, fallback: string): Promise<string> {
  try {
    const data = await r.json()
    // FastAPI's default error shape is {"detail": "..."}
    return data.detail || data.message || fallback
  } catch {
    return fallback
  }
}

async function postJson<T>(path: string, body: unknown): Promise<T> {
  const r = await fetch(`${API}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!r.ok) {
    throw new AuthApiError(await parseErrorMessage(r, 'Something went wrong'), r.status)
  }
  return r.json()
}

// ── Auth actions ──────────────────────────────────────────────────────────────
export function signup(name: string, email: string, password: string): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/signup', { name, email, password })
}

export function login(email: string, password: string): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/login', { email, password })
}

export function loginWithGoogle(credential: string): Promise<AuthSession> {
  return postJson<AuthSession>('/auth/google', { credential })
}

export function forgotPassword(email: string): Promise<{ message: string }> {
  return postJson('/auth/forgot-password', { email })
}

export function resetPassword(
  email: string, token: string, newPassword: string
): Promise<{ message: string }> {
  return postJson('/auth/reset-password', { email, token, newPassword })
}

// ── Authenticated requests ───────────────────────────────────────────────────
export async function authedFetch(token: string, path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${API}${path}`, {
    ...init,
    headers: {
      ...(init.headers || {}),
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function fetchMe(token: string): Promise<AuthUser> {
  const r = await authedFetch(token, '/auth/me')
  if (!r.ok) throw new AuthApiError(await parseErrorMessage(r, 'Could not load account'), r.status)
  return r.json()
}

export async function updateProfileName(token: string, name: string): Promise<AuthUser> {
  const r = await authedFetch(token, '/auth/me', { method: 'PUT', body: JSON.stringify({ name }) })
  if (!r.ok) throw new AuthApiError(await parseErrorMessage(r, 'Could not update account'), r.status)
  return r.json()
}

export interface MyOrder {
  id: string
  status: string
  gateway?: string
  items: { id: string; name: string; priceINR: number; priceUSD: number; quantity: number; image?: string }[]
  totalINR?: number
  totalUSD?: number
  currency: string
  coupon?: string | null
  createdAt: string
  paidAt?: string
}

export async function fetchMyOrders(token: string): Promise<MyOrder[]> {
  const r = await authedFetch(token, '/orders/mine')
  if (!r.ok) throw new AuthApiError(await parseErrorMessage(r, 'Could not load your orders'), r.status)
  const data = await r.json()
  return data.orders || []
}

export interface MyBooking {
  id: string
  status: string
  agentId: string
  serviceId: string
  date: string
  startTime: string
  endTime: string
  priceINR: number
  priceUSD: number
  currency: string
  meetLink?: string | null
  createdAt: string
}

export async function fetchMyBookings(token: string): Promise<MyBooking[]> {
  const r = await authedFetch(token, '/bookings/mine')
  if (!r.ok) throw new AuthApiError(await parseErrorMessage(r, 'Could not load your bookings'), r.status)
  const data = await r.json()
  return data.bookings || []
}
