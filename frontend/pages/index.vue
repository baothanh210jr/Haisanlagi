<template>
  <div class="container">
    <HeroSlider v-if="heroProducts?.length" :products="heroProducts" />
    <section class="mt-5">
      <h2>Danh mục</h2>
      <div class="categories">
        <NuxtLink v-for="cat in categories" :key="cat.id" :to="`/category/${cat.slug}`" class="category-card">
          <span>{{ cat.name }}</span>
        </NuxtLink>
      </div>
    </section>

    <section>
      <h2>Sản phẩm mới</h2>
      <div class="grid">
        <!-- Use ProductCard for nicer product UI -->
        <ProductCard v-for="p in products" :key="p.id" :product="p" />
      </div>
      <Pagination :page="page" :page-count="pageCount" @update:page="val => page = val" />
    </section>
  </div>
</template>

<script setup lang="ts">
import Pagination from '~/components/ui/Pagination.vue'
import ProductCard from '~/components/ui/ProductCard.vue'
import HeroSlider from '~/components/ui/HeroSlider.vue'


import { useCategories } from '~/composables/useCategories'
import { useHomeProducts } from '~/composables/useHomeProducts'
import { useHomeSlides } from '~/composables/useHomeSlides'
import { watch } from 'vue'

const limit = 12
let page = ref(1)

const { categories, ensureCategories } = useCategories()
await ensureCategories()

const { products, pageCount, ensureProducts } = useHomeProducts(page, limit)
await ensureProducts()

// Refetch when page changes (use cache if already loaded)
watch(page, () => { ensureProducts() })

const { heroProducts, ensureSlides } = useHomeSlides(5)
await ensureSlides()


</script>

<style scoped>
.container { max-width: 1060px; margin: 0 auto; padding: 24px; }
.hero { padding: 24px; text-align: center; }
.categories { display: grid; grid-template-columns: repeat(6, 1fr); gap: 12px; }
.category-card { display: inline-flex; align-items: center; justify-content: center; padding: 12px; border: 1px solid #eee; border-radius: 12px; text-decoration: none; color: #111827; background: #fff; }
.grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); }
}
section { margin-bottom: 24px; }
h2 { font-size: 18px; font-weight: 600; margin-bottom: 12px; }
</style>