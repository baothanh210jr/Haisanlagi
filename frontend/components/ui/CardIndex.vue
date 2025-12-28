<template>
  <NuxtLink
    :to="{
      name: 'product-slug',
      params: { slug: product.slug || ' ' }
    }"
    class="group !flex h-full flex-col overflow-hidden border border-theme bg-theme-surface shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl overflow-hidden ring-default dark:border-gray-800 dark:bg-[rgba(9,16,31,0.9)]"
  >
    <div
      class="wrapper-card-index-image relative max-h-[200px] overflow-hidden bg-theme-subtle dark:bg-gray-900 w-full"
    >
      <img
        :src="formatImage(product, { width: 640, height: 480 })"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />
      <div
        v-if="product?.variants.length > 1"
        class="absolute right-2 top-2 rounded-full bg-red-500 px-3 py-1 text-xs font-semibold text-white shadow"
      >
        {{ product?.variants.length }} lựa chọn
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-1 px-4 pb-4 pt-3">
      <p
        v-if="product?.category?.name"
        class="text-[10px] font-semibold uppercase tracking-[0.2em] text-theme-muted dark:text-white/70"
      >
        {{ product?.category?.name }}
      </p>

      <h3
        class="text-lg font-bold text-theme-primary dark:text-white transition-colors line-clamp-2"
      >
        {{ product.name }}
      </h3>

      <p class="text-sm text-theme-muted dark:text-white line-clamp-2">
        {{ product.description }}
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, odit ex quibusdam ea
        culpa totam expedita fugit aliquam eum adipisci libero aperiam consectetur? Doloribus esse
        odio earum in! Dicta, quisquam.
      </p>

      <div class="flex items-center justify-between text-xs text-gray-500" />

      <div class="mt-auto flex items-end justify-between pt-4">
        <div>
          <div class="space-y-1">
            <p class="text-2xl font-bold color-price">
              {{ formatPrice(product?.variants[0]?.price || 0) }}
            </p>
            <p
              v-if="product?.variants[0]?.original_price"
              class="text-sm font-semibold discount-price line-through"
            >
              {{ formatPrice(product?.variants[0]?.original_price || 0) }}
            </p>
          </div>
        </div>
      </div>
      <div
        class="w-full py-3 bg-primary text-white border border-theme rounded-lg flex items-center justify-center gap-2 mt-4 cursor-pointer transition hover:opacity-90 hover:shadow-lg dark:bg-gray-800"
        @click.stop.prevent="add(product)"
      >
        <Icon icon="mdi:cart-plus" class="h-6 w-6" />
        <span class="font-semibold text-lg">Thêm vào giỏ</span>
      </div>
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

defineProps({
  product: {
    type: Object as PropType<ProductItem>,
    default: () => ({})
  }
});

function add(p: ProductItem) {
  addToCart({
    id: p.id,
    name: p.name,
    price: p.variants[0]?.price || 0,
    image: p.image,
    capacity: p.variants[0]?.label || ''
  });
  success(`${p.variants[0]?.label || ''} \"${p.name}\"`, {
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
</style>
