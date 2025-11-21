<template>
  <div class="container py-5">
    <Breadcrumb
      :items="[
        { label: 'Trang chủ', to: '/' },
        { label: 'Sản phẩm' },
        { label: product?.name || slug },
      ]"
    />
    <div v-if="product" class="flex gap-8 text-black">
      <div class="w-1/2 pb-10">
        <div class="w-full h-auto overflow-hidden rounded">
          <img
            :src="formatImage(product, { width: 1200, height: 800 })"
            :alt="product.name"
            class="transition-transform duration-200 ease-out hover:scale-105 w-full h-full object-cover"
          />
        </div>
      </div>
      <div class="info">
        <h1 class="text-3xl font-bold">
          {{ product.name }}
        </h1>
        <p class="text-xl font-semibold mt-2">
          {{ selectVariant?.price ? formatPrice(selectVariant?.price) : '' }}
        </p>
        <div class="capacity flex items-center gap-5">
          <label>Khối lượng:</label>
          <div class="options mt-2">
            <label v-for="opt in product.variants" :key="opt.id" class="opt">
              <input v-model="selectVariant" type="radio" name="capacity" :value="opt" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <p v-if="product.description" class="desc">
          {{ product.description }}
        </p>
        <button
          class="bg-blue-500 hover:bg-blue-700 text-white py-3 px-9 rounded-lg font-medium flex items-center justify-center gap-1 text-md"
          @click="add(product)"
        >
          <Icon icon="mdi:cart-plus" class="w-6 h-6" />
          <span>Thêm giỏ hàng</span>
        </button>
      </div>
    </div>
    <div v-else class="empty">Sản phẩm không tồn tại hoặc đã ẩn.</div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import Breadcrumb from '~/components/ui/Breadcrumb.vue'
  import { useCart } from '~/composables/useCart'
  import { useProductDetail } from '~/composables/useProductDetail'
  import { useToast } from '~/composables/useToast'
  import type { ProductItem, Variants } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'

  const route = useRoute()
  const slug = route.params.slug as string
  const { addToCart } = useCart()
  const { success } = useToast()

  const { product, ensureProduct } = useProductDetail(slug)
  onMounted(() => {
    ensureProduct()
  })

  const selectVariant = ref<Variants | null>(null)

  watch(
    () => product.value,
    (val) => {
      if (val && val.variants && val.variants.length > 0) {
        selectVariant.value = val.variants[0] || null
      }
    },
    { immediate: true }
  )

  function add(p: ProductItem) {
    console.log('🚀 ~ [slug].vue:84 ~ add ~ p:', p)
    addToCart({
      id: p.id,
      name: p.name,
      price: selectVariant.value?.price || p.price,
      image: p.image,
      capacity: selectVariant.value?.label || '',
    })
    success(`Đã thêm ${selectVariant.value?.label} \"${p.name}\" vào giỏ hàng`, {
      actionText: 'Xem giỏ hàng',
      actionTo: '/gio-hang',
      image: formatImage(p as any, { width: 120, height: 120 }),
    })
  }

  function formatPrice(n: number) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
  }
</script>

<style scoped>
  .actions {
    display: flex;
    gap: 10px;
    margin-top: 16px;
  }

  .capacity {
    margin: 12px 0;
  }
  .options {
    display: flex;
    gap: 10px;
  }
  .opt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
</style>
