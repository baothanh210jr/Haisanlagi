<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-50 transition-all duration-300 ease-out will-change-transform flex items-center backdrop-blur shadow-md text-theme-primary dark:text-white border-b py-2"
    :class="[showHeader ? 'translate-y-0' : '-translate-y-full', headerTone]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="container flex items-center justify-between gap-5">
      <NuxtLink to="/" class="flex items-center gap-3 flex-shrink-0">
        <div class="w-auto max-w-[150px] h-10">
          <img src="/logo-1.png" alt="Haisan Lagi" class="h-10 w-full object-contain" />
        </div>
      </NuxtLink>

      <!-- Search bar - chỉ hiển thị trên desktop -->
      <div class="hidden lg:flex flex-1 mx-4">
        <button
          type="button"
          class="w-full flex items-center gap-3 rounded-xl px-4 py-2 text-left shadow-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-white/50 bg-theme-surface dark:bg-[rgba(9,16,31,0.9)] border border-primary dark:border-white/10 dark:border-theme"
          @click="openSearchPalette"
        >
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full dark:bg-white/10 bg-black/50 text-white"
          >
            <Icon icon="mdi:magnify" class="h-4 w-4" />
          </span>
          <div class="flex flex-1 flex-col">
            <span class="text-sm dark:text-white">Tìm kiếm sản phẩm</span>
            <span class="text-xs text-primary-200">Nhấn / hoặc Ctrl + K để mở nhanh</span>
          </div>
        </button>
      </div>
      <div
        class="flex items-center justify-end gap-5 md:gap-8 w-fit px-5 py-1 md:py-2 border-2 border-secondary dark:bg-transparent rounded-[40px]"
      >
        <!-- Search icon - chỉ hiển thị trên mobile -->
        <button
          type="button"
          class="lg:hidden flex items-center justify-center rounded-full bg-secondary dark:bg-white text-white dark:text-black w-8 h-8 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-white/50"
          @click="openSearchPalette"
        >
          <Icon icon="mdi:magnify" class="text-xl" />
        </button>

        <!-- Hotline -->
        <div class="hidden md:flex items-center gap-4">
          <div
            class="w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full bg-secondary dark:bg-white text-white dark:text-black"
          >
            <Icon icon="material-symbols:call" class="text-sm md:text-xl" />
          </div>
          <div>
            <span class="text-primary dark:text-white text-sm md:text-md font-medium"
              >0367497642</span
            >
          </div>
        </div>

        <!-- Cart -->
        <NuxtLink
          :to="{
            name: 'cart'
          }"
          class="relative flex items-center gap-2 sm:gap-4"
        >
          <div
            class="w-8 h-8 relative rounded-full bg-secondary dark:bg-primary text-white dark:text-black flex items-center justify-center"
          >
            <Icon icon="famicons:cart-outline" class="text-xl" />
            <span
              v-if="cartCount > 0"
              class="absolute -top-1.5 md:-top-1 -right-2.5 md:-right-1.5 bg-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white"
              >{{ cartCount }}</span
            >
          </div>
          <span class="text-md font-medium hidden sm:inline">Giỏ hàng</span>
        </NuxtLink>
        <ThemeSwitch />
      </div>
    </div>
  </header>

  <PopupSearch ref="popupSearchRef" />
</template>

<script setup lang="ts">
import { useState } from '#app';
import { Icon } from '@iconify/vue';
import { computed, nextTick, onMounted, onUnmounted, ref } from 'vue';
import PopupSearch from '~/components/ui/PopupSearch.vue';
import { useCart } from '~/composables/useCart';
import { useTheme } from '~/composables/useTheme';

const { items } = useCart();
const cartCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0));

// PopupSearch ref
const popupSearchRef = ref<InstanceType<typeof PopupSearch> | null>(null);

// Categories dropdown state
const categoryBtnRef = ref<HTMLElement | null>(null);
const catPanelWidth = ref<number>(280);

const catBtnWidthState = useState<number>('category_btn_width', () => 280);
const { theme } = useTheme();
const headerTone = computed(() =>
  theme.value === 'light'
    ? 'bg-theme-surface border-theme'
    : 'bg-[rgba(7,16,36,0.82)] border-white/10'
);

// Scroll-based header behavior
const headerRef = ref<HTMLElement | null>(null);
const showHeader = ref(true);
const atTop = ref(true);
const hovering = ref(false);

const shortcutHandler = (event: KeyboardEvent) => {
  const tag = (event.target as HTMLElement | null)?.tagName?.toLowerCase();
  const isEditable =
    (event.target as HTMLElement | null)?.isContentEditable ||
    ['input', 'textarea', 'select'].includes(tag || '');
  if (event.key === '/' && !event.metaKey && !event.ctrlKey && !event.altKey) {
    if (isEditable) return;
    event.preventDefault();
    openSearchPalette();
  }
  if (event.key.toLowerCase() === 'k' && (event.metaKey || event.ctrlKey)) {
    event.preventDefault();
    openSearchPalette();
  }
};

let lastY = 0;
let idleTimer: any = null;
let threshold = 56; // default, will be updated after mount

function onScroll() {
  const y = window.scrollY || 0;
  atTop.value = y <= 2;

  // When passing header height, make sure header is shown with a smooth drop
  if (y > threshold && !showHeader.value) {
    showHeader.value = true;
  }

  // Always show while scrolling, then auto-hide when idle
  showHeader.value = true;

  // Reset idle timer; hide header if user stops scrolling for a moment
  if (idleTimer) clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    // Only hide if scrolled past the threshold; keep visible at top
    if (window.scrollY > threshold && !hovering.value) {
      showHeader.value = false;
    }
  }, 800);

  lastY = y;
}

onMounted(() => {
  // Measure header height for threshold
  const h = headerRef.value?.offsetHeight || 0;
  threshold = Math.max(56, h);
  lastY = window.scrollY || 0;
  atTop.value = lastY <= 2;
  window.addEventListener('scroll', onScroll, { passive: true });
  nextTick(() => {
    onScroll();
    // Ensure categories loaded and measure button width
    const w = categoryBtnRef.value?.offsetWidth || 0;
    if (w > 0) {
      catPanelWidth.value = w;
      catBtnWidthState.value = w;
    }
  });
  window.addEventListener('resize', () => {
    const w = categoryBtnRef.value?.offsetWidth || 0;
    if (w > 0) {
      catPanelWidth.value = w;
      catBtnWidthState.value = w;
    }
  });
  if (typeof window !== 'undefined') {
    document.addEventListener('keydown', shortcutHandler);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (idleTimer) clearTimeout(idleTimer);
  if (typeof window !== 'undefined') {
    document.removeEventListener('keydown', shortcutHandler);
  }
});

function onMouseEnter() {
  hovering.value = true;
  showHeader.value = true;
  if (idleTimer) clearTimeout(idleTimer);
}

function onMouseLeave() {
  hovering.value = false;
  // If user is scrolled down and not moving, hide after a small delay
  if (window.scrollY > threshold) {
    if (idleTimer) clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      if (!hovering.value) showHeader.value = false;
    }, 500);
  }
}

function openSearchPalette() {
  popupSearchRef.value?.openSearchPalette();
}
</script>

<style scoped>
/* Improve performance for transform animations */
header {
  backface-visibility: hidden;
  height: var(--header-h);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
