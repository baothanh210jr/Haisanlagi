<template>
  <div
    class="toast-container"
    aria-live="polite"
    aria-atomic="true"
  >
    <div
      v-for="t in toasts"
      :key="t.id"
      class="toast shadow-lg"
      :class="t.type"
    >
      <NuxtLink
        :to="t.actionTo"
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
        <div class="content">
          <img
            v-if="t.image"
            :src="t.image"
            alt=""
            class="thumb"
          >
        
          <span class="message">{{ t.text }}</span>
          <div class="flex items-center gap-8">
            <button
              class="close"
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
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { Icon } from '@iconify/vue'
  import { useToast } from '~/composables/useToast'
  const { toasts, remove } = useToast()
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
    padding: 12px 12px 12px 15px;
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
  .toast.success::before {
  }
  .toast.error {
    border-color: rgba(239, 68, 68, 0.45);
  }
  .toast.error::before {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 40%, #fca5a5 100%);
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 0 10px;
    position: relative;
    z-index: 1;
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
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .close {
    position: absolute;
    top: -14px;
    right: -10px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    @apply text-red-600;
    z-index: 1;
  }
  .close:hover {
    color: rgba(255, 0, 0, 0.7);
  }
</style>
