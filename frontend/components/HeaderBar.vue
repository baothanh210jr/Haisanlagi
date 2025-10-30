<template>
  <header class="bg-primary text-white">
    <div class="container py-3 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <!-- <img src="/logo.svg" alt="Haisan Lagi" class="h-8 w-8" /> -->
        <span class="font-semibold">Làng chài 86</span>
      </NuxtLink>
      <nav class="flex items-center gap-4">
        <NuxtLink
          to="/cart"
          class="relative flex items-center gap-4"
        >
          <span>Giỏ hàng</span>
          <Icon
            icon="mdi:cart"
            width="24"
            height="24"
          />
          <span
            v-if="cartCount > 0"
            class="absolute -top-2 -right-3 bg-yellow-400 text-primary text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
          >{{ cartCount }}</span>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useCart } from '~/composables/useCart'

const { items } = useCart()
const cartCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))
</script>