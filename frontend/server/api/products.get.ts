import { useRuntimeConfig } from '#imports'
import { defineEventHandler, getQuery } from 'h3'
import { normalizeBaseUrl } from '~/utils/normalizeBaseUrl'

const isDev = (globalThis as any).process?.env?.NODE_ENV !== 'production'
if (isDev && (globalThis as any).process) {
  ;(globalThis as any).process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
}

function stripDiacritics(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
}

function slugifyTerm(value: string) {
  return stripDiacritics(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  const { search = '', limit = '8' } = getQuery(event)
  console.log('🚀 ~ products.get.ts:27 ~ search:', search)
  const config = useRuntimeConfig()
  const baseUrl = normalizeBaseUrl(config.public.directusUrl)

  const qs = new URLSearchParams()
  qs.set('fields', 'id,name,slug,image,variants.*')
  qs.set('limit', String(limit))
  qs.set('meta', 'filter_count')

  const rawTerm = (Array.isArray(search) ? search[0] : search)?.toString().trim() || ''
  const normalizedTerm = rawTerm ? stripDiacritics(rawTerm).toLowerCase() : ''
  const slugTerm = rawTerm ? slugifyTerm(rawTerm) : ''

  if (rawTerm) {
    let idx = 0
    qs.set(`filter[_or][${idx++}][name][_icontains]`, rawTerm)
    if (slugTerm) {
      qs.set(`filter[_or][${idx++}][slug][_icontains]`, slugTerm)
    }
  }

  try {
    const res = await fetch(`${baseUrl}/items/products?${qs.toString()}`)
    event.node.res.statusCode = res.status
    const data = await res.json().catch(() => ({}))

    let list = Array.isArray(data?.data) ? data.data : []

    if (normalizedTerm) {
      list = list.filter((item: any) => {
        const name = stripDiacritics(String(item?.name || '')).toLowerCase()
        const desc = stripDiacritics(String(item?.description || '')).toLowerCase()
        const slug = String(item?.slug || '').toLowerCase()
        return (
          name.includes(normalizedTerm) ||
          desc.includes(normalizedTerm) ||
          (slugTerm && slug.includes(slugTerm))
        )
      })
    }
    console.log('🚀 ~ products.get.ts:68 ~ list:', list)

    return {
      data: list,
      meta: { ...(data?.meta || {}), filter_count: list.length },
    }
  } catch (err) {
    event.node.res.statusCode = 500
    return { data: [], meta: {}, error: 'Failed to fetch products' }
  }
})
