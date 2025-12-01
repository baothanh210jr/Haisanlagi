<template>
  <section
    id="home"
    class="bg-gradient-to-br from-[#053C5E] via-[#1B98E0] to-[#F2C14E33] relative pt-10 pb-12 md:pt-20 md:pb-24 flex items-center overflow-hidden"
  >
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div class="space-y-6 text-center md:text-left">
          <span
            class="inline-block py-1 px-3 rounded-full bg-yellow-500 text-white text-sm font-bold tracking-wide uppercase"
            >Tươi ngon - Sạch sẽ - An toàn</span
          >
          <h1 class="text-4xl md:text-6xl font-bold text-white leading-tight">
            Hải Sản Tươi Sống <br />
            <span class="text-black">Tươi Ngon Từ Nguồn</span>
          </h1>
          <p class="text-lg text-white md:pr-10">
            Chúng tôi cung cấp các loại hải sản cao cấp được đánh bắt trực tiếp từ biển, đảm bảo độ
            tươi ngon và chất lượng tuyệt hảo cho bữa ăn gia đình bạn.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <a
              href="#products"
              class="px-8 py-4 rounded-full bg-blue-600 text-white font-bold text-lg shadow-lg hover:bg-blue-700 transition transform group hover-move-down flex items-center justify-center"
            >
              Đặt Hàng Ngay
              <Icon icon="el:hand-down" class="ml-2 h-5 w-5 move-down-icon" />
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
          <div
            class="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          />
          <div
            class="absolute top-0 right-40 w-80 h-80 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          />

          <img
            src="https://plus.unsplash.com/premium_photo-1757672144355-6660416a2a37?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&w=800&q=80"
            alt="Seafood Platter"
            class="relative w-full rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition duration-500 border-4 border-white"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
</script>

<style>
  .hero-screen {
    max-height: calc(100vh - var(--header-h));
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
</style>
