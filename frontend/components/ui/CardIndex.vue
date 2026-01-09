<template>
  <NuxtLink
    :to="{
      name: 'product-slug',
      params: { slug: product.slug || ' ', id: product.id?.toString() || ' ' }
    }"
    class="group !flex h-full flex-col overflow-hidden border border-theme bg-theme-surface shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl rounded-xl overflow-hidden ring-default dark:border-gray-800 dark:bg-[rgba(9,16,31,0.9)]"
  >
    <div
      class="wrapper-card-index-image relative max-h-[200px] overflow-hidden bg-theme-subtle dark:bg-gray-900 w-full rounded-t-xl"
    >
      <!-- Image với overlay gradient -->
      <div
        class="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"
      />

      <img
        :src="formatImage(product, { width: 640, height: 480 })"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      />

      <!-- Badge giảm giá -->
      <div
        v-if="discountPercentage > 0"
        class="absolute left-2 top-2 z-20 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-sm animate-pulse"
      >
        -{{ discountPercentage }}%
      </div>

      <!-- Badge số lựa chọn -->
      <div
        v-if="product?.variants.length > 1"
        class="absolute right-2 top-2 z-20 rounded-full bg-black/70 backdrop-blur-md px-3 py-1.5 text-xs font-semibold text-white shadow-lg border border-white/20 transition-transform group-hover:scale-110"
      >
        {{ product?.variants.length }} lựa chọn
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
      <!-- Category badge -->
      <p
        v-if="product?.category?.name"
        class="text-[10px] font-semibold uppercase tracking-[0.2em] text-theme-muted dark:text-white/70 inline-block w-fit px-2 py-1 bg-blue-50 dark:bg-blue-900/30 rounded-md"
      >
        {{ product?.category?.name }}
      </p>

      <!-- Product name -->
      <h3
        class="text-sm md:text-lg font-bold text-theme-primary dark:text-white transition-colors line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400"
      >
        {{ product.name }}
      </h3>

      <!-- Description -->
      <p
        v-if="product.description"
        class="text-sm text-theme-muted dark:text-white/80 line-clamp-2 leading-relaxed"
      >
        {{ product.description }}
      </p>

      <!-- Price section với layout cải tiến -->
      <div class="mt-auto flex items-end justify-between pt-2">
        <div class="flex flex-col">
          <div class="flex items-baseline gap-2">
            <p class="text-sm price-gradient md:text-2xl font-bold">
              {{ formatPrice(product?.variants?.[0]?.price || 0) }}
            </p>
            <span
              v-if="product?.variants?.[0]?.label"
              class="text-[8px] sm:text-sm text-gray-500 dark:text-gray-400"
            >
              / {{ product?.variants?.[0]?.label }}
            </span>
          </div>
          <p
            v-if="product?.variants?.[0]?.original_price"
            class="text-xs sm:text-sm font-medium text-gray-400 dark:text-gray-500 line-through mt-0.5"
          >
            {{ formatPrice(product?.variants?.[0]?.original_price || 0) }}
          </p>
        </div>
      </div>

      <!-- Add to cart button với style giống Toast -->
      <button
        class="add-to-cart-btn px-4 py-2 sm:px-6 sm:py-4 w-full rounded-xl mt-4 cursor-pointer relative overflow-hidden"
        @click.stop.prevent="add(product)"
      >
        <div class="hidden sm:flex items-center justify-center gap-2">
          <Icon icon="mdi:cart-plus" class="cart-icon-btn" />
          <span class="font-semibold relative z-10">Thêm vào giỏ</span>
        </div>
        <div class="flex sm:hidden items-center justify-center gap-2">
          <Icon icon="mdi:cart-plus" class="" />
          <span class="text-[10px] font-semibold relative z-10 uppercase">Chọn mua</span>
        </div>
      </button>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import type { ProductItem } from '~/types/Product';
import { formatImage } from '~/utils/formatImage';
import { formatPrice } from '~/utils/formatPrice';
const { addToCart } = useCart();
const { success } = useToast();

const props = defineProps({
  product: {
    type: Object as PropType<ProductItem>,
    default: () => ({})
  }
});

// Tính phần trăm giảm giá
const discountPercentage = computed(() => {
  const originalPrice = props.product?.variants?.[0]?.original_price || 0;
  const currentPrice = props.product?.variants?.[0]?.price || 0;

  if (originalPrice > 0 && originalPrice > currentPrice) {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  }
  return 0;
});

function add(p: ProductItem) {
  addToCart({
    id: p.id,
    name: p.name,
    price: p.variants?.[0]?.price || 0,
    image: p.image,
    capacity: p.variants?.[0]?.label || ''
  });
  success(`${p.variants?.[0]?.label || ''} "${p.name}"`, {
    actionText: 'Xem giỏ hàng',
    actionTo: '/gio-hang',
    image: formatImage(p, { width: 120, height: 120 }),
    layout: 'drawer',
    timeout: 0
  });
}
</script>

<style lang="scss">
.wrapper-card-index-image {
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 30%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
    transform: skewX(-40deg);
    z-index: 1;
    pointer-events: none;
    opacity: 0;
  }
  &:hover {
    &::before {
      opacity: 1;
      animation: shimmer 0.7s ease-out forwards;
    }
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 150%;
  }
}

.price-gradient {
  background: linear-gradient(180deg, #ffd166, #ffb347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 12px rgba(255, 179, 71, 0.3);
}

.sparkle-icon-btn {
  width: 18px;
  height: 18px;
  position: relative;
  z-index: 10;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%,
  100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
}
</style>
