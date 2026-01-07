<template>
  <Teleport to="body">
    <transition name="drawer-fade">
      <div
        v-if="drawerToast"
        class="drawer-root"
      >
        <div
          class="drawer-overlay"
          @click="closeDrawer"
        />

        <div class="drawer-panel">
          <div class="drawer-header">
            <div class="drawer-header-content">
              <p class="drawer-title">
                ĐÃ THÊM VÀO GIỎ HÀNG CỦA BẠN
              </p>
              <Icon
                icon="lets-icons:check-fill"
                class="check-icon"
              />
            </div>
          </div>
          <div
            v-if="cartItems.length"
            class="drawer-items"
          >
            <div
              v-for="item in cartItems"
              :key="`${item.id}-${item.capacity}`"
              class="drawer-item"
            >
              <img
                :src="formatImage(item, { width: 80, height: 80 }) || fallbackImage"
                alt=""
                class="drawer-thumb"
              >
              <div class="drawer-info">
                <p class="drawer-product">
                  {{ item.name }}
                </p>
                <p class="drawer-meta">
                  <span v-if="item.capacity">{{ item.capacity }}</span>
                  <span v-if="item.capacity"> x</span>
                  <span v-if="!item.capacity">x</span>{{ item.quantity }}
                </p>
              </div>
              <span class="drawer-price">{{ formatPrice(item.price * item.quantity) }}</span>
            </div>
          </div>
          <div
            v-else
            class="drawer-empty"
          >
            Chưa có sản phẩm nào trong giỏ hàng.
          </div>
          <NuxtLink
            v-if="drawerToast.actionTo"
            :to="drawerToast.actionTo"
            class="drawer-link"
            @click="closeDrawer"
          >
            <Icon
              icon="mdi:cart-plus"
              class="cart-icon"
            />
            <span>{{ drawerToast.actionText || 'Xem giỏ hàng' }}</span>
            <Icon
              icon="mdi:sparkles"
              class="sparkle-icon"
            />
          </NuxtLink>
        </div>
      </div>
    </transition>
  </Teleport>

  <div
    class="toast-container"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      v-for="t in regularToasts"
      :key="t.id"
      class="toast shadow-lg"
      :class="t.type"
    >
      <NuxtLink
        :to="t.actionTo"
        class="p-2"
      >
        <div class="flex items-center gap-2 mb-2">
          <Icon
            icon="lets-icons:check-fill"
            width="30"
            height="30"
            class="text-green-600"
          />
          <span class="text-sm">Đã thêm vào giỏ hàng thành công!</span>
        </div>
        <div class="flex items-center gap-4 relative">
          <img
            v-if="t.image"
            :src="formatImage(t, { width: 48, height: 48 })"
            alt=""
            class="thumb"
          >
          <span class="message">{{ t.text }}</span>
        </div>
      </NuxtLink>
      <button
        class="cancel"
        @click="remove(t.id)"
      >
        <Icon
          icon="mdi:close"
          width="20"
          height="20"
        />
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
import { formatImage } from '~/utils/formatImage';

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
  align-items: flex-end;
}

.toast {
  position: relative;
  min-width: 280px;
  max-width: 400px;
  overflow: hidden;
  padding: 15px;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 6px 18px rgba(15, 23, 42, 0.12);
}

.toast::before {
  content: '';
  position: absolute;
  inset: 0;
  opacity: 0.95;
  z-index: 0;
}

.toast.success {
  border-color: rgba(30, 64, 175, 0.15);
}

.toast.error {
  border-color: rgba(239, 68, 68, 0.15);
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
  display: flex;
  align-items: center;
  justify-content: center;
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
  background: var(--background-primary);
  padding: 32px 32px 40px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.1);
  transform: translateX(0);
  border: 1px solid var(--theme-border);
}

:root.dark .drawer-panel {
  background: linear-gradient(180deg, #0a1c2d 0%, #0f2a3f 50%, #0a1c2d 100%);
  box-shadow: -4px 0 16px rgba(0, 0, 0, 0.3);
}

.drawer-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
}

.drawer-header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.drawer-title {
  font-size: 1.1rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--theme-text);
  margin: 0;
}

.check-icon {
  width: 24px;
  height: 24px;
  color: #22c55e;
  flex-shrink: 0;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: 32px;
  height: 32px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--theme-text);
  background: rgba(0, 0, 0, 0.05);
  transition: background 0.2s;
}

.close-btn:hover {
  background: rgba(0, 0, 0, 0.1);
}

:root.dark .close-btn {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

:root.dark .close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.drawer-items {
  flex: 1;
  overflow-y: auto;
  padding-right: 4px;
}

.drawer-item {
  display: flex;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid var(--theme-border);
  align-items: center;
}

.drawer-thumb {
  width: 80px;
  height: 80px;
  border-radius: 12px;
  object-fit: cover;
  border: 1px solid var(--theme-border);
  flex-shrink: 0;
}

.drawer-info {
  flex: 1;
  min-width: 0;
}

.drawer-product {
  font-weight: 600;
  color: var(--theme-text);
  font-size: 0.95rem;
  margin-bottom: 4px;
}

.drawer-meta {
  font-size: 0.85rem;
  color: var(--theme-muted);
}

.drawer-price {
  font-weight: 700;
  font-size: 1rem;
  background: linear-gradient(180deg, #ffd166, #ffb347);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 12px rgba(255, 179, 71, 0.3);
  white-space: nowrap;
}

.drawer-empty {
  padding: 24px;
  text-align: center;
  color: var(--theme-muted);
  background: var(--theme-subtle);
  border-radius: 8px;
}

.drawer-link {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  text-align: center;
  padding: 16px;
  background: linear-gradient(180deg, #ffd166, #ffb347);
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  color: #0a1c2d;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(255, 179, 71, 0.3);
}

.drawer-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(255, 179, 71, 0.4);
}

.cart-icon {
  width: 20px;
  height: 20px;
}

.sparkle-icon {
  width: 18px;
  height: 18px;
  animation: sparkle 2s ease-in-out infinite;
}

@keyframes sparkle {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.7;
    transform: scale(1.1);
  }
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

/* Responsive tweaks */
@media (max-width: 640px) {
  .toast-container {
    top: auto;
    bottom: 16px;
    left: 50%;
    right: auto;
    transform: translateX(-50%);
    align-items: center;
    padding: 0 8px;
  }

  .toast {
    min-width: auto;
    width: calc(100% - 32px);
    max-width: 720px;
    padding: 12px;
    border-radius: 12px;
  }

  .thumb {
    width: 40px;
    height: 40px;
    border-radius: 8px;
  }

  .message {
    font-size: 13px;
  }

  .drawer-root {
    justify-content: center;
    align-items: flex-end;
  }

  .drawer-panel {
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 80vh;
    border-radius: 16px 16px 0 0;
    padding: 24px 20px 28px;
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.1);
    position: absolute;
    right: 0;
    bottom: 0;
  }

  :root.dark .drawer-panel {
    box-shadow: 0 -8px 24px rgba(0, 0, 0, 0.4);
  }

  .drawer-title {
    font-size: 0.95rem;
  }

  .drawer-thumb {
    width: 60px;
    height: 60px;
  }

  .drawer-overlay {
    backdrop-filter: blur(2px);
  }
}
</style>
