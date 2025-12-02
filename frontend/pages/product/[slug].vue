<template>
  <div class="container py-6 lg:py-10">
    <Breadcrumb
      :items="[
        { label: 'Trang chủ', to: '/' },
        { label: 'Sản phẩm' },
        { label: product?.name || slug },
      ]"
    />
    <div v-if="product" class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10 text-black mt-6">
      <div class="w-full">
        <div class="w-full overflow-hidden rounded-xl shadow-sm bg-white">
          <img
            :src="formatImage(product, { width: 1200, height: 800 })"
            :alt="product.name"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
      <div class="space-y-4 lg:space-y-6">
        <h1 class="text-3xl font-bold">
          {{ product.name }}
        </h1>
        <p class="mt-2 flex items-center gap-3 flex-wrap">
          <span class="text-2xl font-bold text-secondary">{{ formatPrice(totalPrice) }}</span>
          <span
            v-if="selectVariant?.original_price"
            class="text-lg font-medium text-gray-500 line-through"
            >{{ formatPrice(selectVariant?.original_price) }}</span
          >
        </p>
        <div class="space-y-2">
          <label class="font-bold text-sm">Chọn dung lượng</label>
          <div class="flex flex-wrap gap-3">
            <label v-for="opt in product.variants" :key="opt.id" class="opt">
              <input v-model="selectVariant" type="radio" name="capacity" :value="opt" />
              <span>{{ opt.label }}</span>
            </label>
          </div>
        </div>
        <div class="flex flex-wrap items-center gap-4 my-4">
          <div class="text-sm font-bold">Số lượng:</div>
          <Counter :model-value="quantity" @update:model-value="(val) => (quantity = val)" />
        </div>
        <p v-if="product.description" class="desc text-gray-700 leading-relaxed">
          {{ product.description }}
        </p>
        <button
          class="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white py-3 px-9 rounded-lg font-medium flex items-center justify-center gap-2 text-md"
          @click="add(product)"
        >
          <Icon icon="mdi:cart-plus" class="w-6 h-6" />
          <span>Thêm giỏ hàng</span>
        </button>
      </div>
    </div>
    <div v-else class="empty text-gray-700">Sản phẩm không tồn tại hoặc đã ẩn.</div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import Breadcrumb from '~/components/ui/Breadcrumb.vue'
  import Counter from '~/components/ui/Counter.vue'
  import { useCart } from '~/composables/useCart'
  import { useProductDetail } from '~/composables/useProductDetail'
  import { useToast } from '~/composables/useToast'
  import type { ProductItem, Variants } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'
  import { formatPrice } from '~/utils/formatPrice'

  const route = useRoute()
  const slug = route.params.slug as string
  const { addToCart } = useCart()
  const { success } = useToast()

  const { product, ensureProduct } = useProductDetail(slug)
  onMounted(() => {
    ensureProduct()
  })

  const selectVariant = ref<Variants | null>(null)
  const quantity = ref<number>(1)
  const unitPrice = computed(() => Number(selectVariant.value?.price ?? 0))
  const totalPrice = computed(() => unitPrice.value * quantity.value)

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
</script>

<style scoped>
  .opt {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 10px;
    border: 1px solid #e5e7eb;
    border-radius: 8px;
  }
</style>
