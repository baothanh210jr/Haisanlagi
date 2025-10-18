<template>
  <div class="container">
    <h1>Giỏ hàng</h1>
    <div v-if="items.length === 0" class="empty">Chưa có sản phẩm nào trong giỏ.</div>
    <div v-else>
      <div v-for="i in items" :key="i.id + ':' + (i.capacity ?? 'base')" class="row">
        <!-- <img v-if="i.image" :src="i.image" :alt="i.name" /> -->
         <div class="overflow-hidden">
          <img :src="formatImage(
            i, { width: 1200, height: 800 })" 
            :alt="i.name" 
            class="transition-transform duration-200 ease-out hover:scale-105"
          />
        </div>
        <div class="info">
          <strong>{{ i.name }}</strong>
          <div>
            Giá: {{ formatPrice(i.price) }}
          </div>
        </div>
        <div class="qty">
          <!-- Replace plain input with Counter component -->
          <Counter :model-value="i.quantity" @update:model-value="val => updateQuantity(i.id, val, i.capacity)" />
        </div>
        <div class="subtotal">{{ formatPrice(i.price * i.quantity) }}</div>
        <button class="remove" @click="remove(i.id, i.capacity)">Xóa</button>
      </div>
      <div class="summary">
        Tổng tiền: <strong>{{ formatPrice(totalPrice) }}</strong>
      </div>
    </div>
    <div class="actions">
      <NuxtLink to="/checkout" class="checkout" :class="{disabled: items.length === 0}">Thanh toán</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
import Counter from '~/components/ui/Counter.vue'

const { items, totalPrice, updateQuantity, removeFromCart } = useCart()

function onQty(id: string | number, e: Event) {
  const val = Number((e.target as HTMLInputElement).value)
  updateQuantity(id, val)

}

function remove(id: string | number, capacity?: number) {
  removeFromCart(id, capacity)
}

function formatPrice(n: number) {
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n)
}

</script>

<style scoped>
.container { max-width: 1060px; margin: 0 auto; padding: 24px; }
.empty { padding: 24px; text-align: center; }
.row { display: grid; grid-template-columns: 80px 1fr 160px 140px 80px; align-items: center; gap: 12px; padding: 10px 0; border-bottom: 1px solid #eee; }
.row img { width: 80px; height: 80px; object-fit: cover; border-radius: 8px; }
.qty :deep(.inline-flex) { width: 100%; justify-content: center; }
.summary { text-align: right; padding: 12px 0; }
.actions { margin-top: 16px; display: flex; justify-content: flex-end; }
.checkout { padding: 10px 16px; background: #16a34a; color: white; border-radius: 8px; text-decoration: none; }
.checkout.disabled { pointer-events: none; opacity: 0.6; }
.remove { background: #ef4444; color: white; border: none; padding: 8px; border-radius: 6px; cursor: pointer; }
</style>