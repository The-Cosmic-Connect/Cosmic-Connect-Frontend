// lib/fetchProducts.ts
//
// Stale-while-revalidate product catalog cache with INCREMENTAL SYNC.
//
// Architecture:
//   - First visit: full fetch from /products (paginated). Stores products plus
//     the server's `serverTime` watermark.
//   - Subsequent background refreshes: call /products/changes-since?since=<watermark>
//     to get ONLY the products updated since last sync. Merge into local cache.
//   - Deletes are propagated via tombstones (items with deleted=true): client
//     removes them from local cache.
//   - If server signals fullSync=true (client's `since` is stale, GSI down,
//     etc.), the client falls back to a fresh full fetch — self-healing.
//
// At scale this is huge: 100K users/day × one tiny delta query per session is
// pennies of DynamoDB reads. The full-fetch alternative is 100K full scans.
//
// Storage:
//   - memCache  : module-level memory     (instant within an SPA session)
//   - localStorage : persistent backup    (survives reload + browser restart)
//
// Freshness model:
//   - < 5 min       : no refetch
//   - 5 min – 24 hr : return cache instantly + delta sync in BACKGROUND
//   - > 24 hr       : discard, treat as cold start
//
// Cache invalidation: call invalidateProductsCache() after admin writes.
import type { Product } from '@/types/product'

const API        = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const FRESH_MS   = 5  * 60 * 1000
const STALE_MS   = 24 * 60 * 60 * 1000
const STORAGE    = 'cc-products-cache-v4'   // bumped — adds syncedAt watermark

interface Cached {
  ts:       number        // local timestamp of last update (for freshness)
  syncedAt: string        // server timestamp to pass as `since` next call
  data:     Product[]
}

let memCache: Cached | null = null
let inflight: Promise<Product[]> | null = null

// ── storage layer ────────────────────────────────────────────────────────────
function readStorage(): Cached | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = window.localStorage.getItem(STORAGE)
    if (!raw) return null
    const parsed: Cached = JSON.parse(raw)
    if (!parsed?.ts || !parsed.syncedAt || !Array.isArray(parsed.data)) return null
    return parsed
  } catch { return null }
}

function writeStorage(c: Cached): void {
  if (typeof window === 'undefined') return
  try { window.localStorage.setItem(STORAGE, JSON.stringify(c)) } catch {}
}

function ageOfCache(): number {
  if (memCache) return Date.now() - memCache.ts
  const fromStorage = readStorage()
  if (fromStorage) {
    memCache = fromStorage
    return Date.now() - fromStorage.ts
  }
  return Infinity
}

// ── network ──────────────────────────────────────────────────────────────────
async function doFullFetch(): Promise<Cached> {
  let products: Product[] = []
  let lastKey:  any        = null
  let serverTime: string   = new Date().toISOString()   // fallback if no header

  do {
    const url = lastKey
      ? `${API}/products?limit=500&last_key=${encodeURIComponent(JSON.stringify(lastKey))}`
      : `${API}/products?limit=500`
    const res = await fetch(url)
    if (!res.ok) break
    const data = await res.json()
    products    = products.concat(data.products || [])
    lastKey     = data.nextKey || null
    if (data.serverTime) serverTime = data.serverTime
  } while (lastKey)

  const fresh: Cached = { ts: Date.now(), syncedAt: serverTime, data: products }
  memCache = fresh
  writeStorage(fresh)
  return fresh
}

async function doDeltaSync(prev: Cached): Promise<Cached> {
  // Paginate the changes-since response in case a bulk admin update
  // produced more than `limit` rows since the watermark.
  const changes: Product[] = []
  let lastKey: any = null
  let serverTime  = prev.syncedAt
  let fullSync    = false

  do {
    const params = new URLSearchParams({
      since: prev.syncedAt,
      limit: '1000',
    })
    if (lastKey) params.set('last_key', JSON.stringify(lastKey))
    const res = await fetch(`${API}/products/changes-since?${params}`)
    if (!res.ok) { fullSync = true; break }
    const data = await res.json()
    if (data.fullSync) { fullSync = true; break }
    if (Array.isArray(data.items)) changes.push(...data.items)
    lastKey    = data.nextKey   || null
    serverTime = data.serverTime || serverTime
  } while (lastKey)

  if (fullSync) {
    // Server told us to rebuild from scratch (since too old, GSI down, etc.)
    return doFullFetch()
  }

  // Merge: upsert non-deleted, drop deleted-by-id.
  const byId = new Map(prev.data.map((p) => [p.id, p]))
  for (const item of changes) {
    if ((item as any).deleted === true) {
      if (item.id) byId.delete(item.id)
    } else if (item.id) {
      byId.set(item.id, item)
    }
  }
  const merged: Product[] = Array.from(byId.values())
  const fresh: Cached     = { ts: Date.now(), syncedAt: serverTime, data: merged }
  memCache = fresh
  writeStorage(fresh)
  return fresh
}

function refreshInBackground(): void {
  if (inflight) return
  if (!memCache) return                          // nothing to sync against
  inflight = doDeltaSync(memCache).then(() => {}).finally(() => { inflight = null }) as any
}

// ── public API ───────────────────────────────────────────────────────────────

/**
 * Synchronous cache read. Returns cached products if usable (< 24 hr old),
 * otherwise null. Use in `useState(() => …)` for zero-flash mounts.
 */
export function getCachedProducts(): Product[] | null {
  const age = ageOfCache()
  if (age < STALE_MS && memCache) return memCache.data
  return null
}

/**
 * Main entry. Stale-while-revalidate with incremental sync:
 *   - Fresh cache (< 5 min)        → return as-is.
 *   - Stale cache (< 24 hr)        → return cached now; delta sync in background.
 *   - Expired / no cache           → block on full fetch.
 *   - opts.force=true              → ignore cache, run full fetch fresh.
 */
export async function fetchAllProducts(opts: { force?: boolean } = {}): Promise<Product[]> {
  if (opts.force) {
    if (inflight) return inflight as any
    inflight = doFullFetch().then((c) => c.data).finally(() => { inflight = null })
    return inflight
  }

  const age = ageOfCache()

  if (age < FRESH_MS && memCache) return memCache.data

  if (age < STALE_MS && memCache) {
    refreshInBackground()
    return memCache.data
  }

  // Cold: must wait for fresh data.
  if (inflight) return inflight as any
  inflight = doFullFetch().then((c) => c.data).finally(() => { inflight = null })
  return inflight
}

/**
 * Warm the cache from any page (call once on app interactive). Non-blocking.
 * If cache is fresh this is a no-op; if stale it runs a delta sync; if cold
 * it kicks off a full fetch in the background.
 */
export function prefetchProductsInBackground(): void {
  if (typeof window === 'undefined') return
  const age = ageOfCache()
  if (age < FRESH_MS && memCache) return        // already fresh

  if (age < STALE_MS && memCache) {
    refreshInBackground()
    return
  }

  if (inflight) return
  inflight = doFullFetch().then((c) => c.data).finally(() => { inflight = null })
}

/**
 * Wipe cache (memory + localStorage). The next read will do a full fetch.
 * Call after creating, editing, or deleting a product from the admin.
 */
export function invalidateProductsCache(): void {
  memCache = null
  inflight = null
  if (typeof window !== 'undefined') {
    try { window.localStorage.removeItem(STORAGE) } catch {}
  }
}
