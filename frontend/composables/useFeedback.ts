type Feedback = {
  id: number | string
  name: string
  job: string
  content: string
  avatar: string
}

export function useFeedback(limit = 12, ttlMs = 300_000) {
  const feedback = useState<Feedback[]>('feedback', () => [])
  const loaded = useState<boolean>('feedback_loaded', () => false)
  const lastTs = useState<number>('feedback_ts', () => 0)

  async function ensureFeedback(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true

    try {
      const qs = new URLSearchParams()
      qs.set('limit', String(limit))
      qs.set('fields', '*.products_id.*')
      const res = await fetch(`/api/directus/items/feedback?${qs.toString()}`)
      const json = (await res.json()) as { data?: any[] }
      const list = json?.data || []
      feedback.value = list
      lastTs.value = Date.now()
    } catch (e) {
      feedback.value = []
      lastTs.value = Date.now()
    }
  }

  return { feedback, ensureFeedback }
}
