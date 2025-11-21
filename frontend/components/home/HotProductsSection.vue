<template>
  <section id="products">
    <div class="container mx-auto px-6 md:px-12 lg:px-24 py-12">
      <div class="flex items-center justify-between mb-2">
        <div>
          <h2 class="text-3xl font-bold">Sản phẩm bán chạy</h2>
          <h4 class="text-gray-600 pt-2">
            Tuyển chọn những loại hải sản được khách hàng yêu thích nhất trong tuần qua.
          </h4>
        </div>
        <div class="flex gap-2">
          <button
            class="products-prev w-9 h-9 rounded-full bg-blue-100 hover:bg-blue-200 flex items-center justify-center transition-colors"
          >
            <svg
              class="w-5 h-5 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            class="products-next w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
      <ClientOnly>
        <Swiper
          :modules="[Navigation, Grid]"
          :slides-per-view="2"
          :slides-per-group="2"
          :space-between="16"
          :loop="false"
          :grid="{ rows: 2, fill: 'row' }"
          :navigation="{ nextEl: '.products-next', prevEl: '.products-prev' }"
          :breakpoints="breakpoints"
          class="products-swiper !py-10"
        >
          <SwiperSlide v-for="(product, index) in hotProducts" :key="index" class="!h-auto">
            <div class="h-full flex">
              <ProductCard :product="product as any" class="flex-1" />
            </div>
          </SwiperSlide>
        </Swiper>
      </ClientOnly>
    </div>
  </section>
</template>

<script setup lang="ts">
  import 'swiper/css'
  import 'swiper/css/grid'
  import 'swiper/css/navigation'
  import { Grid, Navigation } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { onMounted } from 'vue'
  import ProductCard from '~/components/ui/CardIndex.vue'
  import { useHotProducts } from '~/composables/useHotProducts'

  const { hotProducts, ensureHotProducts } = useHotProducts()

  const breakpoints = {
    640: {
      slidesPerView: 2,
      slidesPerGroup: 2,
      grid: { rows: 2, fill: 'row' as const },
      spaceBetween: 12,
    },
    768: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      grid: { rows: 2, fill: 'row' as const },
      spaceBetween: 16,
    },
    1024: {
      slidesPerView: 3,
      slidesPerGroup: 3,
      grid: { rows: 2, fill: 'row' as const },
      spaceBetween: 16,
    },
  }

  onMounted(() => {
    ensureHotProducts()
  })
</script>

<style scoped>
  :deep(.products-swiper .swiper-wrapper) {
    align-items: stretch;
  }

  :deep(.products-swiper .swiper-slide) {
    height: auto !important;
    display: flex;
  }

  :deep(.products-swiper .swiper-slide > *) {
    flex: 1;
  }
</style>
