<template>
  <div class="toast-container" aria-live="polite" aria-atomic="true">
    <div v-for="t in toasts" :key="t.id" class="toast" :class="t.type">
      <div class="content">
        <span class="message">{{ t.text }}</span>
        <div class="actions">
          <NuxtLink v-if="t.actionTo && t.actionText" :to="t.actionTo" class="btn">{{ t.actionText }}</NuxtLink>
          <button class="close" @click="remove(t.id)">×</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  max-width: 360px;
  background: #ffffff;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  box-shadow: 0 6px 16px rgba(0,0,0,0.08);
  padding: 10px 12px;
}
.toast.success { border-color: #10b981; }
.toast.error { border-color: #ef4444; }
.content { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
.message { font-size: 14px; color: #111827; }
.actions { display: flex; align-items: center; gap: 8px; }
.btn { background: #f59e0b; color: #fff; padding: 6px 10px; border-radius: 6px; font-size: 13px; text-decoration: none; }
.btn:hover { background: #d97706; }
.close { background: transparent; border: none; font-size: 18px; cursor: pointer; color: #6b7280; }
.close:hover { color: #111827; }
</style>