<template>
  <Teleport to="body">
    <transition name="drawer-fade">
      <div v-if="drawerToast" class="drawer-root">
        <div class="drawer-overlay" @click="closeDrawer" />

        <div class="drawer-panel">
          <div class="drawer-header">
            <div>
              <p class="drawer-title">Đã thêm vào giỏ hàng của bạn</p>
              <p class="drawer-desc">
                {{ drawerToast.text }}
              </p>
            </div>
            <button class="close-btn" @click="closeDrawer">
              <Icon icon="mdi:close" class="w-5 h-5" />
            </button>
          </div>
          <div v-if="cartItems.length" class="drawer-items">
            <div v-for="item in cartItems" :key="`${item.id}-${item.capacity}`" class="drawer-item">
              <img
                :src="formatImage(item, { width: 60, height: 60 }) || fallbackImage"
                alt=""
                class="drawer-thumb"
              />
              <div class="drawer-info">
                <p class="drawer-product">
                  {{ item.name }}
                </p>
                <p class="drawer-meta">
                  <span v-if="item.capacity">{{ item.capacity }}</span>
                  <span v-if="item.capacity">·</span>
                  x{{ item.quantity }}
                </p>
              </div>
              <span class="drawer-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div v-else class="drawer-empty">Chưa có sản phẩm nào trong giỏ hàng.</div>
          <NuxtLink
            v-if="drawerToast.actionTo"
            :to="drawerToast.actionTo"
            class="drawer-link"
            @click="closeDrawer"
          >
            {{ drawerToast.actionText || 'Đi tới giỏ hàng' }}
          </NuxtLink>
        </div>
      </div>
    </transition>
  </Teleport>

  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div v-for="t in regularToasts" :key="t.id" class="toast shadow-lg" :class="t.type">
      <NuxtLink :to="t.actionTo" class="p-2">
        <div class="flex items-center gap-2 mb-2">
          <Icon icon="lets-icons:check-fill" width="30" height="30" class="text-green-600" />
          <span class="text-sm">Đã thêm vào giỏ hàng thành công!</span>
        </div>
        <div class="flex items-center gap-4 relative">
          <img
            v-if="t.image"
            :src="formatImage(t, { width: 48, height: 48 })"
            alt=""
            class="thumb"
          />
          <span class="message">{{ t.text }}</span>
        </div>
      </NuxtLink>
      <button class="cancel" @click="remove(t.id)">
        <Icon icon="mdi:close" width="20" height="20" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';

import { computed } from 'vue';
import { useCart } from '~/composables/useCart';

import { useToast } from '~/composables/useToast';
import { formatPrice } from '~/utils/formatPrice';

const fallbackImage = '/placeholder/fish.svg';
const { toasts, remove } = useToast();
const { items } = useCart();

const drawerToast = computed(() => {
  const reversed = [...toasts.value].reverse();
  return reversed.find((t) => t.layout === 'drawer');
});
const regularToasts = computed(() => toasts.value.filter((t) => (t.layout ?? 'toast') === 'toast'));
const cartItems = computed(() => items.value.slice().reverse());

function closeDrawer() {
  if (drawerToast.value) remove(drawerToast.value.id);
}
</script>

<style scoped>
.toast-container {
  position: fixed;
  top: 16px;
  right: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  z-index: 1000;
}

.toast {
  position: relative;
  min-width: 280px;
  max-width: 400px;
  overflow: hidden;
  padding: 15px;
  background-color: white;
  border-radius: 4px;
}

.toast::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.95;
  z-index: 0;
}

.toast.success {
  border-color: rgba(30, 64, 175, 0.45);
}

.toast.error {
  border-color: rgba(239, 68, 68, 0.45);
}

.toast.error::before {
  background: linear-gradient(135deg, #fee2e2 0%, #fecaca 40%, #fca5a5 100%);
}

.thumb {
  width: 48px;
  height: 48px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.message {
  font-size: 14px;
  color: #0f172a;
  font-weight: 600;
  line-height: 1.4;
}

.cancel {
  position: absolute;
  top: 4px;
  right: 8px;
  color: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.drawer-root {
  position: fixed;
  inset: 0;
  z-index: 1400;
  display: flex;
  justify-content: flex-end;
}

.drawer-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.55);
}

.drawer-panel {
  position: relative;
  z-index: 1;
  width: min(420px, 100%);
  height: 100%;
  background: #fff;
  padding: 32px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.drawer-title {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.drawer-desc {
  color: #4b5563;
  font-size: 0.9rem;
}

.close-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  width: 20px;
  height: 20px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #dc2626;
}

.drawer-items {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.drawer-item {
  display: flex;
  gap: 12px;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #e4e5e6;
}

.drawer-thumb {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  object-fit: cover;
  border: 1px solid #e5e7eb;
}

.drawer-info {
  flex: 1;
  min-width: 0;
}

.drawer-product {
  font-weight: 600;
  color: #111827;
}

.drawer-meta {
  font-size: 0.85rem;
  color: #6b7280;
}

.drawer-price {
  font-weight: 600;
  color: #0f172a;
}

.drawer-empty {
  padding: 24px;
  text-align: center;
  color: #94a3b8;
  background: #f8fafc;
  border-radius: 8px;
}

.drawer-link {
  display: block;
  width: 100%;
  text-align: center;
  padding: 14px;
  border: 1px solid #0f172a;
  border-radius: 999px;
  font-weight: 600;
  letter-spacing: 0.05em;
}

.drawer-fade-enter-active,
.drawer-fade-leave-active {
  transition: opacity 0.4s ease;
}

.drawer-fade-enter-from,
.drawer-fade-leave-to {
  opacity: 0;
}

.drawer-fade-enter-active .drawer-overlay,
.drawer-fade-leave-active .drawer-overlay {
  transition: all 0.2s cubic-bezier(1, 0.5, 0.8, 1);
}

.drawer-fade-enter-active .drawer-panel,
.drawer-fade-leave-active .drawer-panel {
  transition:
    transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
    opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.drawer-fade-enter-from .drawer-overlay,
.drawer-fade-leave-to .drawer-overlay {
  opacity: 0;
}

.drawer-fade-enter-from .drawer-panel,
.drawer-fade-leave-to .drawer-panel {
  transform: translateX(100%);
  opacity: 0;
}
</style>
