<template>
  <div>
    <!-- Hero Section -->
    <section
      id="home"
      class="relative pt-10 pb-12 md:pt-20 md:pb-24 flex items-center hero-screen overflow-hidden"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6 text-center md:text-left">
            <span
              class="inline-block py-1 px-3 rounded-full bg-blue-100 text-blue-600 text-sm font-semibold tracking-wide uppercase"
              >Tươi ngon - Sạch sẽ - An toàn</span
            >
            <h1 class="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
              Hải Sản Tươi Sống <br />
              <span class="text-blue-600">Tươi Ngon Từ Nguồn</span>
            </h1>
            <p class="text-lg text-gray-600 md:pr-10">
              Chúng tôi cung cấp các loại hải sản cao cấp được đánh bắt trực tiếp từ biển, đảm bảo
              độ tươi ngon và chất lượng tuyệt hảo cho bữa ăn gia đình bạn.
            </p>
            <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <a
                href="#products"
                class="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1 flex items-center justify-center"
              >
                Đặt Hàng Ngay <i data-lucide="arrow-right" class="ml-2 h-5 w-5" />
              </a>
              <a
                href="#contact"
                class="px-8 py-4 rounded-full bg-white text-blue-600 border-2 border-blue-600 font-bold text-lg hover:bg-blue-50 transition flex items-center justify-center"
              >
                Liên Hệ Tư Vấn
              </a>
            </div>
          </div>
          <div class="relative hidden md:block">
            <!-- Decorative Blob -->
            <div
              class="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
            />
            <div
              class="absolute top-0 right-40 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
            />

            <img
              src="https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
              alt="Seafood Platter"
              class="relative w-full rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 border-4 border-white"
            />
          </div>
        </div>
      </div>
    </section>

    <!-- Hot Products Grid -->
    <section class="pt-10">
      <div class="container mx-auto px-6">
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
            class="products-swiper !py-10"
          >
            <SwiperSlide v-for="(product, index) in hotProducts" :key="index">
              <ProductCard :product="product as any" />
            </SwiperSlide>
          </Swiper>
        </ClientOnly>
      </div>
    </section>
    <pre>{{ feedback }}</pre>
    <section id="testimonials" class="py-8">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Ý kiến của khách hàng</h2>
        <div class="grid md:grid-cols-3 gap-8">
          <div class="bg-gray-50 p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
              >
                J
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">John Smith</h4>
                <p class="text-gray-600 text-sm">Chef</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"Chất lượng tuyệt vời, hải sản luôn tươi ngon."</p>
          </div>
          <div class="bg-gray-50 p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold"
              >
                M
              </div>
              <div class="ml-4">
                <h4 class="font-semibold text-gray-800">Maria Garcia</h4>
                <p class="text-gray-600 text-sm">Home Cook</p>
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
                <h4 class="font-semibold text-gray-800">David Chen</h4>
                <p class="text-gray-600 text-sm">Restaurant Owner</p>
              </div>
            </div>
            <p class="text-gray-600 italic">"Nhà cung cấp tin cậy, rất phù hợp cho nhà hàng."</p>
          </div>
        </div>
      </div>
    </section>
    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <h2 class="text-3xl font-bold text-gray-900 mb-4">Liên Hệ Tư Vấn</h2>
            <p class="text-gray-600 mb-8">
              Để lại thông tin để chúng tôi tư vấn loại hải sản phù hợp nhất cho bữa tiệc của bạn.
            </p>

            <div class="space-y-6">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center"
                  >
                    <Icon icon="mdi:map-marker-outline" class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-bold text-gray-900">Địa chỉ cửa hàng</h3>
                  <p class="text-gray-600">123 Đường Biển Xanh, Quận Sơn Trà, TP. Đà Nẵng</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div class="flex-shrink-0">
                    <div
                      class="w-10 h-10 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center"
                    >
                      <Icon icon="ic:baseline-phone" class="h-6 w-6" />
                    </div>
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-bold text-gray-900">Hotline tư vấn</h3>
                  <p class="text-gray-600">0905.123.456 (Zalo/Viber)</p>
                </div>
              </div>
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <div
                    class="w-10 h-10 bg-blue-100 rounded-full text-blue-600 flex items-center justify-center"
                  >
                    <Icon icon="material-symbols:mail-outline" class="h-6 w-6" />
                  </div>
                </div>
                <div class="ml-4">
                  <h3 class="text-lg font-bold text-gray-900">Email</h3>
                  <p class="text-gray-600">lienhe@daiduongfresh.vn</p>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 p-8 rounded-2xl shadow-lg">
            <form
              onsubmit="event.preventDefault(); alert('Cảm ơn bạn đã để lại thông tin! Chúng tôi sẽ liên hệ sớm.');"
            >
              <div class="mb-6">
                <label class="block text-gray-700 font-bold mb-2" for="name">Họ và tên</label>
                <input
                  id="name"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  type="text"
                  placeholder="Nguyễn Văn A"
                  required
                />
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 font-bold mb-2" for="phone">Số điện thoại</label>
                <input
                  id="phone"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition"
                  type="tel"
                  placeholder="0905xxxxxx"
                  required
                />
              </div>
              <div class="mb-6">
                <label class="block text-gray-700 font-bold mb-2" for="message"
                  >Nội dung cần tư vấn</label
                >
                <textarea
                  id="message"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 transition h-32"
                  placeholder="Tôi muốn đặt 2kg tôm hùm..."
                />
              </div>
              <button
                class="w-full bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
              >
                Gửi Thông Tin
              </button>
            </form>
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
  import { useFeedback } from '~/composables/useFeedback'
  import { useHomeProducts } from '~/composables/useHomeProducts'
  import { useHomeSlides } from '~/composables/useHomeSlides'
  import { useHotProducts } from '~/composables/useHotProducts'

  const { hotProducts, ensureHotProducts } = useHotProducts()
  const { heroProducts, ensureSlides } = useHomeSlides(5)
  const { feedback, ensureFeedback } = useFeedback()
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
    ensureCategories()
    ensureSlides()
    ensureProducts()
    ensureHotProducts()
    ensureFeedback()
  })
</script>

<style>
  .hero-screen {
    /* Chiều cao toàn màn hình trừ phần header (dùng dvh để tránh thanh trình duyệt di động) */
    max-height: calc(100vh - var(--header-h));
  }
</style>
