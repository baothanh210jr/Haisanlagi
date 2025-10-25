<template>
  <footer class="bg-gray-100">
    <div class="container py-6 text-sm text-gray-600 flex items-center justify-between">
      <div>© 2024 Hải Sản Lagi</div>
      <div class="flex items-center gap-3">
        <NuxtLink
          to="/orders"
          class="hover:opacity-80"
        >
          Đơn hàng
        </NuxtLink>
        <NuxtLink
          to="/cart"
          class="hover:opacity-80"
        >
          Giỏ hàng
        </NuxtLink>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer đơn giản với địa chỉ và liên kết nhanh
</script>