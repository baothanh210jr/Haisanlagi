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
            <Icon icon="mdi:close" width="16" height="16" />
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
    min-width: 260px;
    max-width: 500px;
    background: #ffffff;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
    padding: 20px 12px 12px 12px;
  }
  .toast.success {
    border-color: #1b98e0;
  }
  .toast.error {
    border-color: #ef4444;
  }
  .content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
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
    color: #111827;
    font-weight: 500;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .close {
    position: absolute;
    top: 6px;
    right: 6px;
    background: transparent;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #6b7280;
  }
  .close:hover {
    color: #111827;
  }
</style>
