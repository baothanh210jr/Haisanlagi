<template>
  <footer :class="footerTone" class="border-t shadow-md">
    <div
      class="container py-6 text-sm flex flex-col sm:flex-row items-center justify-between gap-3"
    >
      <div>© {{ currentYear }} Làng chài 86</div>
      <div class="flex items-center gap-3">
        <NuxtLink to="/orders" class="hover:opacity-80"> Đơn hàng </NuxtLink>
        <NuxtLink to="/cart" class="hover:opacity-80"> Giỏ hàng </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
const { theme } = useTheme();
const footerTone = computed(() =>
  theme.value === 'light'
    ? 'bg-theme-surface border-theme'
    : 'bg-[rgba(7,16,36,0.82)] border-white/10'
);
</script>
