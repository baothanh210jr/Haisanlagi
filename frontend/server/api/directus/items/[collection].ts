import { defineEventHandler, useRuntimeConfig } from '#imports'

// Dev-only TLS bypass to avoid local issuer certificate errors
const isDev = (globalThis as any).process?.env?.NODE_ENV !== 'production'
if (isDev && (globalThis as any).process) {
  ;(globalThis as any).process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()

  function normalizeBaseUrl(url?: string): string {
    const raw = (url || '').trim()
    if (!raw) throw new Error('DIRECTUS_URL is missing. Set it in frontend .env')
    const withProto = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`
    return withProto.replace(/\/$/, '')
  }

  const baseUrl = normalizeBaseUrl(runtime.public.directusUrl)

  // Get collection param safely without importing h3 helpers
  const collection = ((event as any)?.context?.params?.collection || '').trim()
  if (!collection) {
    return { error: true, statusCode: 400, message: 'Missing collection param' }
  }

  // Limit to GET for now
  const method = event.node.req.method || 'GET'
  if (method !== 'GET') {
    return { error: true, statusCode: 405, message: 'Method Not Allowed' }
  }

  // Forward query params
  const reqUrl = event.node.req.url || ''
  const u = new URL(reqUrl, 'http://localhost')
  const qs = u.searchParams.toString()

  const directusUrl = `${baseUrl}/items/${collection}`
  try {
    const res = await fetch(`${directusUrl}${qs ? `?${qs}` : ''}`)
    const data = await res.json()
    return data
  } catch (e) {
    return { data: [], meta: { filter_count: 0 } }
  }
})
