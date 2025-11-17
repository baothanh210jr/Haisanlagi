type HotProduct = {
  id: number | string
  name: string
  price: number
  image?: string
  slug?: string
  category?: string
  sale_price?: number
  salePrice?: number
}

export function useHotProducts(limit = 12, ttlMs = 300_000) {
  const hotProducts = useState<HotProduct[]>('hot_products', () => [])
  const loaded = useState<boolean>('hot_products_loaded', () => false)
  const lastTs = useState<number>('hot_products_ts', () => 0)

  async function ensureHotProducts(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true

    try {
      const qs = new URLSearchParams()
      qs.set('limit', String(limit))
      qs.set('fields', '*.products_id.*')
      const res = await fetch(`/api/directus/items/products_hot?${qs.toString()}`)
      const json = (await res.json()) as { data?: any[] }

      const list = json?.data?.[0]?.products || []
      const items = (list || []).map((item: { products_id: HotProduct }) => {
        const product = item?.products_id || {}
        const name = product?.name
        const slug = product?.slug
        const price = Number(product?.price ?? 0) || 0
        const salePrice = Number(product?.sale_price ?? price) || price
        const categoryId = product?.category
        const image = product.image

        return {
          id: product?.id ?? slug ?? name,
          name,
          price,
          image,
          slug,
          categoryId,
          salePrice,
        }
      }) as HotProduct[]

      hotProducts.value = items
      lastTs.value = Date.now()
    } catch (e) {
      hotProducts.value = []
      lastTs.value = Date.now()
    }
  }

  return { hotProducts, ensureHotProducts }
}
