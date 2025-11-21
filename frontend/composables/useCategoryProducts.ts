type ProductsResp = { data: ProductItem[]; meta: { filter_count: number } }

type Category = { id: number | string; name: string; slug: string }

import type { Ref } from 'vue'
import type { ProductItem } from '~/types/Product'

export function useCategoryProducts(
  category: Ref<Category | null>,
  page: Ref<number>,
  limit = 24,
  ttlMs = 300_000
) {
  const respMap = useState<Record<string, ProductsResp>>('category_products_resp', () => ({}))
  const loadedKeys = useState<Record<string, boolean>>('category_products_loaded', () => ({}))
  const timestamps = useState<Record<string, number>>('category_products_ts', () => ({}))

  async function ensureProducts(force = false) {
    const cat = category.value
    if (!cat) return
    const key = `${cat.id}:${page.value}`
    const last = timestamps.value[key] || 0
    const fresh = Date.now() - last < ttlMs
    if (!force && loadedKeys.value[key] && fresh) return
    loadedKeys.value[key] = true
    try {
      const qs = new URLSearchParams()
      qs.set('meta', 'filter_count')
      qs.set('limit', String(limit))
      qs.set('page', String(page.value))
      qs.set('fields', '*,variants.*')
      // Tránh filter theo status để không bị lỗi quyền đọc field "status" trên public role
      qs.set('filter[category][_eq]', String(cat.id))
      const res = await fetch(`/api/directus/items/products?${qs.toString()}`)
      const json = await res.json()
      respMap.value[key] = (json || { data: [], meta: { filter_count: 0 } }) as ProductsResp
      timestamps.value[key] = Date.now()
    } catch {
      respMap.value[key] = { data: [], meta: { filter_count: 0 } }

      timestamps.value[key] = Date.now()
    }
  }

  const products = computed(() => {
    const cat = category.value
    if (!cat) return [] as ProductItem[]
    const key = `${cat.id}:${page.value}`
    return (respMap.value[key]?.data || []) as ProductItem[]
  })

  const pageCount = computed(() => {
    const cat = category.value
    if (!cat) return 1
    const key = `${cat.id}:${page.value}`
    const count = (respMap.value[key]?.meta?.filter_count || 0) as number
    return Math.max(1, Math.ceil(count / limit))
  })

  return { products, pageCount, ensureProducts }
}
