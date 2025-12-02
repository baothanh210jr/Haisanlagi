<template>
  <Breadcrumb
    :items="[
      { label: 'Trang chủ', to: '/' },
      { label: product?.category?.name || '', to: `/hai-san/${product?.category?.slug || ''}` },
      { label: product?.name || slug },
    ]"
  />
  <div class="bg-gray-100 py-10">
    <div class="container py-8 bg-white">
      <div
        v-if="product"
        class="flex gap-8 text-black"
      >
        <div class="w-1/2 pb-10 relative">
          <div
            class="absolute top-10 -right-10 -ml-20 -mt-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"
          />
          <div
            class="absolute top-0 right-10 w-96 h-96 bg-cyan-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"
          />
          <div
            class="wrapper-card-index relative z-10 w-full h-auto overflow-hidden rounded border-4 border-white"
          >
            <img
              :src="formatImage(product, { width: 1200, height: 800 })"
              :alt="product.name"
              class="transition-transform duration-200 ease-out w-full h-full object-cover"
            >
          </div>
        </div>
        <div class="info">
          <h1 class="text-3xl font-bold">
            {{ product.name }}
          </h1>
          <p class="mt-2">
            <span class="text-2xl font-bold text-secondary">{{ formatPrice(totalPrice) }}</span>
            <span
              v-if="selectVariant?.original_price"
              class="text-lg font-medium text-gray-500 line-through ml-3"
            >{{ formatPrice(selectVariant?.original_price) }}</span>
          </p>
          <div class="capacity flex items-center gap-5">
            <label class="font-bold text-sm">Chọn:</label>
            <div class="options mt-2">
              <label
                v-for="opt in product.variants"
                :key="opt.id"
                class="opt"
              >
                <input
                  v-model="selectVariant"
                  type="radio"
                  name="capacity"
                  :value="opt"
                >
                <span>{{ opt.label }}</span>
              </label>
            </div>
          </div>
          <div class="flex items-center gap-4 my-6">
            <div class="text-sm mb-2 font-bold">
              Số lượng:
            </div>
            <Counter
              :model-value="quantity"
              @update:model-value="(val) => (quantity = val)"
            />
          </div>
          <p
            v-if="product.description"
            class="desc"
          >
            {{ product.description }}
          </p>
          <button
            class="bg-blue-600 hover:bg-blue-700 text-white py-3 px-9 rounded-lg font-medium flex items-center justify-center gap-1 text-md"
            @click="add(product)"
          >
            <Icon
              icon="mdi:cart-plus"
              class="w-6 h-6"
            />
            <span class="uppercase font-semibold">Thêm giỏ hàng</span>
          </button>
        </div>
      </div>
      <div
        v-else
        class="empty"
      >
        Sản phẩm không tồn tại hoặc đã ẩn.
      </div>
    </div>
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

<style>
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
