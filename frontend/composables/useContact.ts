export type Contact = {
  id: number | string
  title: string
  description: string
  address: string
  hotline: string
  email: string
}

export function useContact(limit = 12, ttlMs = 300_000) {
  const contact = useState<Contact | null>('contact_settings', () => null)
  const loaded = useState<boolean>('contact_loaded', () => false)
  const lastTs = useState<number>('contact_ts', () => 0)

  async function ensureContact(force = false) {
    const fresh = Date.now() - (lastTs.value || 0) < ttlMs
    if (!force && loaded.value && fresh) return
    loaded.value = true

    try {
      const qs = new URLSearchParams()
      qs.set('limit', String(limit))
      qs.set('fields', '*.products_id.*')
      const res = await fetch(`/api/directus/items/contact_settings?${qs.toString()}`)
      const json = (await res.json()) as { data?: Contact }
      const data = json?.data || null
      contact.value = data
      lastTs.value = Date.now()
    } catch (e) {
      contact.value = null
      lastTs.value = Date.now()
    }
  }

  async function submitContactForm(formData: { name: string; phone: string; message: string }) {
    try {
      const res = await fetch('/api/directus/items/contact_form_submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const json = (await res.json()) as { data?: Contact }
      console.log('🚀 ~ useContact.ts:43 ~ submitContactForm ~ json:', json)
      if (!res.ok) {
        throw new Error('Failed to submit contact form')
      }
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }

  return { contact, ensureContact, submitContactForm }
}
