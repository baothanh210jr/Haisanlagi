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
        <div class="w-auto h-10">
          <img src="/logo-1.png" alt="Haisan Lagi" class="h-10 w-full object-cover" />
        </div>
      </NuxtLink>

      <!-- Search bar -->
      <div class="hidden lg:flex-1 mx-4">
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
          <div class="hidden lg:flex flex-1 flex-col">
            <span class="text-sm dark:text-white">Tìm kiếm sản phẩm</span>
            <span class="text-xs text-primary-200">Nhấn / hoặc Ctrl + K để mở nhanh</span>
          </div>
        </button>
      </div>
      <div
        class="flex items-center justify-end gap-5 md:gap-8 w-fit px-5 py-1 md:py-2 border-2 border-secondary dark:bg-transparent rounded-[40px] dark:border-none"
      >
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
        <div class="flex items-center gap-2 sm:gap-4">
          <NuxtLink
            :to="{
              name: 'cart'
            }"
            class="relative"
          >
            <div
              class="w-8 h-8 relative rounded-full bg-primary text-white bg-secondary dark:bg-white dark:text-primary flex items-center justify-center"
            >
              <Icon icon="famicons:cart-outline" class="text-xl" />
              <span
                v-if="cartCount > 0"
                class="absolute -top-1.5 md:-top-1 -right-2.5 md:-right-1.5 bg-red-500 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center text-white"
                >{{ cartCount }}</span
              >
            </div>
          </NuxtLink>
          <span class="text-md font-medium hidden sm:inline">Giỏ hàng</span>
        </div>
        <ThemeSwitch />
      </div>
    </div>
  </header>

  <Teleport to="body">
    <transition name="fade">
      <div
        v-if="searchOpen"
        class="fixed inset-0 z-[70] bg-black/65 flex items-start justify-center px-4 pb-10 pt-24"
        @click.self="closeSearchPalette"
      >
        <div
          class="w-full inset-0 transform translate-y-40 absolute flex items-start justify-center"
          @click.self="closeSearchPalette"
        >
          <div
            class="w-full max-w-xl lg:max-w-4xl overflow-hidden rounded-lg bg-white text-primary shadow-2xl ring-1 ring-black/10"
          >
            <div class="flex items-center gap-3 border-b border-primary-200 px-6 py-4">
              <Icon icon="mdi:magnify" class="h-5 w-5 text-gray-400" />
              <input
                ref="searchInputRef"
                v-model="searchQuery"
                type="text"
                placeholder="Tìm kiếm sản phẩm"
                class="flex-1 border-none bg-transparent text-base outline-none placeholder:text-gray-300"
                @input="onSearchInput"
                @keydown.enter.prevent="handleSearchEnter"
                @keydown.escape.prevent="closeSearchPalette"
              />
              <button
                v-if="searchQuery.length"
                type="button"
                class="text-gray-400 hover:text-gray-600 bg-gray-100 rounded-full p-1 transition"
                @click="clearSearch"
              >
                <Icon icon="mdi:close" class="h-5 w-5" />
              </button>
            </div>

            <div class="max-h-[70vh] overflow-y-auto">
              <div v-if="searchError" class="px-6 py-10 text-center text-sm text-red-500">
                {{ searchError }}
              </div>

              <div
                v-else-if="searchQuery && searchLoading"
                class="flex items-center gap-3 px-6 py-8 text-sm text-gray-500"
              >
                <span
                  class="h-4 w-4 animate-spin rounded-full border border-gray-300 border-t-transparent"
                />
                Đang tìm kiếm sản phẩm...
              </div>

              <template v-else-if="searchQuery && searchResults.length">
                <p class="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Kết quả phù hợp
                </p>
                <ul class="divide-y px-2 pb-4">
                  <li v-for="item in searchResults" :key="item.id">
                    <NuxtLink
                      :to="{ name: 'product-slug', params: { slug: item.slug || ' ' } }"
                      class="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-white/5"
                      @click="handleResultClick"
                    >
                      <div class="h-14 w-20 flex-shrink-0 overflow-hidden">
                        <img
                          :src="formatImage(item, { width: 160, height: 120 })"
                          class="h-full w-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="font-semibold line-clamp-2">
                          {{ item.name }}
                        </p>
                        <p class="text-sm text-gray-400 line-clamp-1">
                          {{ item.description || 'Hải sản tươi ngon từ Lagi' }}
                        </p>
                      </div>

                      <div class="text-right">
                        <p class="text-sm font-semibold">
                          {{ formatPrice(item?.variants?.[0]?.price || 0) }}
                        </p>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </template>

              <div
                v-else-if="searchQuery && !searchResults.length"
                class="px-6 py-10 text-center text-sm text-gray-500"
              >
                Không tìm thấy sản phẩm nào phù hợp với từ khóa "{{ searchQuery }}".
              </div>

              <!-- 👇 Khi chưa gõ gì: show 5 sản phẩm mặc định -->
              <template v-else>
                <p class="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-gray-400">
                  Sản phẩm nổi bật
                </p>

                <ul class="px-2 pb-4 mt-2">
                  <li v-for="item in defaultProducts" :key="item.id">
                    <NuxtLink
                      :to="{ name: 'product-slug', params: { slug: item.slug || ' ' } }"
                      class="flex items-center gap-4 rounded-2xl px-4 py-3 transition hover:bg-white/5"
                      @click="handleResultClick"
                    >
                      <div class="h-14 w-20 flex-shrink-0 overflow-hidden">
                        <img
                          :src="formatImage(item, { width: 160, height: 120 })"
                          class="h-full w-full object-cover"
                        />
                      </div>

                      <div class="flex-1">
                        <p class="font-semibold line-clamp-2">
                          {{ item.name }}
                        </p>
                        <p class="text-sm text-gray-400 line-clamp-1">
                          {{ item.description || 'Hải sản tươi ngon từ Lagi' }}
                        </p>
                      </div>

                      <div class="text-right">
                        <p class="text-sm font-semibold">
                          {{ formatPrice(item?.variants?.[0]?.price || 0) }}
                        </p>
                      </div>
                    </NuxtLink>
                  </li>
                </ul>
              </template>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </Teleport>
</template>

<script setup lang="ts">
import { useState } from '#app';
import { Icon } from '@iconify/vue';
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue';
import { useCart } from '~/composables/useCart';
import { useHotProducts } from '~/composables/useHotProducts';
import { useTheme } from '~/composables/useTheme';
import type { ProductItem } from '~/types/Product';

const { hotProducts, ensureHotProducts } = useHotProducts();

const { items } = useCart();
const cartCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0));

// Search functionality
const searchQuery = ref('');
const searchOpen = ref(false);
const searchResults = ref<ProductItem[]>([]);
const searchLoading = ref(false);
const searchError = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const recentSearches = ref<string[]>([]);

const defaultProducts = computed<ProductItem[]>(() => {
  console.log('🚀 ~ HeaderBar.vue:240 ~ hotProducts:', hotProducts.value);
  return hotProducts.value.slice(0, 5);
});
const previousBodyOverflow = ref('');
const RECENT_KEY = 'haisanlagi_recent_searches';
let searchDebounce: ReturnType<typeof setTimeout> | null = null;
let searchController: AbortController | null = null;

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
  if (event.key === 'Escape' && searchOpen.value) {
    event.preventDefault();
    closeSearchPalette();
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
  ensureHotProducts();
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
  if (process.client) {
    try {
      const stored = localStorage.getItem(RECENT_KEY);
      if (stored) {
        recentSearches.value = JSON.parse(stored) || [];
      }
    } catch {
      recentSearches.value = [];
    }
    document.addEventListener('keydown', shortcutHandler);
  }
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
  if (idleTimer) clearTimeout(idleTimer);
  if (process.client) {
    document.removeEventListener('keydown', shortcutHandler);
    document.body.style.overflow = previousBodyOverflow.value || '';
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
  searchOpen.value = true;
  nextTick(() => {
    searchInputRef.value?.focus();
    if (searchQuery.value.trim()) scheduleSearch(true);
  });
}

function closeSearchPalette() {
  searchOpen.value = false;
  searchLoading.value = false;
  searchError.value = '';
  if (searchController) {
    searchController.abort();
    searchController = null;
  }
}

function onSearchInput() {
  if (!searchOpen.value) return;
  scheduleSearch();
}

function scheduleSearch(immediate = false) {
  if (searchDebounce) clearTimeout(searchDebounce);
  if (immediate) {
    fetchSearchResults();
    return;
  }
  searchDebounce = setTimeout(fetchSearchResults, 350);
}

async function fetchSearchResults() {
  const term = searchQuery.value.trim();
  if (!term) {
    if (searchController) {
      searchController.abort();
      searchController = null;
    }
    searchResults.value = [];
    searchLoading.value = false;
    searchError.value = '';
    return;
  }
  if (searchController) {
    searchController.abort();
  }
  const controller = new AbortController();
  searchController = controller;
  searchLoading.value = true;
  searchError.value = '';

  try {
    const qs = new URLSearchParams();
    qs.set('search', term);
    qs.set('limit', '8');
    const res = await fetch(`/api/products?${qs.toString()}`, {
      signal: controller.signal
    });
    const json = await res.json();
    const list = Array.isArray(json?.data) ? (json.data as ProductItem[]) : [];
    searchResults.value = list;
  } catch (err: any) {
    if (err?.name === 'AbortError') return;
    searchError.value = 'Không thể tải kết quả. Vui lòng thử lại.';
    searchResults.value = [];
  } finally {
    if (searchController === controller) {
      searchController = null;
    }
    searchLoading.value = false;
  }
}

function rememberSearch(term: string) {
  const clean = term.trim();
  if (!clean) return;
  const next = [clean, ...recentSearches.value.filter((item) => item !== clean)].slice(0, 6);
  recentSearches.value = next;
}

function applySavedQuery(term: string) {
  searchQuery.value = term;
  rememberSearch(term);
  scheduleSearch(true);
  nextTick(() => searchInputRef.value?.focus());
}

function clearRecentSearches() {
  recentSearches.value = [];
}

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  searchError.value = '';
  searchLoading.value = false;
  if (searchController) {
    searchController.abort();
    searchController = null;
  }
  nextTick(() => searchInputRef.value?.focus());
}

function handleSearchEnter() {
  const term = searchQuery.value.trim();
  if (!term) return;
  rememberSearch(term);
  scheduleSearch(true);
}

function handleResultClick() {
  rememberSearch(searchQuery.value || '');
  closeSearchPalette();
}

watch(
  recentSearches,
  (val) => {
    if (!process.client) return;
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(val));
    } catch {}
  },
  { deep: true }
);

watch(searchOpen, (open) => {
  if (!process.client) return;
  if (open) {
    previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = previousBodyOverflow.value || '';
  }
});
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
