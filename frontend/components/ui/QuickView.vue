<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')" />
      <div
        class="relative mx-auto max-w-3xl w-[92%] md:w-[860px] bg-white rounded-xl overflow-hidden shadow-lg"
      >
        <button
          class="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-red-600 hover:text-white flex items-center justify-center"
          @click="$emit('close')"
        >
          <Icon icon="mdi:close" class="w-5 h-5" />
        </button>
        <div class="grid md:grid-cols-2">
          <div class="p-4">
            <div class="aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-lg">
              <img v-if="img" :src="img" :alt="p.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                Không có ảnh
              </div>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900">
              {{ p.name }}
            </h3>
            <p class="">
              <span class="text-2xl font-bold text-secondary">{{ formatPrice(totalPrice) }}</span>
              <span
                v-if="selectVariant?.original_price"
                class="text-lg font-medium text-gray-500 line-through ml-3"
                >{{ formatPrice(selectVariant?.original_price) }}</span
              >
            </p>
            <p v-if="desc" class="mt-4 text-gray-600 text-sm leading-relaxed">
              {{ desc }}
            </p>
            <div class="mt-2 space-y-4">
              <div>
                <div class="text-sm text-gray-700 mb-2">Chọn trọng lượng (kg)</div>
                <div class="capacity gap-5">
                  <label class="font-bold text-sm">Chọn:</label>
                  <div class="options mt-2 flex-wrap">
                    <label v-for="opt in product.variants" :key="opt.id" class="opt text-sm">
                      <input v-model="selectVariant" type="radio" name="capacity" :value="opt" />
                      <span>{{ opt.label }}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-700 mb-2">Số lượng</div>
                <Counter :model-value="quantity" @update:model-value="(val) => (quantity = val)" />
              </div>
              <div class="flex gap-3">
                <Button @click="add(product)">
                  <Icon icon="mdi:cart-plus" class="w-6 h-6" />
                  <span>Thêm giỏ hàng</span>
                </Button>
                <NuxtLink
                  v-if="p.slug"
                  :to="`/product/${p.slug}`"
                  class="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50"
                  @click="$emit('close')"
                >
                  Xem chi tiết
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { computed, onMounted, ref } from 'vue'
  import { useCart } from '~/composables/useCart'
  import { useProductDetail } from '~/composables/useProductDetail'
  import { useToast } from '~/composables/useToast'
  import type { ProductItem, Variants } from '~/types/Product'
  import { formatImage } from '~/utils/formatImage'
  import Button from './Button.vue'
  import Counter from './Counter.vue'

  const props = defineProps<{ product: ProductItem }>()
  defineEmits(['close'])

  const { product: detail, ensureProduct } = useProductDetail(props.product.slug || '')
  onMounted(() => {
    if (props.product.slug) ensureProduct()
  })

  const p = computed<ProductItem>(() => (detail.value || props.product) as ProductItem)
  const img = computed(() => formatImage(p.value, { width: 1200, height: 900 }))
  const desc = computed(() => (p.value?.description || '').toString())

  const { addToCart } = useCart()
  const { success } = useToast()
  const selectVariant = ref<Variants | null>(null)
  const quantity = ref<number>(1)
  const capacity = ref<number>(1)
  const unitPrice = computed(() => Number(selectVariant.value?.price ?? 0))
  const priceForCapacity = computed(() => unitPrice.value * capacity.value)
  const totalPrice = computed(() => priceForCapacity.value * quantity.value)

  watch(
    () => props.product,
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

<style scoped></style>
