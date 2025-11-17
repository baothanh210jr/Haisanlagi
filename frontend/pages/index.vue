<template>
  <div>
    <!-- Hero Section -->
    <section id="home" class="hero-screen flex items-center justify-center">
      <div class="container">
        <div class="grid lg:grid-cols-12 gap-8">
          <div class="col-span-3" />
          <!-- On-Sale Products (expanded full width while header shows categories) -->
          <div class="relative col-span-9 bg-white rounded-lg overflow-hidden shadow-2xl px-6 py-8">
            <div class="flex items-center justify-between mb-6">
              <h2 class="text-2xl font-bold text-gray-900">Sản phẩm bán chạy</h2>
              <div class="flex gap-2">
                <button
                  class="products-prev w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center transition-colors"
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
                  class="products-next w-10 h-10 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
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

            <!-- Products Swiper -->
            <ClientOnly>
              <Swiper
                :modules="[Navigation, Grid]"
                :slides-per-view="3"
                :slides-per-group="3"
                :space-between="16"
                :loop="false"
                :grid="{ rows: 3, fill: 'row' }"
                :navigation="{ nextEl: '.products-next', prevEl: '.products-prev' }"
                :breakpoints="{
                  640: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    grid: { rows: 2, fill: 'row' },
                    spaceBetween: 12,
                  },
                  768: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    grid: { rows: 3, fill: 'row' },
                    spaceBetween: 16,
                  },
                  1024: {
                    slidesPerView: 2,
                    slidesPerGroup: 2,
                    grid: { rows: 2, fill: 'row' },
                    spaceBetween: 16,
                  },
                  1536: {
                    slidesPerView: 3,
                    slidesPerGroup: 3,
                    grid: { rows: 3, fill: 'row' },
                    spaceBetween: 16,
                  },
                }"
                class="products-swiper"
              >
                <SwiperSlide v-for="(product, index) in hotProducts" :key="index">
                  <CardIndex :product="product" />
                </SwiperSlide>
              </Swiper>
            </ClientOnly>
          </div>
        </div>
      </div>
    </section>
    <!-- How We Ship Section -->
    <section id="how-we-ship" class="py-20 bg-orange-50">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">How We Ship</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <img
              src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=300&auto=format&fit=crop"
              alt="Packaging"
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Expert Packaging</h3>
            <p class="text-gray-600">Temperature-controlled packaging ensures freshness</p>
          </div>
          <div class="text-center">
            <img
              src="https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?q=80&w=300&auto=format&fit=crop"
              alt="Delivery"
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Fast Delivery</h3>
            <p class="text-gray-600">Next-day delivery to maintain peak freshness</p>
          </div>
          <div class="text-center">
            <img
              src="https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?q=80&w=300&auto=format&fit=crop"
              alt="Quality"
              class="w-full h-48 object-cover rounded-xl shadow-lg mb-6"
            />
            <h3 class="text-xl font-semibold text-gray-800 mb-2">Quality Guarantee</h3>
            <p class="text-gray-600">100% satisfaction or your money back</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 bg-white">
      <div class="container mx-auto px-6">
        <h2 class="text-4xl font-bold text-center text-gray-800 mb-16">Testimonials</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
              >
                J
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">John Smith</h4>
                <p class="text-gray-600 text-sm">Chef</p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "The quality is exceptional. My restaurant customers always compliment the freshness
              of the seafood."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
              >
                M
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">Maria Garcia</h4>
                <p class="text-gray-600 text-sm">Home Cook</p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Fast delivery and amazing quality. My family loves the fresh salmon we order every
              week."
            </p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow-lg">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
              >
                D
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">David Chen</h4>
                <p class="text-gray-600 text-sm">Restaurant Owner</p>
              </div>
            </div>
            <p class="text-gray-600 italic">
              "Reliable supplier with consistent quality. Perfect for our high-end restaurant
              needs."
            </p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import 'swiper/css'
  import 'swiper/css/grid'
  import 'swiper/css/navigation'
  import { Grid, Navigation } from 'swiper/modules'
  import { Swiper, SwiperSlide } from 'swiper/vue'
  import { onMounted } from 'vue'
  import CardIndex from '~/components/ui/CardIndex.vue'
  import { useHotProducts } from '~/composables/useHotProducts'
  const { hotProducts, ensureHotProducts } = useHotProducts()

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
    // Load hot products
    ensureHotProducts(true)
  })
</script>

<style scoped>
  .hero-screen {
    /* Chiều cao toàn màn hình trừ phần header (dùng dvh để tránh thanh trình duyệt di động) */
    min-height: calc(100dvh - var(--header-h, 64px));
  }
</style>
