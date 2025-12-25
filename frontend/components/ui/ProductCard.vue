<template>
  <Card padding="none">
    <div class="group relative overflow-hidden rounded-xl">
      <div
        v-if="product?.variants.length > 1"
        class="absolute top-2 right-1 bg-black/60 p-2 rounded z-10 text-white text-xs font-bold"
      >
        Có {{ product?.variants.length }} lựa chọn
      </div>
      <NuxtLink :to="`/product/${product.slug}`" class="block wrapper-card-index relative">
        <div class="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
          <img
            v-if="img"
            :src="img"
            :alt="product.name"
            class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div v-else class="h-full w-full flex items-center justify-center text-gray-400">
            Không có ảnh
          </div>
        </div>
      </NuxtLink>
    </div>
    <div class="p-4 space-y-2">
      <h3 class="name font-semibold text-gray-900">
        {{ product.name }}
      </h3>
      <div class="flex items-center justify-between gap-4">
        <div>
          <div class="mt-3 flex items-center justify-between">
            <div>
              <span class="text-lg font-semibold text-gray-900">{{
                formatPrice(product?.variants[0]?.price || 0)
              }}</span>
              <span v-if="product?.variants[0]?.label" class="text-gray-600 text-xs"
                >/ {{ product?.variants[0]?.label || '' }}</span
              >
            </div>
          </div>
          <div class="mb-2">
            <span class="font-medium text-red-500 line-through text-sm">{{
              formatPrice(product?.variants[0]?.original_price || 0)
            }}</span>
          </div>
        </div>
      </div>
    </div>
  </Card>
</template>

<script setup lang="ts">
  import Card from '~/components/ui/Card.vue'
  import { useCart } from '~/composables/useCart'
  import { useToast } from '~/composables/useToast'
  import type { ProductItem } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'
  import { formatPrice } from '~/utils/formatPrice'

  const props = defineProps<{ product: ProductItem }>()
  const img = computed(() => formatImage(props.product, { width: 800, height: 600 }))
  const { addToCart } = useCart()
  const { success } = useToast()
  const showQuick = ref(false)

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
      layout: 'drawer',
      timeout: 0,
    })
  }

  function openQuickView() {
    showQuick.value = true
  }
</script>

<style scoped>
  .name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
</style>
