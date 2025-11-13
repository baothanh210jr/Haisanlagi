type Category = { id: number | string; name: string; slug: string }

export function useCategoryDetail(slug: string, ttlMs = 1) {
  const category = useState<Category | null>(`category-${slug}`, () => null)
  const loaded = useState<boolean>(`category-${slug}-loaded`, () => false)
  const lastTs = useState<number>(`category-${slug}-ts`, () => 0)

  async function ensureCategory(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true
    try {
      const qs = new URLSearchParams()
      qs.set('limit', '1')
      qs.set('filter[slug][_eq]', slug)
      const res = await fetch(`/api/directus/items/categories?${qs.toString()}`)
      const data = await res.json()
      const cats = (data?.data || []) as any[]
      category.value = (cats[0] || null) as any
      lastTs.value = Date.now()
    } catch {
      category.value = null
      lastTs.value = Date.now()
    }
  }

  return { category, ensureCategory }
}
