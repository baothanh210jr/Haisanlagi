<template>
  <div class="container">
    <HeroSlider
      v-if="heroProducts?.length"
      :products="heroProducts"
      class="mt-5 rounded-2xl max-h-[500px]"
    />
    <section class="mt-5">
      <h2>Danh mục</h2>
      <div class="relative">
        <Swiper
          :modules="[FreeMode, Mousewheel, Navigation]"
          :slides-per-view="2"
          :space-between="10"
          :free-mode="true"
          :mousewheel="{ forceToAxis: true }"
          :breakpoints="{ 640: { slidesPerView: 3 }, 768: { slidesPerView: 4 }, 1024: { slidesPerView: 6 } }"
          :navigation="{ nextEl: '.categories-next', prevEl: '.categories-prev' }"
          class="category-swiper"
          @swiper="onSwiper"
          @progress="onProgress"
          @slide-change="onSlideChange"
        >
          <SwiperSlide
            v-for="cat in categories"
            :key="cat.id"
          >
            <NuxtLink
              :to="`/category/${cat.slug}`"
              class="category-card"
            >
              <span>{{ cat.name }}</span>
            </NuxtLink>
          </SwiperSlide>
        </Swiper>
        <div class="flex items-center mt-4 gap-4">
          <div class="flex items-center gap-2">
            <button
              class="categories-prev inline-flex items-center justify-center  text-secondary-100 w-10 h-10 hover:bg-gray-100 focus:outline-none"
              :class="{ 'opacity-50 pointer-events-none': isBeginning }"
              aria-label="Previous categories"
            >
              <Icon
                icon="lucide:move-left"
                width="22"
                height="22"
              />
            </button>
            <button
              class="categories-next inline-flex items-center justify-center text-secondary-100 w-10 h-10 hover:bg-gray-100 focus:outline-none"
              :class="{ 'opacity-50 pointer-events-none': isEnd }"
              aria-label="Next categories"
            >
              <Icon
                icon="lucide:move-right"
                width="22"
                height="22"
              />
            </button>
          </div>
          <div class=" w-full ">
            <div class="h-1 bg-gray-200/10 rounded">
              <div
                class="h-1 bg-primary/50 rounded transition-all"
                :style="{ width: `${Math.round(progress * 100)}%` }"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2>Sản phẩm mới</h2>
      <div class="grid">
        <!-- Use ProductCard for nicer product UI -->
        <ProductCard
          v-for="p in products"
          :key="p.id"
          :product="p"
        />
      </div>
      <Pagination
        :page="page"
        :page-count="pageCount"
        @update:page="val => page = val"
      />
    </section>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/ui/Pagination.vue'
import ProductCard from '~/components/ui/ProductCard.vue'
import HeroSlider from '~/components/ui/HeroSlider.vue'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { FreeMode, Mousewheel, Navigation } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import { Icon } from '@iconify/vue'


import { useCategories } from '~/composables/useCategories'
import { useHomeProducts } from '~/composables/useHomeProducts'
import { useHomeSlides } from '~/composables/useHomeSlides'
import { watch } from 'vue'

const limit = 12
let page = ref(1)

const { categories, ensureCategories } = useCategories()
await ensureCategories()

const { products, pageCount, ensureProducts } = useHomeProducts(page, limit)
await ensureProducts()

// Refetch when page changes (use cache if already loaded)
watch(page, () => { ensureProducts() })

const { heroProducts, ensureSlides } = useHomeSlides(5)
await ensureSlides()

const progress = ref(0)
const isBeginning = ref(true)
const isEnd = ref(false)
let catSwiper: any
function onSwiper(swiper: any) {
  catSwiper = swiper
  updateCoverage(swiper)
}
function onProgress(swiper: any) {
  // Use coverage instead of translate progress
  updateCoverage(swiper)
}
function onSlideChange(swiper: any) {
  updateCoverage(swiper)
}
function updateCoverage(swiper: any) {
  const total: number = swiper?.slides?.length || 0
  if (!total) {
    progress.value = 0
    isBeginning.value = true
    isEnd.value = true
    return
  }
  const firstIndex: number = swiper?.activeIndex || 0
  // Try to get the actual visible slides count (respect breakpoints)
  let visible = 1
  try {
    if (typeof swiper?.params?.slidesPerView === 'number') {
      visible = swiper.params.slidesPerView
    } else if (typeof swiper?.slidesPerView === 'number') {
      visible = swiper.slidesPerView
    } else if (typeof swiper?.slidesPerViewDynamic === 'function') {
      visible = swiper.slidesPerViewDynamic('current', true)
    }
  } catch {}

  const lastShown = Math.min(firstIndex + visible, total)
  progress.value = lastShown / total
  isBeginning.value = !!swiper?.isBeginning
  isEnd.value = !!swiper?.isEnd
}

</script>

<style scoped>
/* Dùng Tailwind container, bỏ CSS container cứng */
.hero {
  padding: 24px;
  text-align: center;
}

.category-card {
  @apply bg-primary text-white inline-flex w-full items-center justify-center p-3 border border-gray-200 rounded-xl no-underline text-gray-900 hover:bg-primary/80 transition-colors duration-300 text-white;
}
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
section { margin-bottom: 24px; }
h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
</style>