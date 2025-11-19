import type { Ref } from 'vue'

export type ToastItem = {
  id: number
  text: string
  type?: 'success' | 'info' | 'error' | 'warning'
  actionText?: string
  actionTo?: string
  timeout?: number
  image?: string
}

export function useToast() {
  const toasts = useState<ToastItem[]>('toasts', () => [])

  function remove(id: number) {
    const idx = toasts.value.findIndex((t) => t.id === id)
    if (idx !== -1) toasts.value.splice(idx, 1)
  }

  function show(payload: Omit<ToastItem, 'id'>) {
    const id = Date.now() + Math.floor(Math.random() * 1000)
    const item: ToastItem = { id, timeout: 3000, type: 'success', ...payload }
    toasts.value.push(item)
    const ms = item.timeout || 3000
    if (ms > 0) {
      setTimeout(() => remove(id), ms)
    }
    return id
  }

  function success(text: string, opts: Partial<ToastItem> = {}) {
    return show({ text, type: 'success', ...opts })
  }

  function error(text: string, opts: Partial<ToastItem> = {}) {
    return show({ text, type: 'error', ...opts })
  }

  return { toasts: toasts as Ref<ToastItem[]>, show, success, error, remove }
}
