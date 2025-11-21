<template>
  <div>
    <HomeHeroSection />
    <HomeCategories />
    <HomeHotProductsSection />
    <HomeTestimonialsSection />
    <HomeContactSection />
  </div>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'

  useHead({
    title: 'Fresh Seafood - From Boat to Your Home',
    meta: [
      {
        name: 'description',
        content:
          "Premium quality seafood delivered fresh to your doorstep. Experience the ocean's finest catch with our sustainable fishing practices.",
      },
    ],
  })

  onMounted(() => {
    const headerEl = document.querySelector('header')
    const h =
      headerEl && headerEl instanceof HTMLElement ? headerEl.getBoundingClientRect().height : 0
    document.documentElement.style.setProperty('--header-h', `${h}px`)
  })
</script>
