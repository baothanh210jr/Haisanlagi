<template>
  <div class="bg-gray-50 py-2 border-b border-gray-100">
    <nav class="container" aria-label="Breadcrumb">
      <ol>
        <li v-for="(item, idx) in items" :key="idx" class="crumb">
          <template v-if="item.to && idx < items.length - 1">
            <NuxtLink :to="item.to" class="link">
              {{ item.label }}
            </NuxtLink>
          </template>
          <template v-else>
            <span class="current">{{ item.label }}</span>
          </template>
          <span v-if="idx < items.length - 1" class="sep">›</span>
        </li>
      </ol>
    </nav>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{ items: { label: string; to?: string }[] }>()
  const items = computed(() => props.items || [])
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
    color: black;
  }
  .link {
    color: black;
    text-decoration: none;
  }
  .link:hover {
    opacity: 0.5;
  }
  .current {
    @apply text-blue-600;
    font-weight: 600;
  }
  .sep {
    color: #d1d5db;
  }
</style>
