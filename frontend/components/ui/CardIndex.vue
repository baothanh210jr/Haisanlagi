<template>
  <NuxtLink
    :to="{
      name: 'product-slug',
      params: { slug: product.slug },
    }"
    class="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden h-[180px] flex"
  >
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
          <div class="mb-2">
            <span class="text-xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
          </div>
        </div>

        <!-- Add Button -->
        <Button class="flex gap-2" @click.prevent="add(product)">
          <Icon icon="mdi:cart-plus" class="w-4 h-4" />
          <span class="text-sm font-semibold">Thêm giỏ hàng</span>
        </Button>
      </div>

      <!-- Right Image -->
      <div class="w-1/2 relative">
        <img
          :src="formatImage(product, { width: 200, height: 200 })"
          :alt="product.name"
          class="w-full h-full object-cover rounded-lg"
        />
        <button
          class="absolute top-1 right-1 w-6 h-6 bg-white/80 hover:bg-white rounded-full flex items-center justify-center transition-colors"
        >
          <Icon icon="mdi:heart-outline" class="w-4 h-4 text-gray-600 hover:text-red-500" />
        </button>
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

  const props = defineProps({
    product: {
      type: Object as PropType<ProductItem>,
      default: () => ({}),
    },
  })

  const selectedCapacity = ref<number>(1)
  const displayPrice = computed(() => (props.product?.price || 0) * selectedCapacity.value)

  function add(p: ProductItem) {
    console.log('🚀 ~ file: CardIndex.vue:65 ~ ProductItem:', p)
    addToCart({
      id: p.id,
      name: p.name,
      price: displayPrice.value,
      image: p.image,
      capacity: selectedCapacity.value,
    })
    success(`Đã thêm ${selectedCapacity.value}kg \"${p.name}\" vào giỏ hàng`, {
      actionText: 'Xem giỏ hàng',
      actionTo: '/gio-hang',
      image: formatImage(p, { width: 120, height: 120 }),
    })
  }
</script>

<style lang="scss" scoped></style>
