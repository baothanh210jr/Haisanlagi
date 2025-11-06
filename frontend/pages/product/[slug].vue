<template>
  <div class="container">
    <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: 'Sản phẩm' }, { label: product?.name || slug }]" />
    <div
      v-if="product"
      class="detail"
    >
      <div class="media">
        <img
          :src="formatImage(
            product, { width: 1200, height: 800 })" 
          :alt="product.name" 
          class="transition-transform duration-200 ease-out hover:scale-105"
        >
      </div>
      <div class="info">
        <h1>{{ product.name }}</h1>
        <p class="price">
          {{ formatPrice(displayPrice) }}
        </p>
        <div class="capacity">
          <label>Khối lượng:</label>
          <div class="options">
            <label
              v-for="opt in capacityOptions"
              :key="opt"
              class="opt"
            >
              <input
                v-model.number="selectedCapacity"
                type="radio"
                name="capacity"
                :value="opt"
              >
              <span>{{ opt }}kg</span>
            </label>
          </div>
        </div>
        <p
          v-if="product.description"
          class="desc"
        >
          {{ product.description }}
        </p>
        <div class="actions">
          <Button @click="add(product)">
            Thêm vào giỏ
          </Button>
          <NuxtLink
            class="secondary"
            :to="categoryLink"
          >
            Xem danh mục
          </NuxtLink>
        </div>
      </div>
    </div>
    <div
      v-else
      class="empty"
    >
      Sản phẩm không tồn tại hoặc đã ẩn.
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import { useToast } from '~/composables/useToast'
import { computed, ref } from 'vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'
import { useProductDetail } from '~/composables/useProductDetail'

type Product = { id: number | string, name: string, slug: string, price: number, image?: any, description?: string, category?: number | string, capacity_options?: number[] }

const route = useRoute()
const slug = route.params.slug as string
const { addToCart } = useCart()
const { success } = useToast()

const { product, ensureProduct } = useProductDetail(slug)
await ensureProduct()

const categoryLink = computed(() => product.value?.category ? `/category/${product.value.category}` : '/')

const capacityOptions = computed(() => {
  const opts = (product.value as any)?.capacity_options
  if (Array.isArray(opts) && opts.length > 0) return opts as number[]
  return [0.5, 1]
})
const selectedCapacity = ref<number>(1)
const displayPrice = computed(() => (product.value?.price || 0) * selectedCapacity.value)

function add(p: Product) {
  addToCart({ id: p.id, name: p.name, price: displayPrice.value, image: p.image, capacity: selectedCapacity.value })
  success(`Đã thêm ${selectedCapacity.value}kg \"${p.name}\" vào giỏ hàng`, { actionText: 'Xem giỏ hàng', actionTo: '/gio-hang' })
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

</script>

<style scoped>
/* Dùng Tailwind container, bỏ CSS container cứng */
.detail { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; align-items: start; }
.media img { width: 100%; height: 420px; object-fit: cover; border-radius: 12px; }
.info h1 { margin: 0 0 8px; }
.price { font-weight: 700; margin: 8px 0 12px; color: #111827; font-size: 20px; }
.desc { color: #374151; line-height: 1.6; }
.actions { display: flex; gap: 10px; margin-top: 16px; }
button { padding: 10px 14px; background: #0ea5e9; color: white; border: none; border-radius: 8px; cursor: pointer; }
button:hover { background: #0284c7; }
.secondary { padding: 10px 14px; background: #f3f4f6; color: #111827; border-radius: 8px; text-decoration: none; }
.secondary:hover { background: #e5e7eb; }
.empty { padding: 24px; color: #6b7280; }
@media (max-width: 768px) {
  .detail { grid-template-columns: 1fr; }
  .media img { height: 280px; }
}
.capacity { margin: 12px 0; }
.options { display: flex; gap: 10px; }
.opt { display: inline-flex; align-items: center; gap: 6px; padding: 6px 10px; border: 1px solid #e5e7eb; border-radius: 8px; }
</style>