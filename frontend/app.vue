<template>
  <div class="min-h-screen flex flex-col bg-theme-surface">
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
const { theme } = useTheme();

useHead(() => ({
  htmlAttrs: {
    class: theme.value === 'dark' ? 'dark' : '',
    'data-theme': theme.value
  }
}));

onMounted(() => {
  AOS.init({
    once: false,
    mirror: true
  });
});
</script>
