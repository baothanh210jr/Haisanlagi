import { readItems } from '@directus/sdk'

type Category = { id: number | string; name: string; slug: string }

export function useCategoryDetail(slug: string, ttlMs = 300_000) {
  const category = useState<Category | null>(`category-${slug}`, () => null)
  const loaded = useState<boolean>(`category-${slug}-loaded`, () => false)
  const lastTs = useState<number>(`category-${slug}-ts`, () => 0)
  const { $directus } = useNuxtApp()

  async function ensureCategory(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true
    try {
      // @ts-ignore
      const cats = await $directus.request(
        readItems('categories', {
          filter: { slug: { _eq: slug }, status: { _eq: 'published' } },
          limit: 1,
        })
      )
      category.value = (cats[0] || null) as any
      lastTs.value = Date.now()
    } catch {
      category.value = null
      lastTs.value = Date.now()
    }
  }

  return { category, ensureCategory }
}