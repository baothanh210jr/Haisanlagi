import { defineEventHandler, readBody, useRuntimeConfig } from '#imports'
import { normalizeBaseUrl } from '~/utils/normalizeBaseUrl'
// Dev-only TLS bypass to avoid local issuer certificate errors
const isDev = (globalThis as any).process?.env?.NODE_ENV !== 'production'
if (isDev && (globalThis as any).process) {
  ;(globalThis as any).process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

export default defineEventHandler(async (event) => {
  const runtime = useRuntimeConfig()

  const baseUrl = normalizeBaseUrl(runtime.public.directusUrl)

  // Get collection param safely without importing h3 helpers
  const collection = ((event as any)?.context?.params?.collection || '').trim()
  if (!collection) {
    return { error: true, statusCode: 400, message: 'Missing collection param' }
  }

  const method = (event.node.req.method || 'GET').toUpperCase()
  const allowedMethods = new Set(['GET', 'POST', 'PATCH', 'DELETE'])
  if (!allowedMethods.has(method)) {
    event.node.res.statusCode = 405
    return { error: true, statusCode: 405, message: 'Method Not Allowed' }
  }

  // Forward query params
  const reqUrl = event.node.req.url || ''
  const u = new URL(reqUrl, 'http://localhost')
  const qs = u.searchParams.toString()

  const directusUrl = `${baseUrl}/items/${collection}`
  try {
    const headers = new Headers()
    const incomingType = event.node.req.headers['content-type']
    if (Array.isArray(incomingType)) {
      headers.set('content-type', incomingType[0])
    } else if (incomingType) {
      headers.set('content-type', incomingType)
    }

    let body: any = undefined
    if (method !== 'GET' && method !== 'DELETE') {
      const payload = await readBody(event)
      if (payload !== undefined) {
        body = typeof payload === 'string' ? payload : JSON.stringify(payload)
        if (!headers.has('content-type')) {
          headers.set('content-type', 'application/json')
        }
      }
    }

    const res = await fetch(`${directusUrl}${qs ? `?${qs}` : ''}`, {
      method,
      headers,
      body,
    })
    event.node.res.statusCode = res.status
    const data = await res.json().catch(() => ({}))
    return data
  } catch (e) {
    event.node.res.statusCode = 500
    return { data: [], meta: { filter_count: 0 } }
  }
})
