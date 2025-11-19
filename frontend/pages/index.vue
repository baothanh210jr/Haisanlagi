<template>
  <div>
    <!-- Hero Slider -->
    <section class="">
      <div class="bg-gradient-to-r from-primary/5 to-secondary/5">
        <div>
          <video
            id="isc_two-banner-media-1"
            class="hero-screen w-full h-full object-cover"
            autoplay=""
            muted=""
            loop=""
            playsinline=""
          >
            <source
              src="https://file.hstatic.net/200000971532/file/7020525_market_iced_1280x720.mp4"
              type="video/mp4"
            >
            <source
              src="https://file.hstatic.net/200000971532/file/7020525_market_iced_1280x720.mp4"
              type="video/mov"
            >
          </video>
        </div>
        <!-- <div class="container mx-auto px-6 py-4">
          <div class="rounded-2xl overflow-hidden">
            <HeroSlider
              v-if="heroProducts?.length"
              :products="heroProducts"
              class="hero-screen relative"
            />
          </div>
        </div> -->
      </div>
      <!-- Category Grid -->
      <div
        class="container bg-gradient-to-r from-primary/10 to-secondary/10 rounded-2xl p-4 md:p-6 mt-10"
      >
        <div class="flex items-center justify-between mb-6">
          <h2 class="text-2xl font-bold">
            Danh mục nổi bật
          </h2>
        </div>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <NuxtLink
            v-for="cat in categories"
            :key="cat.id"
            :to="{ name: 'category-slug', params: { slug: cat.slug } }"
            class="group bg-white transition-all border rounded-xl p-4 flex flex-col items-center hover:shadow-lg"
          >
            <div
              class="w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mb-2"
            >
              <Icon
                :icon="cat.icon"
                width="24"
                height="24"
              />
            </div>
            <span class="text-sm font-medium text-center line-clamp-2">
              {{ cat.name }}
            </span>
          </NuxtLink>
        </div>
      </div>
    </section>
    <!-- Hot Products Grid -->
    <section class="mt-10 bg-gray-50 pt-10">
      <div class="container mx-auto px-6">
        <div class="flex items-center justify-between mb-2">
          <h2 class="text-2xl font-bold">
            Sản phẩm bán chạy
          </h2>
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
              <svg
                class="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
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
            :breakpoints="{
              640: {
                slidesPerView: 2,
                slidesPerGroup: 2,
                grid: { rows: 2, fill: 'row' },
                spaceBetween: 12,
              },
              768: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                grid: { rows: 2, fill: 'row' },
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                slidesPerGroup: 3,
                grid: { rows: 2, fill: 'row' },
                spaceBetween: 16,
              },
            }"
            class="products-swiper !py-4"
          >
            <SwiperSlide
              v-for="(product, index) in hotProducts"
              :key="index"
            >
              <ProductCard :product="product as any" />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>
    </section>

    <section
      id="testimonials"
      class="py-16 bg-gray-50"
    >
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">
          Ý kiến của khách hàng
        </h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
              >
                J
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  John Smith
                </h4>
                <p class="text-gray-600 text-sm">
                  Chef
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Chất lượng tuyệt vời, hải sản luôn tươi ngon."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
              >
                M
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  Maria Garcia
                </h4>
                <p class="text-gray-600 text-sm">
                  Home Cook
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Giao nhanh, chất lượng ổn định, gia đình rất thích."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
              >
                D
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">
                  David Chen
                </h4>
                <p class="text-gray-600 text-sm">
                  Restaurant Owner
                </p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Nhà cung cấp tin cậy, rất phù hợp cho nhà hàng."
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import 'swiper/css'
  import 'swiper/css/grid'
  import 'swiper/css/navigation'
  import 'swiper/css/pagination'
  import { Grid, Navigation } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { onMounted, ref } from 'vue'
  import ProductCard from '~/components/ui/CardIndex.vue'
  import HeroSlider from '~/components/ui/HeroSlider.vue'
  import { useHomeProducts } from '~/composables/useHomeProducts'
  import { useHomeSlides } from '~/composables/useHomeSlides'
  import { useHotProducts } from '~/composables/useHotProducts'
  const { hotProducts, ensureHotProducts } = useHotProducts()
  const { heroProducts, ensureSlides } = useHomeSlides(5)
  const pageHome = ref(1)
  const {
    products: homeProducts,
    pageCount: pageCountHome,
    ensureProducts,
  } = useHomeProducts(pageHome, 12)
  // Categories
  const { categories, ensureCategories } = useCategories(8)

  // Page metadata
  useHead({
    title: 'Fresh Seafood - From Boat to Your Home',
    meta: [
      {
        name: 'description',
        content:
          "Premium quality seafood delivered fresh to your doorstep. Experience the ocean's finest catch with our sustainable fishing practices.",
      },
    ],
  })

  // Đo chiều cao header và gán vào biến CSS để tính hero = 100dvh - header
  onMounted(() => {
    const headerEl = document.querySelector('header')
    const h =
      headerEl && headerEl instanceof HTMLElement ? headerEl.getBoundingClientRect().height : 0
    document.documentElement.style.setProperty('--header-h', `${h}px`)
    ensureCategories(true)
    ensureSlides(true)
    ensureProducts(true)
    ensureHotProducts(true)
  })
</script>

<style>
  .hero-screen {
    /* Chiều cao toàn màn hình trừ phần header (dùng dvh để tránh thanh trình duyệt di động) */
    max-height: calc(100vh - var(--header-h));
  }
</style>
