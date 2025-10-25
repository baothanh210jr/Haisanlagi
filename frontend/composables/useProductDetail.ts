import { readItems } from '@directus/sdk'

type Product = {
  id: number | string
  name: string
  slug: string
  price: number
  image?: any
  description?: string
  category?: number | string
}

export function useProductDetail(slug: string) {
  const product = useState<Product | null>(`product-${slug}`, () => null)
  const loaded = useState<boolean>(`product-${slug}-loaded`, () => false)
  const { $directus } = useNuxtApp()

  async function ensureProduct() {
    if (loaded.value) return
    loaded.value = true
    try {
      // @ts-ignore
      const items = await $directus.request(
        readItems('products', {
          filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
          limit: 1,
        })
      )
      product.value = (items[0] || null) as any
    } catch {
      product.value = null
    }
  }

  return { product, ensureProduct }
}
