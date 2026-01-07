<template>
  <section
    id="home"
    class="bg-gradient-to-br from-[#053C5E] via-[#1B98E0] to-[#F2C14E33] relative pt-10 pb-12 md:pt-20 md:pb-24 flex items-start md:items-center overflow-hidden h-[50vh] md:h-[80vh] max-h-[800px] relative"
  >
    <div class="absolute inset-0 bg-black/50 z-10" />
    <div class="container relative z-10 h-full">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center h-full">
        <div
          class="flex flex-col items-start justify-center space-y-5 md:space-y-6 lg:text-left h-full"
        >
          <h1
            style="text-shadow: 0 0 12px rgba(248, 117, 10, 0.952)"
            class="text-4xl md:text-5xl font-bold text-white !leading-[1.4] text-left md:text-left"
          >
            Hải Sản Tươi Sống <br />

            <span class="typing-text">
              {{ displayText }}
              <span class="typing-cursor" />
            </span>
          </h1>

          <div class="flex gap-5 sm:gap-4 justify-center lg:justify-start pt-10 order-3">
            <a
              href="#products"
              class="px-4 sm:px-8 py-3 sm:py-4 bg-secondary text-white font-semibold text-sm md:text-lg shadow-lg hover:bg-orange-600 transition transform group hover-move-down flex items-center justify-center rounded-lg"
            >
              Đặt Hàng Ngay
              <Icon icon="el:hand-down" class="ml-2 h-5 w-5 move-down-icon" />
            </a>
            <a
              href="#contact"
              class="px-4 sm:px-8 py-3 sm:py-4 bg-transparent border-2 border-white font-semibold md:text-lg hover:bg-black/90 hover:text-white transition flex items-center justify-center rounded-lg bg-white text-black"
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
import { onMounted, ref } from 'vue';

const texts = ['Tươi ngon từ nguồn', 'Cập bến mỗi ngày'];

const displayText = ref('');
let textIndex = 0;
let charIndex = 0;
let isDeleting = false;

const typingSpeed = 70;
const deletingSpeed = 40;
const holdAfterType = 3000;

function loop() {
  const current = texts[textIndex] ?? '';

  if (!isDeleting) {
    displayText.value = current.slice(0, charIndex + 1);
    charIndex++;

    if (charIndex === current.length) {
      setTimeout(() => {
        isDeleting = true;
      }, holdAfterType);
    }
  } else {
    displayText.value = current.slice(0, charIndex - 1);
    charIndex--;

    if (charIndex === 0) {
      isDeleting = false;
      textIndex = (textIndex + 1) % texts.length;
    }
  }

  setTimeout(loop, isDeleting ? deletingSpeed : typingSpeed);
}

onMounted(loop);
</script>

<style>
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

@media (min-width: 2200px) {
  .hero-screen {
    height: auto;
  }
}
.typing-text {
  display: inline;
  position: relative;
  white-space: pre-wrap;
}

.typing-cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  background: #fff;
  margin-left: 4px;
  vertical-align: -0.1em; /* KEY: kéo cursor xuống dòng cuối */
  animation: blink 1s infinite;
}

@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
