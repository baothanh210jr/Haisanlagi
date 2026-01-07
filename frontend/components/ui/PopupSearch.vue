<template>
  <div
    v-if="searchOpen"
    class="fixed inset-0 z-[70] bg-[#0a1c2d]/75 backdrop-blur-sm flex items-start justify-center px-4 pb-10 pt-24"
    @click.self="closeSearchPalette"
  >
    <div
      class="w-full inset-0 transform translate-y-40 absolute flex items-start justify-center"
      @click.self="closeSearchPalette"
    >
      <div
        class="w-full max-w-xl lg:max-w-4xl overflow-hidden rounded-xl bg-theme-surface text-theme-primary shadow-2xl ring-1 border-theme"
        style="
          box-shadow:
            0 20px 25px -5px rgba(31, 166, 184, 0.15),
            0 10px 10px -5px rgba(31, 166, 184, 0.1);
        "
      >
        <div class="flex items-center gap-3 border-b border-theme px-6 py-4 bg-theme-subtle/50">
          <span
            class="flex h-8 w-8 items-center justify-center rounded-full dark:bg-white/10 bg-black/50 text-white"
          >
            <Icon
              v-if="!searchLoading"
              icon="mdi:magnify"
              class="h-4 w-4"
            />
            <span
              v-else
              class="h-4 w-4 animate-spin rounded-full border-2 border-white/80"
              style="border-top-color: var(--theme-secondary); border-right-color: transparent; border-bottom-color: transparent; border-left-color: transparent;"
            />
          </span>
          <input
            ref="searchInputRef"
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm sản phẩm"
            class="flex-1 border-none bg-transparent text-base outline-none text-theme-primary"
            style="color: var(--theme-text)"
            :style="{ '--placeholder-color': 'var(--theme-muted)' }"
            @input="onSearchInput"
            @keydown.enter.prevent="handleSearchEnter"
            @keydown.escape.prevent="closeSearchPalette"
          >
          <button
            v-if="searchQuery.length"
            type="button"
            class="rounded-full p-1.5 transition-all hover:bg-theme-subtle"
            style="color: var(--theme-muted)"
            @click="clearSearch"
          >
            <Icon
              icon="mdi:close"
              class="h-4 w-4"
            />
          </button>
        </div>

        <div class="max-h-[70vh] overflow-y-auto">
          <div
            v-if="searchError"
            class="px-6 py-10 text-center text-sm text-red-500"
          >
            {{ searchError }}
          </div>

          <template v-else-if="searchQuery && !searchLoading && searchResults.length">
            <p class="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-theme-muted">
              Kết quả phù hợp
            </p>
            <ul
              class="divide-y px-2 pb-4"
              style="border-color: var(--theme-border)"
            >
              <li
                v-for="item in searchResults"
                :key="item.id"
              >
                <NuxtLink
                  :to="{ name: 'product-slug', params: { slug: item.slug || ' ' } }"
                  class="group relative flex items-center gap-4 rounded-xl px-4 py-4 transition-all hover:bg-gradient-to-r hover:from-theme-subtle/80 hover:to-theme-surface hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-theme-border/50"
                  @click="handleResultClick"
                >
                  <div
                    class="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-theme-border shadow-sm group-hover:ring-2 group-hover:ring-[var(--theme-secondary)]/30 transition-all"
                  >
                    <img
                      :src="formatImage(item, { width: 200, height: 150 })"
                      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    >
                    <div
                      v-if="item?.variants && item.variants.length > 1"
                      class="absolute top-1.5 right-1.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg"
                    >
                      {{ item.variants.length }} lựa chọn
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p class="font-bold text-base line-clamp-2 text-theme-primary group-hover:text-[var(--theme-secondary)] transition-colors">
                        {{ item.name }}
                      </p>
                      <Icon
                        icon="mdi:arrow-right-circle"
                        class="h-5 w-5 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 flex-shrink-0"
                      />
                    </div>
                    <p class="text-xs text-theme-muted line-clamp-1 mb-2">
                      {{ item.description || 'Hải sản tươi ngon từ Lagi' }}
                    </p>
                    <div class="flex items-center gap-2">
                      <p class="text-lg font-bold color-price">
                        {{ formatPrice(item?.variants?.[0]?.price || 0) }}
                      </p>
                      <p
                        v-if="item?.variants?.[0]?.original_price && item.variants[0].original_price > item.variants[0].price"
                        class="text-xs text-theme-muted line-through"
                      >
                        {{ formatPrice(item.variants[0].original_price) }}
                      </p>
                    </div>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </template>

          <div
            v-else-if="searchQuery && !searchLoading && !searchResults.length && hasSearched"
            class="px-6 py-10 text-center text-sm text-theme-muted"
          >
            Không tìm thấy sản phẩm nào phù hợp với từ khóa "{{ searchQuery }}".
          </div>

          <!-- 👇 Khi chưa gõ gì: show 5 sản phẩm mặc định -->
          <template v-else-if="!searchQuery">
            <p class="px-6 pt-4 text-xs font-semibold uppercase tracking-wide text-theme-muted">
              Sản phẩm nổi bật
            </p>

            <ul class="px-2 pb-4 mt-2">
              <li
                v-for="item in defaultProducts"
                :key="item.id"
              >
                <NuxtLink
                  :to="{ name: 'product-slug', params: { slug: item.slug || ' ' } }"
                  class="group relative flex items-center gap-4 rounded-xl px-4 py-4 transition-all hover:bg-gradient-to-r hover:from-theme-subtle/80 hover:to-theme-surface hover:shadow-md hover:-translate-y-0.5 border border-transparent hover:border-theme-border/50"
                  @click="handleResultClick"
                >
                  <div
                    class="relative h-20 w-24 flex-shrink-0 overflow-hidden rounded-xl ring-1 ring-theme-border shadow-sm group-hover:ring-2 group-hover:ring-[var(--theme-secondary)]/30 transition-all"
                  >
                    <img
                      :src="formatImage(item, { width: 200, height: 150 })"
                      class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    >
                    <div
                      v-if="item?.variants && item.variants.length > 1"
                      class="absolute top-1.5 right-1.5 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-bold text-white shadow-lg"
                    >
                      {{ item.variants.length }} lựa chọn
                    </div>
                  </div>

                  <div class="flex-1 min-w-0">
                    <div class="flex items-start justify-between gap-2 mb-1">
                      <p class="font-bold text-base line-clamp-2 text-theme-primary group-hover:text-[var(--theme-secondary)] transition-colors">
                        {{ item.name }}
                      </p>
                      <Icon
                        icon="mdi:arrow-right-circle"
                        class="h-5 w-5 text-theme-muted opacity-0 group-hover:opacity-100 transition-all transform group-hover:translate-x-1 flex-shrink-0"
                      />
                    </div>
                    <p class="text-xs text-theme-muted line-clamp-1 mb-2">
                      {{ item.description || 'Hải sản tươi ngon từ Lagi' }}
                    </p>
                    <div class="flex items-center gap-2">
                      <p class="text-lg font-bold color-price">
                        {{ formatPrice(item?.variants?.[0]?.price || 0) }}
                      </p>
                      <p
                        v-if="item?.variants?.[0]?.original_price && item.variants[0].original_price > item.variants[0].price"
                        class="text-xs text-theme-muted line-through"
                      >
                        {{ formatPrice(item.variants[0].original_price) }}
                      </p>
                    </div>
                  </div>
                </NuxtLink>
              </li>
            </ul>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { Icon } from '@iconify/vue';
import { useHotProducts } from '~/composables/useHotProducts';
import type { ProductItem } from '~/types/Product';
import { formatImage } from '~/utils/formatImage';
import { formatPrice } from '~/utils/formatPrice';

const { hotProducts, ensureHotProducts } = useHotProducts();

// Search functionality
const searchQuery = ref('');
const searchOpen = ref(false);
const searchResults = ref<ProductItem[]>([]);
const searchLoading = ref(false);
const searchError = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const recentSearches = ref<string[]>([]);
const hasSearched = ref(false); // Track if search has completed

const defaultProducts = computed<ProductItem[]>(() => {
  return hotProducts.value.slice(0, 5);
});

let searchController: AbortController | null = null;

const previousBodyOverflow = ref('');
const RECENT_KEY = 'haisanlagi_recent_searches';
let searchDebounce: ReturnType<typeof setTimeout> | null = null;

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
  hasSearched.value = false;
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
    hasSearched.value = false;
    return;
  }
  if (searchController) {
    searchController.abort();
  }
  const controller = new AbortController();
  searchController = controller;
  searchLoading.value = true;
  searchError.value = '';
  hasSearched.value = false; // Reset khi bắt đầu search mới

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
    // Đánh dấu đã search xong khi thành công
    if (!controller.signal.aborted) {
      hasSearched.value = true;
    }
  } catch (err: any) {
    if (err?.name === 'AbortError') {
      // Không set hasSearched khi bị abort
      return;
    }
    searchError.value = 'Không thể tải kết quả. Vui lòng thử lại.';
    searchResults.value = [];
    // Đánh dấu đã search xong khi có lỗi (nhưng không phải abort)
    hasSearched.value = true;
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

function clearSearch() {
  searchQuery.value = '';
  searchResults.value = [];
  searchError.value = '';
  searchLoading.value = false;
  hasSearched.value = false;
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

// Initialize hot products on mount
onMounted(() => {
  ensureHotProducts();
  if (typeof window !== 'undefined') {
    try {
      const saved = localStorage.getItem(RECENT_KEY);
      if (saved) recentSearches.value = JSON.parse(saved);
    } catch {
      // Ignore localStorage errors
    }
    window.addEventListener('keydown', shortcutHandler);
  }
});

onUnmounted(() => {
  if (typeof window !== 'undefined') {
    window.removeEventListener('keydown', shortcutHandler);
  }
});

watch(
  recentSearches,
  (val) => {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(RECENT_KEY, JSON.stringify(val));
    } catch {
      // Ignore localStorage errors
    }
  },
  { deep: true }
);

watch(searchOpen, (open) => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  if (open) {
    previousBodyOverflow.value = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    ensureHotProducts();
  } else {
    document.body.style.overflow = previousBodyOverflow.value || '';
  }
});

// Expose functions for parent components
defineExpose({
  openSearchPalette,
  closeSearchPalette
});
</script>

<style lang="scss" scoped>
input::placeholder {
  color: var(--theme-muted);
  opacity: 0.7;
}
</style>
