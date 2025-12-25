<template>
  <section id="products">
    <div class="container mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between mb-2">
        <div>
          <h2 class="text-white text-3xl font-bold">Sản phẩm bán chạy</h2>
          <h4 class="text-primary-200 pt-2">
            Tuyển chọn những loại hải sản được khách hàng yêu thích nhất trong tuần qua.
          </h4>
        </div>
        <div class="flex gap-2 justify-end">
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
            class="products-next w-9 h-9 rounded-full bg-secondary text-white flex items-center justify-center transition-colors"
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
          :slides-per-view="1"
          :slides-per-group="1"
          :space-between="12"
          :loop="false"
          :grid="{ rows: 1, fill: 'row' }"
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
import 'swiper/css';
import 'swiper/css/grid';
import 'swiper/css/navigation';
import { Grid, Navigation } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { onMounted } from 'vue';
import ProductCard from '~/components/ui/CardIndex.vue';
import { useHotProducts } from '~/composables/useHotProducts';

const { hotProducts, ensureHotProducts } = useHotProducts();

const breakpoints = {
  640: {
    slidesPerView: 2,
    slidesPerGroup: 2,
    grid: { rows: 2, fill: 'row' as const },
    spaceBetween: 12
  },
  768: {
    slidesPerView: 3,
    slidesPerGroup: 3,
    grid: { rows: 2, fill: 'row' as const },
    spaceBetween: 16
  },
  1024: {
    slidesPerView: 4,
    slidesPerGroup: 3,
    grid: { rows: 2, fill: 'row' as const },
    spaceBetween: 16
  },
  2000: {
    slidesPerView: 4,
    slidesPerGroup: 4,
    grid: { rows: 2, fill: 'row' as const },
    spaceBetween: 20
  }
};

onMounted(() => {
  ensureHotProducts();
});
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
