<template>
  <Teleport to="body">
    <div class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="absolute inset-0 bg-black/50" @click="$emit('close')"></div>
      <div class="relative mx-auto max-w-3xl w-[92%] md:w-[860px] bg-white rounded-xl overflow-hidden shadow-lg">
        <button class="absolute top-3 right-3 w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center" @click="$emit('close')">
          <svg class="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>
        </button>
        <div class="grid md:grid-cols-2">
          <div class="p-4">
            <div class="aspect-[4/3] w-full overflow-hidden bg-gray-100 rounded-lg">
              <img v-if="img" :src="img" :alt="p.name" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-gray-400">Không có ảnh</div>
            </div>
          </div>
          <div class="p-6">
            <h3 class="text-xl font-semibold text-gray-900">{{ p.name }}</h3>
            <div class="mt-3 text-primary font-bold">{{ formatPrice(totalPrice) }}</div>
            <p v-if="desc" class="mt-4 text-gray-600 text-sm leading-relaxed">{{ desc }}</p>
            <div class="mt-6 space-y-4">
              <div>
                <div class="text-sm text-gray-700 mb-2">Chọn trọng lượng (kg)</div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="w in capacities"
                    :key="w"
                    class="px-3 py-2 rounded-md border transition-colors"
                    :class="w === capacity ? 'bg-primary text-white border-primary' : 'bg-white text-gray-800 hover:bg-gray-50 border-gray-300'"
                    @click="capacity = w"
                  >
                    {{ w }} kg
                  </button>
                </div>
              </div>
              <div>
                <div class="text-sm text-gray-700 mb-2">Số lượng</div>
                <div class="inline-flex items-center gap-2">
                  <button class="w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-50" @click="decQty">-</button>
                  <input class="w-14 h-9 text-center border border-gray-300 rounded-md" type="number" min="1" v-model.number="quantity">
                  <button class="w-9 h-9 rounded-md border border-gray-300 hover:bg-gray-50" @click="incQty">+</button>
                </div>
              </div>
              <div class="text-sm text-gray-500">Tổng: {{ formatPrice(totalPrice) }} ({{ quantity }} x {{ capacity }}kg)</div>
              <div class="flex gap-3">
                <button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90" @click="add">
                  Thêm vào giỏ
                </button>
                <NuxtLink v-if="p.slug" :to="`/product/${p.slug}`" class="px-4 py-2 rounded-md border border-gray-300 text-gray-800 hover:bg-gray-50" @click="$emit('close')">
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
import { computed, onMounted, ref } from 'vue'
import { useProductDetail } from '~/composables/useProductDetail'
import { formatImage } from '~/utils/formatImage'
import { useCart } from '~/composables/useCart'
import { useToast } from '~/composables/useToast'

type Product = { id: number | string, name: string, slug?: string, price: number, image?: any, image_default?: any, description?: string }
const props = defineProps<{ product: Product }>()
defineEmits(['close'])

const { product: detail, ensureProduct } = useProductDetail(props.product.slug || '')
onMounted(() => { if (props.product.slug) ensureProduct(true) })

const p = computed<Product>(() => (detail.value || props.product) as Product)
const img = computed(() => formatImage(p.value, { width: 1200, height: 900 }))
const desc = computed(() => (p.value?.description || '').toString())

const { addToCart } = useCart()
const { success } = useToast()
const capacities = [0.5, 1, 2, 3, 5]
const capacity = ref<number>(1)
const quantity = ref<number>(1)
const unitPrice = computed(() => Number(p.value?.price ?? 0))
const priceForCapacity = computed(() => unitPrice.value * capacity.value)
const totalPrice = computed(() => priceForCapacity.value * quantity.value)

function add() {
  addToCart({ id: p.value.id, name: p.value.name, price: priceForCapacity.value, image: p.value.image || p.value.image_default, capacity: capacity.value }, quantity.value)
  success(`Đã thêm ${quantity.value} x ${capacity.value}kg "${p.value.name}" vào giỏ hàng`, { actionText: 'Xem giỏ hàng', actionTo: '/gio-hang' })
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

function incQty() { quantity.value = Math.min(99, quantity.value + 1) }
function decQty() { quantity.value = Math.max(1, quantity.value - 1) }
</script>

<style scoped>
</style>