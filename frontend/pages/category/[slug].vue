<template>
  <div class="container py-6 space-y-6">
    <Breadcrumb
      :items="[
        { label: 'Trang chủ', to: '/' },
        { label: 'Danh mục' },
        { label: category?.name || slug },
      ]"
    />

    <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div class="flex justify-center">
      <Pagination :page="page" :page-count="pageCount" @update:page="(val) => (page = val)" />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useRoute } from 'vue-router'
  import Breadcrumb from '~/components/ui/Breadcrumb.vue'
  import Pagination from '~/components/ui/Pagination.vue'
  import ProductCard from '~/components/ui/ProductCard.vue'
  import { useCategoryDetail } from '~/composables/useCategoryDetail'
  import { useCategoryProducts } from '~/composables/useCategoryProducts'

  const route = useRoute()

  const slug = route.params.slug as string

  const page = ref<number>(Number(route.query.page || 1))

  // Ensure category detail is loaded and cached
  const { category, ensureCategory } = useCategoryDetail(slug)
  await ensureCategory()

  const { products, pageCount, ensureProducts } = useCategoryProducts(category, page, 20, 60_000)
  await ensureProducts()

  watch(category, () => {
    ensureProducts()
  })
  watch(page, () => {
    ensureProducts()
  })
</script>
