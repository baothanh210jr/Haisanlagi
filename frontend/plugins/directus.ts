import { createDirectus, rest } from '@directus/sdk'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const client = createDirectus(config.public.directusUrl).with(rest())

  return {
    provide: {
      directus: client,
    },
  }
})
