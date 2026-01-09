<template>
  <div
    class="bg-theme-surface py-2 border-b border-theme dark:bg-transparent dark:border-white/10 text-theme-primary dark:text-white"
  >
    <nav class="container" aria-label="Breadcrumb">
      <ol>
        <li v-for="(item, idx) in items" :key="idx" class="crumb">
          <template v-if="item.to && idx < items.length - 1">
            <NuxtLink :to="item.to">
              {{ item.label }}
            </NuxtLink>
          </template>
          <template v-else>
            <span class="text-theme-primary dark:text-white font-bold">{{ item.label }}</span>
          </template>
          <span v-if="idx < items.length - 1" class="">›</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ items: { label: string; to?: string }[] }>();
const items = computed(() => props.items || []);
</script>

<style scoped>
ol {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  padding: 0;
  margin: 0;
  list-style: none;
}
.crumb {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}
.link {
  text-decoration: none;
}
.link:hover {
  opacity: 0.5;
}
.current {
  @apply text-blue-600;
  font-weight: 600;
}
</style>
