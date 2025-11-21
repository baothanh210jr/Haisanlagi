<template>
  <NuxtLink
    :to="{
      name: 'product-slug',
      params: { slug: product.slug },
    }"
    class="wrapper-card-index relative bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden flex h-full min-h-[180px]"
  >
    <div
      v-if="product?.variants.length > 1"
      class="absolute top-2 right-2 bg-black/60 p-2 rounded z-10 text-white text-xs font-bold"
    >
      Có {{ product?.variants.length }} lựa chọn
    </div>
    <div class="flex gap-4 p-4 w-full">
      <!-- Left Content -->
      <div class="w-1/2 flex flex-col justify-between h-full">
        <div>
          <h3
            class="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-tight hover:underline"
          >
            {{ product.name }}
          </h3>
          <p class="text-gray-600 text-xs mb-2 line-clamp-2">
            {{ product.description }}
          </p>
          <!-- Price -->
          <div class="">
            <span class="text-lg font-semibold text-gray-900">{{
              formatPrice(product?.variants[0]?.price || 0)
            }}</span>
            <span class="text-gray-600 text-xs">/ {{ product?.variants[0]?.label || '' }}</span>
          </div>
          <!-- Price Original -->
          <div class="mb-2">
            <span class="font-medium text-gray-900 text-red-500 line-through">{{
              formatPrice(product?.variants[0]?.original_price || 0)
            }}</span>
          </div>
        </div>

        <!-- Add Button -->
        <Button class="flex gap-2" @click.prevent="add(product)">
          <Icon icon="mdi:cart-plus" class="w-4 h-4" />
          <span class="text-xs font-bold">Thêm giỏ hàng</span>
        </Button>
      </div>
      <!-- Right Image -->
      <div class="w-1/2 relative overflow-hidden rounded-lg">
        <img
          :src="formatImage(product, { width: 200, height: 200 })"
          :alt="product.name"
          class="w-full h-full object-cover rounded-lg"
        />
        <!-- TODO: apply favorite -->
        <!-- <button
          class="absolute top-1 right-1 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:heart-outline" class="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button> -->
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
    success(`Đã thêm ${p.variants[0]?.label || ''}kg \"${p.name}\" vào giỏ hàng`, {
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
      img {
        transform: scale(1.05);
        transition: transform 0.3s ease-in-out;
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
