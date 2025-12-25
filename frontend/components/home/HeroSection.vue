<template>
  <section
    id="home"
    class="bg-gradient-to-br from-[#053C5E] via-[#1B98E0] to-[#F2C14E33] relative pt-10 pb-12 md:pt-20 md:pb-24 flex items-start md:items-center overflow-hidden hero-screen relative"
  >
    <div class="container relative z-10">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
        <div
          class="flex flex-col gap-5 md:gap-0 items-center md:items-start space-y-5 md:space-y-6 lg:text-left"
        >
          <span
            class="inline-block p-2 rounded-full bg-primary text-secondary text-[10px] font-bold tracking-wide uppercase border border-secondary order-2 md:order-1 w-fit"
            >Nhập từ cảng mỗi sáng – Không hàng đông lạnh</span
          >
          <h1
            style="text-shadow: 0 0 12px rgba(248, 117, 10, 0.952)"
            class="text-3xl md:text-5xl font-bold text-white !leading-[1.4] order-1 md:order-2"
          >
            Hải Sản Tươi Sống <br />
            <span class="">Tươi Ngon Từ Nguồn</span>
          </h1>

          <div
            class="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-10 order-3"
          >
            <a
              href="#products"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-secondary text-white font-semibold text-lg shadow-lg hover:bg-secondary/90 transition transform group hover-move-down flex items-center justify-center rounded-lg"
            >
              Đặt Hàng Ngay
              <Icon icon="el:hand-down" class="ml-2 h-5 w-5 move-down-icon" />
            </a>
            <a
              href="#contact"
              class="px-6 sm:px-8 py-3 sm:py-4 bg-transparent text-white border-2 border-white font-semibold text-lg hover:bg-black/90 hover:text-white transition flex items-center justify-center rounded-lg"
            >
              Liên Hệ Tư Vấn
            </a>
          </div>
        </div>
      </div>
    </div>
    <div class="flex absolute inset-0 h-full">
      <div class="flex-1 w-full h-full">
        <picture>
          <!-- Mobile -->
          <source media="(max-width: 768px)" srcset="/assets/images/bg-hero-mobile.png" />

          <!-- Desktop -->
          <source media="(min-width: 769px)" srcset="/assets/images/bg-hero.png" />

          <!-- Fallback -->
          <img
            src=""
            alt="Hải sản tươi sống Làng Chài 86"
            class="w-full h-full object-cover"
            loading="eager"
          />
        </picture>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
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
    height: auto;
  }
}
</style>
