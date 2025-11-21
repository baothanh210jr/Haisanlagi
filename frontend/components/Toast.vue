<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
      <div class="content">
        <img v-if="t.image" :src="t.image" alt="" class="thumb" />
        <span class="message">{{ t.text }}</span>
        <div class="actions">
          <NuxtLink
            v-if="t.actionTo && t.actionText"
            :to="t.actionTo"
            class="bg-blue-600 text-white rounded text-sm px-2 py-1 hover:bg-blue-600 transition-colors text-center"
          >
            {{ t.actionText }}
          </NuxtLink>
          <button class="close" @click="remove(t.id)">
            <Icon icon="mdi:close" width="20" height="20" />
          </button>
        </div>
      </div>
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
    max-width: 520px;
    border-radius: 16px;
    overflow: hidden;
    border: 1px solid transparent;
    box-shadow: 0 20px 45px -20px rgba(24, 94, 224, 0.45);
    padding: 18px 18px 18px 20px;
    backdrop-filter: blur(12px);
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
    background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 35%, #bfdbfe 100%);
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
    color: rgba(232, 61, 61, 0.7);
    z-index: 1;
  }
  .close:hover {
    color: rgba(255, 0, 0, 0.7);
  }
</style>
