<template>
  <section
    id="home"
    class="bg-gradient-to-br from-[#053C5E] via-[#1B98E0] to-[#F2C14E33] relative pt-10 pb-12 md:pt-20 md:pb-24 flex items-center overflow-hidden hero-screen"
  >
    <div class="container relative z-10 ">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div class="space-y-5 md:space-y-6 text-center lg:text-left">
          <span
            class="inline-block py-1 px-3 xl:py-3 xl:px-5 rounded-full bg-yellow-500 text-white text-sm font-bold tracking-wide uppercase"
          >Tươi ngon - Sạch sẽ - An toàn</span>
          <h1 class="text-4xl md:text-6xl 2xl:text-8xl font-bold text-white leading-tight">
            Hải Sản Tươi Sống <br>
            <span class="">Tươi Ngon Từ Nguồn</span>
          </h1>
          <p class="text-base sm:text-lg 2xl:text-2xl text-white/80 md:pr-10">
            Chúng tôi cung cấp các loại hải sản cao cấp được đánh bắt trực tiếp từ biển, đảm bảo tươi
            ngon và chất lượng tuyệt hảo cho bữa ăn gia đình bạn.
          </p>
          <div class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
            <a
              href="#products"
              class="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition transform group hover-move-down flex items-center justify-center"
            >
              Đặt Hàng Ngay
              <Icon
                icon="el:hand-down"
                class="ml-2 h-5 w-5 move-down-icon"
              />
            </a>
            <a
              href="#contact"
              class="px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-white text-blue-600 border-2 border-blue-600 font-bold text-lg hover:bg-blue-50 transition flex items-center justify-center"
            >
              Liên Hệ Tư Vấn
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="w-1/2 hidden lg:flex absolute right-0 top-0 h-full ">
      <div class="flex-1 w-full h-full">
        <img
          src="/section-04.png"
          alt="Seafood Platter"
          class="relative w-full h-full object-center"
        >
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
</script>

<style>
  .hero-screen {
    height: calc(85vh - var(--header-h));
  }

  .hover-move-down:hover .move-down-icon {
    animation: move-down-return 0.7s ease-in infinite;
  }

  @keyframes move-down-return {
    0% {
      transform: translateY(0);
    }
    50% {
      transform: translateY(1rem);
    }
    100% {
      transform: translateY(0);
    }
  }
  
  @media (min-width: 2600px) {
    .hero-screen {
      height: auto
    }
  }

  
</style>
