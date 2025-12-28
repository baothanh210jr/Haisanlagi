<template>
  <div>
    <HomeHeroSection />
    <HomeCategories />
    <HomeHotProductsSection class="mt-10 md:mt-14" />
    <HomeTestimonialsSection />
    <HomeContactSection />
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';

useHead({
  title: 'Làng Chài 86 – Hải sản tươi sống Bình Thuận | Giao nhanh trong ngày',
  meta: [
    {
      name: 'description',
      content:
        'Làng Chài 86 chuyên cung cấp hải sản tươi sống tại Bình Thuận: tôm, cá, mực, cua ghẹ, hải sản chế biến. Tươi từ nguồn, giao nhanh trong ngày, tư vấn miễn phí.'
    },
    {
      name: 'keywords',
      content:
        'hải sản tươi sống, hải sản Bình Thuận, tôm cá mực cua ghẹ, mua hải sản online, làng chài 86'
    },

    // OpenGraph
    { property: 'og:title', content: 'Làng Chài 86 – Hải sản tươi sống Bình Thuận' },
    {
      property: 'og:description',
      content: 'Tôm, cá, mực, cua ghẹ tươi ngon từ nguồn. Giao nhanh trong ngày, chất lượng cao.'
    },
    { property: 'og:image', content: 'code-space.site/thumbnail-social.jpg' },
    { property: 'og:type', content: 'website' },
    { property: 'og:locale', content: 'vi_VN' },
    { property: 'og:url', content: 'https://code-space.site' }
  ],
  link: [{ rel: 'canonical', href: 'https://code-space.site' }]
});

onMounted(() => {
  const headerEl = document.querySelector('header');
  const h =
    headerEl && headerEl instanceof HTMLElement ? headerEl.getBoundingClientRect().height : 0;
});
</script>
