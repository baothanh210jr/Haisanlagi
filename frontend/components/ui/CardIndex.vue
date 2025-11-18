<template>
  <div
    class="bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden h-[180px] flex"
  >
    <div class="flex gap-4 p-4 w-full">
      <!-- Left Content -->
      <div class="w-1/2 flex flex-col justify-between h-full">
        <div>
          <h3 class="font-bold text-gray-900 text-base mb-1 line-clamp-2 leading-tight">
            {{ product.name }}
          </h3>
          <p class="text-gray-600 text-xs mb-2 line-clamp-2">
            Carefully Sourced, Kept Chilled, And Delivered The Same.
          </p>
          <!-- Price -->
          <div class="mb-2">
            <span class="text-xl font-bold text-gray-900">{{ formatPrice(product.price) }}</span>
          </div>
        </div>

        <!-- Add Button -->
        <button
          class="bg-red-500 hover:bg-red-600 text-white py-2.5 px-2 rounded-lg transition-colors flex items-center justify-center gap-1 font-medium"
          @click="add(product)"
        >
          <Icon icon="mdi:cart-plus" class="w-6 h-6" />
          <span class="text-sm">Thêm giỏ hàng</span>
        </button>
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
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import type { ProductItem } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'
  import { formatPrice } from '~/utils/formatPrice'
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
    })
  }
</script>

<style lang="scss" scoped></style>
