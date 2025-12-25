<template>
  <footer class="bg-gray-100">
    <div
      class="container py-6 text-sm text-gray-600 flex flex-col sm:flex-row items-center justify-between gap-3"
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
</script>
