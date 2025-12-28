<template>
  <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: 'Giỏ hàng' }]" />
  <div class="container relative py-6 space-y-6">
    <div class="text-center">
      <h1 class="text-2xl font-semibold">Giỏ hàng của bạn</h1>
      <h4 class="text-sm font-medium mt-1">Có {{ items.length }} sản phẩm trong giỏ hàng</h4>
      <div style="background: var(--theme-text)" class="w-14 h-1 bg-black mx-auto my-5" />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-20">
      <div class="lg:col-span-8">
        <div v-if="items.length === 0" class="empty">Chưa có sản phẩm nào trong giỏ.</div>
        <div v-else class="space-y-2 divide-y">
          <div v-for="i in items" :key="i.id + ':' + (i.capacity ?? 'base')" class="row">
            <div class="overflow-hidden">
              <img
                :src="formatImage(i, { width: 1200, height: 800 })"
                :alt="i.name"
                class="transition-transform duration-200 ease-out hover:scale-105"
              />
            </div>
            <div class="info text-left">
              <strong class="line-clamp-2">{{ i.name }}</strong>
              <div>Giá: {{ formatPrice(i.price) }}</div>
              <div v-if="i.capacity" class="text-xs text-theme-muted">
                Khối lượng: {{ i.capacity }}
              </div>
            </div>
            <div class="qty">
              <Counter
                :model-value="i.quantity"
                @update:model-value="(val) => updateQuantity(i.id, val, i.capacity)"
              />
            </div>
            <div class="subtotal">
              {{ formatPrice(i.price * i.quantity) }}
            </div>
            <div class="ml-auto">
              <Icon
                icon="ion:trash-outline"
                class="w-5 h-5 cursor-pointer"
                @click="remove(i.id, i.capacity)"
              />
            </div>
          </div>
          <div class="summary text-right">
            Tổng tiền: <strong>{{ formatPrice(totalPrice) }}</strong>
          </div>
        </div>
      </div>
      <div class="lg:col-span-4">
        <div
          style="box-shadow: 0 0 20px rgba(0, 0, 0, 0.12)"
          class="bg-white p-6 rounded-lg lg:sticky top-6"
        >
          <h2 class="text-2xl font-bold mb-4">Tổng cộng</h2>
          <div class="flex justify-between items-center">
            <span>Tổng tiền</span>
            <span class="font-bold">{{ formatPrice(totalPrice) }}</span>
          </div>
          <NuxtLink
            to="/checkout"
            class="bg-blue-600 text-white rounded text-sm px-4 py-2 hover:bg-blue-600 transition-colors block mt-6 text-center"
            :class="{ disabled: items.length === 0 }"
          >
            Thanh toán
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Breadcrumb from '~/components/ui/Breadcrumb.vue';
import Counter from '~/components/ui/Counter.vue';
import { useCart } from '~/composables/useCart';
import { formatImage } from '~/utils/formatImage';

const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

function remove(id: string | number, capacity?: string) {
  removeFromCart(id, capacity);
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
}
</script>

<style scoped>
.empty {
  padding: 24px;
  text-align: center;
}
.row {
  display: grid;
  grid-template-columns: 80px 1fr 160px 140px 80px;
  align-items: center;
  gap: 12px;
  padding: 10px 0;
}
.row img {
  width: 80px;
  height: 80px;
  object-fit: cover;
  border-radius: 8px;
}
.qty :deep(.inline-flex) {
  justify-content: center;
}
.summary {
  text-align: right;
  padding: 12px 0;
}
.checkout.disabled {
  pointer-events: none;
  opacity: 0.6;
}
.remove {
  background: #ef4444;
  color: white;
  border: none;
  padding: 8px;
  border-radius: 6px;
  cursor: pointer;
}
@media (max-width: 1023px) {
  .row {
    grid-template-columns: 80px 1fr;
    grid-template-areas:
      'image info'
      'image qty'
      'image subtotal'
      'image remove';
    align-items: start;
  }
  .row > div:nth-child(1) {
    grid-area: image;
  }
  .row > div:nth-child(2) {
    grid-area: info;
  }
  .row > div:nth-child(3) {
    grid-area: qty;
  }
  .row > div:nth-child(4) {
    grid-area: subtotal;
    justify-self: end;
  }
  .row > button {
    grid-area: remove;
    width: fit-content;
    justify-self: end;
  }
  .qty {
    justify-self: start;
  }
}
</style>
