<template>
  <header class="bg-gradient-to-r from-amber-500 to-yellow-500 text-white">
    <div class="max-w-[1060px] mx-auto px-5 py-3 flex items-center justify-between">
      <NuxtLink to="/" class="font-bold tracking-wide text-xl">Hải Sản 86</NuxtLink>
      <div class="flex items-center gap-4">
        <NuxtLink to="/orders" class="hover:opacity-90 transition-opacity text-sm font-semibold">Đơn hàng của tôi</NuxtLink>
        <NuxtLink to="/cart" class="relative flex items-center gap-2 hover:opacity-90 transition-opacity">
          <span class="relative inline-flex">
            <span class="text-lg">🛒</span>
            <ClientOnly>
              <span class="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-white text-amber-700 text-xs px-1 min-w-[18px] h-[18px] leading-none font-semibold">{{ totalItems }}</span>
              <template #fallback>
                <span class="absolute -top-2 -right-2 inline-flex items-center justify-center rounded-full bg-white text-amber-700 text-xs px-1 min-w-[18px] h-[18px] leading-none">0</span>
              </template>
            </ClientOnly>
          </span>
          <span>Giỏ hàng</span>
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCart } from '~/composables/useCart'
const { totalItems } = useCart()
</script>