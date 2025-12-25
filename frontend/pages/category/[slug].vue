<template>
  <Breadcrumb :items="[{ label: 'Trang chủ', to: '/' }, { label: category?.name || slug }]" />
  <div class="container py-10">
    <div class="grid grid-cols-5 gap-4">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>
    <div class="flex justify-center">
      <Pagination :page="page" :page-count="pageCount" @update:page="(val) => (page = val)" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router';
import Breadcrumb from '~/components/ui/Breadcrumb.vue';
import Pagination from '~/components/ui/Pagination.vue';
import ProductCard from '~/components/ui/ProductCard.vue';
import { useCategoryDetail } from '~/composables/useCategoryDetail';
import { useCategoryProducts } from '~/composables/useCategoryProducts';

const route = useRoute();

const slug = route.params.slug as string;

const page = ref<number>(Number(route.query.page || 1));

// Ensure category detail is loaded and cached
const { category, ensureCategory } = useCategoryDetail(slug);
await ensureCategory();
console.log('🚀 ~ [slug].vue:29 ~ category:', category.value);

const { products, pageCount, ensureProducts } = useCategoryProducts(category, page, 20, 60_000);
await ensureProducts();
</script>
