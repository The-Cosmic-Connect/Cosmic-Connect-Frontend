import { useEffect } from 'react'
import { useRouter } from 'next/router'

export default function ShopAll() {
  const router = useRouter()
  useEffect(() => {
    router.replace('/shop/collection/all')
  }, [])
  return null
}