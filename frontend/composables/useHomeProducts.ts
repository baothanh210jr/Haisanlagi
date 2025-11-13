type Product = {
  id: number | string
  name: string
  price: number
  image_default?: any
  image?: any
  image_url?: string
  slug: string
}

type ProductsResp = { data: Product[]; meta: { filter_count: number } }

import type { Ref } from 'vue'

export function useHomeProducts(page: Ref<number>, limit = 12, ttlMs = 1) {
  const productsRespMap = useState<Record<number, ProductsResp>>('home_products_resp', () => ({}))
  const loadedPages = useState<Record<number, boolean>>('home_products_loaded', () => ({}))
  const timestamps = useState<Record<number, number>>('home_products_ts', () => ({}))

  async function ensureProducts(force = false) {
    const p = page.value
    const last = timestamps.value[p] || 0
    const fresh = Date.now() - last < ttlMs
    if (!force && loadedPages.value[p] && fresh) return
    loadedPages.value[p] = true
    try {
      const qs = new URLSearchParams()
      qs.set('meta', 'filter_count')
      qs.set('limit', String(limit))
      qs.set('page', String(p))
      qs.set('filter[status][_eq]', 'published')
      const res = await fetch(`/api/directus/items/products?${qs.toString()}`)
      const json = await res.json()
      productsRespMap.value[p] = (json || { data: [], meta: { filter_count: 0 } }) as ProductsResp
      console.log(
        '🚀 ~ useHomeProducts.ts:46 ~ ensureProducts ~ productsRespMap.value[p]:',
        productsRespMap.value[p]
      )
      timestamps.value[p] = Date.now()
    } catch {
      productsRespMap.value[p] = { data: [], meta: { filter_count: 0 } }
      timestamps.value[p] = Date.now()
    }
  }

  const products = computed(() => (productsRespMap.value[page.value]?.data || []) as Product[])
  const pageCount = computed(() =>
    Math.max(
      1,
      Math.ceil(((productsRespMap.value[page.value]?.meta?.filter_count || 0) as number) / limit)
    )
  )

  console.log('🚀 ~ useHomeProducts.ts:39 ~ useHomeProducts ~ products:', products.value)
  return { products, pageCount, ensureProducts }
}
