type Product = {
  id: number | string
  name: string
  price: number
  image_default?: any
  image?: any
  image_url?: string
  slug: string
}

type Slide = {
  id: number | string
  title?: string
  product?: number | string
  image?: any
  image_url?: string
}

// Khôi phục chữ ký: limit trước, TTL sau; trả về heroProducts để tương thích index.vue
export function useHomeSlides(limit = 5, ttlMs = 300_000) {
  const slides = useState<Slide[]>('home_slides', () => [])
  const productsById = useState<Record<string | number, Product>>(
    'home_slides_products',
    () => ({})
  )
  const loaded = useState<boolean>('home_slides_loaded', () => false)
  const lastTs = useState<number>('home_slides_ts', () => 0)
  const runtime = useRuntimeConfig()

  async function ensureSlides(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true
    try {
      const qs = new URLSearchParams()
      qs.set('limit', String(limit))
      const res = await fetch(`${runtime.public.directusUrl}/items/home_slides?${qs.toString()}`)
      const json = await res.json()
      slides.value = (json?.data || []) as Slide[]

      const ids = slides.value
        .map((s) => (s as any).product)
        .filter((x): x is string | number => x != null)
      if (ids.length) {
        const qsp = new URLSearchParams()
        qsp.set('filter[id][_in]', ids.join(','))
        qsp.set('filter[status][_eq]', 'published')
        const pres = await fetch(`${runtime.public.directusUrl}/items/products?${qsp.toString()}`)
        const pjson = await pres.json()
        const list = (pjson?.data || []) as Product[]
        const map: Record<string | number, Product> = {}
        for (const p of list) map[p.id] = p
        productsById.value = map
      } else {
        productsById.value = {}
      }
      lastTs.value = Date.now()
    } catch {
      slides.value = []
      productsById.value = {}
      lastTs.value = Date.now()
    }
  }

  // Tạo danh sách sản phẩm cho HeroSlider theo props cũ
  const heroProducts = computed(() => {
    return (slides.value || []).map((s) => {
      const p = productsById.value[(s as any).product]
      return {
        id: p?.id ?? s.id,
        name: s?.title || p?.name || 'Sản phẩm',
        slug: p?.slug || '',
        price: p?.price || 0,
        image: s?.image || p?.image || null,
        image_default: null,
        image_url: s?.image_url || p?.image_url || '',
      } as Product
    })
  })

  return { heroProducts, ensureSlides }
}
