<template>
  <div class="">
    <HeaderBar />
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
    <FooterBar />
  </div>
  <Toast />
</template>

<script lang="ts" setup>
  import AOS from 'aos'
  import 'aos/dist/aos.css'
  onMounted(() => {
    AOS.init({
      once: false,
      mirror: true,
    })
  })
</script>
