import { readItems } from '@directus/sdk'

type Category = { id: number | string; name: string; slug: string }

export function useCategories(limit = 8, ttlMs = 300_000) {
  const categories = useState<Category[]>('categories', () => [])
  const loaded = useState<boolean>('categories_loaded', () => false)
  const lastTs = useState<number>('categories_ts', () => 0)
  const { $directus } = useNuxtApp()

  async function ensureCategories(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true
    try {
      // @ts-ignore
      const data = await $directus.request(
        readItems('categories', { filter: { status: { _eq: 'published' } }, limit })
      )
      categories.value = data as any
      lastTs.value = Date.now()
    } catch {
      categories.value = []
      lastTs.value = Date.now()
    }
  }

  return { categories, ensureCategories }
}