type Product = {
  id: number | string
  name: string
  slug: string
  price: number
  image?: any
  description?: string
  category?: any
}

export function useProductDetail(slug: string) {
  const product = useState<Product | null>(`product-${slug}`, () => null)
  const loaded = useState<boolean>(`product-${slug}-loaded`, () => false)

  async function ensureProduct(force = false) {
    if (loaded.value && !force) return
    try {
      const qs = new URLSearchParams()
      qs.set('limit', '1')
      qs.set('filter[slug][_eq]', slug)
      // Expand relational category to include slug for linking
      qs.set('fields', '*,category.slug')
      const res = await fetch(`/api/directus/items/products?${qs.toString()}`)
      const json = await res.json()
      const items = (json?.data || []) as any[]
      product.value = (items[0] || null) as any
      loaded.value = true
    } catch {
      product.value = null
      loaded.value = false
    }
  }

  return { product, ensureProduct }
}
