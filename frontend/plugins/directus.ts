import { createDirectus, rest } from '@directus/sdk'

function normalizeBaseUrl(url?: string): string {
  const raw = (url || '').trim()
  if (!raw) throw new Error('DIRECTUS_URL is missing. Set it in frontend .env')
  // Require http/https to avoid Invalid URL errors
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  // Remove trailing slash to avoid double slashes
  return withProto.replace(/\/$/, '')
}

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const baseUrl = normalizeBaseUrl(config.public.directusUrl)
  const client = createDirectus(baseUrl).with(rest())

  return {
    provide: {
      directus: client,
    },
  }
})
