<template>
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
</template>

<script lang="ts" setup>
import type { ProductItem } from '~/types/Product';

// Search functionality
const searchQuery = ref('');
const searchOpen = ref(false);
const searchResults = ref<ProductItem[]>([]);
const searchLoading = ref(false);
const searchError = ref('');
const searchInputRef = ref<HTMLInputElement | null>(null);
const recentSearches = ref<string[]>([]);

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
</script>

<style lang="scss" scoped></style>
