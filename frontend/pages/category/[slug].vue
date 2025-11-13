<template>
  <div class="container">
    <Breadcrumb
      :items="[
        { label: 'Trang chủ', to: '/' },
        { label: 'Danh mục' },
        { label: category?.name || slug },
      ]"
    />

    <div class="grid grid-cols-4 gap-4">
      <!-- Use ProductCard for nicer product UI -->
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <Pagination :page="page" :page-count="pageCount" @update:page="(val) => (page = val)" />
  </div>
</template>

<script setup lang="ts">
  import { onMounted, watch } from 'vue'
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
  console.log('🚀 ~ [slug].vue:39 ~ products:', products)
  await ensureProducts()

  onMounted(() => {
    ensureProducts(true)
  })
  watch(category, () => {
    ensureProducts(true)
  })
  watch(page, () => {
    ensureProducts()
  })
</script>
