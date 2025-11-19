<template>
  <Card padding="none">
    <div class="group relative overflow-hidden rounded-xl">
      <NuxtLink :to="`/product/${product.slug}`" class="block">
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
          <button
            class="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/20 transition-colors opacity-0 group-hover:opacity-100"
            aria-label="Xem nhanh"
            @click.stop.prevent="openQuickView"
          >
            <svg
              class="w-10 h-10 text-white drop-shadow"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12s-3.75 6.75-9.75 6.75S2.25 12 2.25 12zm0 0h0m9.75-3.375a3.375 3.375 0 110 6.75 3.375 3.375 0 010-6.75z"
              />
            </svg>
          </button>
        </div>
      </NuxtLink>
      <!-- Hiển thị thông tin trên ảnh -->
      <!-- <div class="absolute top-3 left-3">
        <span class="inline-flex items-center rounded-md bg-primary/90 px-3 py-1 text-white text-xs shadow-md">
          {{ formatPrice(product.price) }}
        </span>
      </div> -->
    </div>
    <div class="p-4">
      <h3 class="name font-semibold text-gray-900">
        {{ product.name }}
      </h3>
      <div class="mt-3 flex items-center justify-between">
        <span class="text-primary font-bold">{{ formatPrice(product.price) }}</span>
        <Button size="sm" @click="add"> Thêm vào giỏ </Button>
      </div>
    </div>
  </Card>
  <QuickView v-if="showQuick" :product="product" @close="showQuick = false" />
</template>

<script setup lang="ts">
  import Button from '~/components/ui/Button.vue'
  import Card from '~/components/ui/Card.vue'
  import QuickView from '~/components/ui/QuickView.vue'
  import { useCart } from '~/composables/useCart'
  import { useToast } from '~/composables/useToast'
  import { formatImage } from '~/utils/formatImage'

  type Product = {
    id: number | string
    name: string
    slug: string
    price: number
    image?: any
    image_default?: any
  }

  const props = defineProps<{ product: Product }>()
  const img = computed(() => formatImage(props.product, { width: 800, height: 600 }))
  const { addToCart } = useCart()
  const { success } = useToast()
  const showQuick = ref(false)

  function add() {
    const p = props.product
    addToCart({
      id: p.id,
      name: p.name,
      price: p.price,
      image: p.image || p.image_default,
      capacity: 1,
    })
    success(`Đã thêm "${p.name}" vào giỏ hàng`, {
      actionText: 'Xem giỏ hàng',
      actionTo: '/gio-hang',
      image: formatImage(p, { width: 120, height: 120 }),
    })
  }

  function formatPrice(n: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
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
