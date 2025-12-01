export function normalizeBaseUrl(url?: string): string {
  const raw = (url || '').trim()
  if (!raw) throw new Error('DIRECTUS_URL is missing. Set it in frontend .env')
  const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
  return withProto.replace(/\/$/, '')
}
