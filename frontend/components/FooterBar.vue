<template>
  <footer class="mt-10 border-t bg-white">
    <div class="max-w-[1060px] mx-auto px-5 py-6 text-sm text-gray-600 flex items-center justify-between">
      <div>
        <p class="font-medium text-gray-800">Hải Sản Lagi</p>
        <p>Địa chỉ: 123 Đường Biển, Lagi, Bình Thuận</p>
        <p>Điện thoại: 0909 000 000</p>
      </div>
      <nav class="flex gap-4">
        <NuxtLink to="/" class="hover:text-gray-900 transition-colors">Trang chủ</NuxtLink>
        <NuxtLink to="/checkout" class="hover:text-gray-900 transition-colors">Giỏ hàng</NuxtLink>
      </nav>
    </div>
  </footer>
</template>

<script setup lang="ts">
// Footer đơn giản với địa chỉ và liên kết nhanh
</script>