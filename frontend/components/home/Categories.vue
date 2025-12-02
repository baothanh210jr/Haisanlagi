<template>
  <!-- Category Grid -->
  <div class="container bg-gradient-to-r from-secondary/20 to-accent rounded-2xl p-4 md:p-6">
    <div class="flex items-center justify-between mb-6">
      <h2 class="text-2xl font-bold">
        Danh mục nổi bật
      </h2>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
      <NuxtLink
        v-for="cat in categories"
        :key="cat.id"
        :to="{ name: 'category-slug', params: { slug: cat.slug } }"
        class="group bg-white transition-all border rounded-xl p-4 flex flex-col items-center hover:shadow-lg text-center"
      >
        <div
          class="relative w-12 h-12 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center mb-2"
        >
          <div class="text-xs absolute top-1 right-2">
            🫧
          </div>
          <div class="text-xs absolute top-1/2 left-2">
            🫧
          </div>
          <span class="text-xl">{{ cat.icon }}</span>
        </div>
        <span class="text-sm font-medium line-clamp-2">
          {{ cat.name }}
        </span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
  const { categories, ensureCategories } = useCategories(8)
  onMounted(() => {
    ensureCategories()
  })
</script>
