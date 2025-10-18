<template>
  <ClientOnly>
    <Swiper
      :modules="[Navigation, Pagination, Autoplay, A11y]"
      :slides-per-view="1"
      :loop="true"
      :autoplay="{ delay: 4000, disableOnInteraction: false }"
      :pagination="{ clickable: true }"
      navigation
      class="hero-swiper overflow-hidden rounded-2xl shadow-lg"
    >
      <SwiperSlide v-for="(s, idx) in slides" :key="idx">
        <NuxtLink :to="s.link" class="block relative aspect-[21/9] bg-gray-100">
          <img v-if="s.image" :src="s.image" :alt="s.title" class="h-full w-full object-cover" />
          <div v-else class="h-full w-full flex items-center justify-center text-gray-400">Không có ảnh</div>
          <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-black/20 to-transparent"></div>
          <div class="absolute bottom-0 left-0 right-0 p-5 md:p-8">
            <h2 class="text-white text-lg md:text-2xl font-semibold drop-shadow">{{ s.title }}</h2>
            <div class="mt-2 flex items-center gap-3">
              <span v-if="s.price !== undefined" class="inline-flex items-center rounded-md bg-amber-500/90 px-3 py-1 text-white text-xs shadow-md">
                {{ formatPrice(s.price) }}
              </span>
              <Button size="sm">Xem ngay</Button>
            </div>
          </div>
        </NuxtLink>
      </SwiperSlide>
    </Swiper>
  </ClientOnly>
</template>
<script setup lang="ts">
import Button from '~/components/ui/Button.vue'
import { formatImage } from '~/utils/formatImage'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Pagination, Autoplay, A11y } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export type Product = { id: string | number; name: string; slug: string; price?: number; image?: any; image_default?: any; image_url?: string }

const props = defineProps<{ products: Product[] }>()

const slides = computed(() => {
  return (props.products || []).map(p => ({
    title: p.name,
    price: p.price,
    image: formatImage(p, { width: 1200, height: 500 }),
    link: p.slug ? `/product/${p.slug}` : '#'
  }))
})

function formatPrice(n?: number) {
  if (typeof n !== 'number') return ''
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}
</script>

<style scoped>
/* Tuỳ biến navigation và pagination của Swiper */
:deep(.hero-swiper) { position: relative; }
:deep(.hero-swiper .swiper-button-prev),
:deep(.hero-swiper .swiper-button-next) {
  width: 44px; height: 44px; border-radius: 9999px;
  background: rgba(255,255,255,0.85); color: #111827;
  box-shadow: 0 6px 14px rgba(0,0,0,0.18);
  backdrop-filter: blur(6px);
}
:deep(.hero-swiper .swiper-button-prev)::after,
:deep(.hero-swiper .swiper-button-next)::after {
  font-size: 22px; font-weight: 700;
}
:deep(.hero-swiper .swiper-button-prev) { left: 12px; }
:deep(.hero-swiper .swiper-button-next) { right: 12px; }

:deep(.hero-swiper .swiper-pagination) { bottom: 12px; }
:deep(.hero-swiper .swiper-pagination-bullet) {
  width: 10px; height: 10px; border-radius: 9999px;
  background: rgba(255,255,255,0.6); opacity: 1;
  border: 2px solid rgba(255,255,255,0.9);
  margin: 0 4px; transition: all .2s ease;
}
:deep(.hero-swiper .swiper-pagination-bullet-active) {
  background: #fff; transform: scale(1.2);
  border-color: #fff;
}

@media (max-width: 768px) {
  :deep(.hero-swiper .swiper-button-prev),
  :deep(.hero-swiper .swiper-button-next) {
    width: 36px; height: 36px;
  }
  :deep(.hero-swiper .swiper-button-prev)::after,
  :deep(.hero-swiper .swiper-button-next)::after {
    font-size: 18px;
  }
}
</style>