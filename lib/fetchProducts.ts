// lib/fetchProducts.ts
// Fetch every published product by walking the paginated /products endpoint.
import type { Product } from '@/types/product'

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export async function fetchAllProducts(): Promise<Product[]> {
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
