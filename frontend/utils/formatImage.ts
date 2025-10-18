export type FileRef = string | { id?: string } | null | undefined

export interface ImageOptions {
  width?: number
  height?: number
  quality?: number
  fit?: 'cover' | 'contain' | 'inside' | 'outside'
}

function toId(val: FileRef): string | null {
  if (!val) return null
  if (typeof val === 'string') return val
  if (typeof val === 'object' && val.id) return String(val.id)
  return null
}

export function formatImage(
  source: { image?: FileRef, image_default?: FileRef, image_url?: string } | null,
  opts: ImageOptions = {}
): string {
  if (!source) return ''
  const config = useRuntimeConfig()
  const baseUrl = config.public.directusUrl
  const id = toId(source.image) || toId(source.image_default)
  const url = (source as any).image_url as string | undefined
  if (!id && url) return url
  if (!id) return ''
  const width = opts.width ?? 800
  const height = opts.height ?? 600
  const quality = opts.quality ?? 80
  const fit = opts.fit ?? 'cover'
  const params = new URLSearchParams({
    fit: String(fit),
    width: String(width),
    height: String(height),
    quality: String(quality)
  })
  return `${baseUrl}/assets/${id}?${params.toString()}`
}