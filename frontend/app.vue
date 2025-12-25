<template>
  <div class="min-h-screen flex flex-col background-primary">
    <HeaderBar />
    <NuxtLayout>
      <NuxtPage :key="$route.fullPath" />
    </NuxtLayout>
    <FooterBar class="mt-auto" />
  </div>
  <Toast />
</template>

<script lang="ts" setup>
import AOS from 'aos';
import 'aos/dist/aos.css';
onMounted(() => {
  AOS.init({
    once: false,
    mirror: true
  });
});
</script>
