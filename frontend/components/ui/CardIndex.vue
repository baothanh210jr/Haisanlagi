<template>
  <NuxtLink
    :to="{
      name: 'product-slug',
      params: { slug: product.slug },
    }"
    class="wrapper-card-index group flex h-full flex-col overflow-hidden border border-gray-100 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl"
  >
    <div class="relative aspect-[4/3] max-h-[200px] overflow-hidden bg-gray-50">
      <img
        :src="formatImage(product, { width: 640, height: 480 })"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-105"
      />
      <div
        v-if="product?.variants.length > 1"
        class="absolute right-2 top-2 rounded-full bg-yellow-500 px-3 py-1 text-xs font-semibold text-white shadow"
      >
        {{ product?.variants.length }} lựa chọn
      </div>
    </div>

    <div class="flex flex-1 flex-col gap-3 px-4 pb-4 pt-3">
      <p
        v-if="product?.category?.name"
        class="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400"
      >
        {{ product?.category?.name }}
      </p>

      <h3
        class="text-base font-semibold text-gray-900 transition-colors line-clamp-2 group-hover:text-primary"
      >
        {{ product.name }}
      </h3>

      <p class="text-sm text-gray-500 line-clamp-2">
        {{ product.description }}
      </p>

      <div class="flex items-center justify-between text-xs text-gray-500">
        <div class="flex items-center gap-1 text-amber-500">
          <Icon v-for="i in 5" :key="i" icon="mdi:star" class="h-3.5 w-3.5" />
        </div>
        <span v-if="product?.variants[0]?.label" class="font-medium text-gray-600">
          {{ product?.variants[0]?.label }}
        </span>
      </div>

      <div class="mt-auto flex items-end justify-between border-t border-gray-100 pt-4">
        <div>
          <div class="text-xs uppercase tracking-wide text-gray-400">Giá từ</div>
          <div class="flex items-baseline gap-2">
            <span class="text-2xl font-bold text-gray-900">{{
              formatPrice(product?.variants[0]?.price || 0)
            }}</span>
            <span
              v-if="product?.variants[0]?.original_price"
              class="text-sm font-semibold text-gray-400 line-through"
            >
              {{ formatPrice(product?.variants[0]?.original_price || 0) }}
            </span>
          </div>
        </div>

        <Button
          variant="outline"
          size="sm"
          class="border-blue-200 text-sm font-semibold text-blue-600 hover:bg-blue-50 gap-2"
          @click.stop.prevent="add(product)"
        >
          <Icon icon="mdi:cart-plus" class="h-4 w-4" />
          <span>Thêm giỏ</span>
        </Button>
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import type { ProductItem } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'
  import { formatPrice } from '~/utils/formatPrice'
  import Button from './Button.vue'
  const { addToCart } = useCart()
  const { success } = useToast()

  defineProps({
    product: {
      type: Object as PropType<ProductItem>,
      default: () => ({}),
    },
  })

  function add(p: ProductItem) {
    addToCart({
      id: p.id,
      name: p.name,
      price: p.variants[0]?.price || 0,
      image: p.image,
      capacity: p.variants[0]?.label || '',
    })
    success(`Đã thêm ${p.variants[0]?.label || ''} \"${p.name}\" vào giỏ hàng`, {
      actionText: 'Xem giỏ hàng',
      actionTo: '/gio-hang',
      image: formatImage(p, { width: 120, height: 120 }),
    })
  }
</script>

<style lang="scss">
  .wrapper-card-index {
    position: relative;
    overflow: hidden;

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
      left: 120%;
    }
  }
</style>
