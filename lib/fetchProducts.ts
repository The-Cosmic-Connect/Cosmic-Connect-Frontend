// lib/fetchProducts.ts
//
// Fetches every published product by walking the paginated /products endpoint,
// with a multi-layer cache so the list survives navigation, refresh, and even
// browser restarts:
//
//   1. Module-level memory cache  → instant on every navigation within the SPA.
//   2. localStorage backup        → survives full page reloads AND new sessions.
//   3. Sync getter (getCachedProducts) → lets components hydrate state at mount
//      with zero loading flash on a warm cache.
//
// TTL is 30 minutes. Frontend pages don't see edits in real time anyway (ISR
// caches landing pages for 10 min), so this is consistent. The admin should
// call invalidateProductsCache() after any product write so the next read is
// fresh.
import type { Product } from '@/types/product'

const API     = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const TTL_MS  = 30 * 60 * 1000          // 30 min — products change rarely
const STORAGE = 'cc-products-cache-v2'  // bump version when cache shape changes

interface Cached { ts: number; data: Product[] }

let memCache: Cached | null = null
let inflight: Promise<Product[]> | null = null   // dedupe concurrent calls

function readStorage(): Cached | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE)
    if (!raw) return null
    const parsed: Cached = JSON.parse(raw)
    if (!parsed?.ts || !Array.isArray(parsed.data)) return null
    if (Date.now() - parsed.ts > TTL_MS) return null
    return parsed
  } catch { return null }
}

function writeStorage(c: Cached): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(STORAGE, JSON.stringify(c)) } catch {
    // Quota exceeded — non-fatal. Memory cache still works.
  }
}

async function fetchFromApi(): Promise<Product[]> {
  let products: Product[] = []
  let lastKey: any = null
  do {
    const url = lastKey
      ? `${API}/products?limit=500&last_key=${encodeURIComponent(JSON.stringify(lastKey))}`
      : `${API}/products?limit=500`
    const res = await fetch(url)
    if (!res.ok) break
    const data = await res.json()
    products = products.concat(data.products || [])
    lastKey = data.nextKey || null
  } while (lastKey)
  return products
}

/**
 * SYNCHRONOUS cache check. Returns cached products immediately if available
 * and fresh, otherwise null. Use this in `useState(() => …)` initializers so
 * the component renders with data on the very first paint — no loading flash.
 *
 * Safe to call on the server; returns null there (the localStorage layer is
 * client-only, and memCache will be null on first SSR pass anyway).
 */
export function getCachedProducts(): Product[] | null {
  if (memCache && Date.now() - memCache.ts < TTL_MS) return memCache.data
  const fromStorage = readStorage()
  if (fromStorage) {
    memCache = fromStorage
    return fromStorage.data
  }
  return null
}

/**
 * Async fetch with caching. Returns cached data instantly when available,
 * dedupes concurrent calls, and persists to localStorage for next time.
 *
 * Pass `{ force: true }` after a write to bypass cache.
 */
export async function fetchAllProducts(opts: { force?: boolean } = {}): Promise<Product[]> {
  if (!opts.force) {
    const cached = getCachedProducts()
    if (cached) return cached
  }
  if (inflight) return inflight
  inflight = (async () => {
    try {
      const data = await fetchFromApi()
      const fresh: Cached = { ts: Date.now(), data }
      memCache = fresh
      writeStorage(fresh)
      return data
    } finally { inflight = null }
  })()
  return inflight
}

/**
 * Clear all cache layers so the next call refetches. Call after creating,
 * editing, or deleting a product.
 */
export function invalidateProductsCache(): void {
  memCache = null
  inflight = null
  if (typeof window !== 'undefined') {
    try { window.localStorage.removeItem(STORAGE) } catch {}
  }
}
