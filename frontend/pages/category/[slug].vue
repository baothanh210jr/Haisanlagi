<template>
  <div class="container">
    <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: 'Danh mục' }, { label: category?.name || slug }]" />

    <div class="grid">
      <!-- Use ProductCard for nicer product UI -->
      <ProductCard
        v-for="p in products"
        :key="p.id"
        :product="p"
      />
    </div>
    <Pagination
      :page="page"
      :page-count="pageCount"
      @update:page="val => page = val"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useCategoryDetail } from '~/composables/useCategoryDetail'
import { useCategoryProducts } from '~/composables/useCategoryProducts'
import ProductCard from '~/components/ui/ProductCard.vue'
import Pagination from '~/components/ui/Pagination.vue'
import Breadcrumb from '~/components/ui/Breadcrumb.vue'


const route = useRoute()


const slug = route.params.slug as string

const page = ref<number>(Number(route.query.page || 1))

// Ensure category detail is loaded and cached
const { category, ensureCategory } = useCategoryDetail(slug)
await ensureCategory()

// Use cached category products with TTL instead of useAsyncData
const { products, pageCount, ensureProducts } = useCategoryProducts(category, page, 20, 60_000)
await ensureProducts()

onMounted(() => { ensureProducts(true) })
watch(category, () => { ensureProducts(true) })
watch(page, () => { ensureProducts() })


</script>


<style scoped>
/* Dùng Tailwind container, bỏ CSS container cứng */
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
</style>