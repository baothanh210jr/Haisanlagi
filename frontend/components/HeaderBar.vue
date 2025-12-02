<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-50 transition-all duration-300 ease-out will-change-transform flex items-center py-3 md:py-4 bg-white backdrop-blur-sm shadow-sm"
    :class="[showHeader ? 'translate-y-0 ' : '-translate-y-full']"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="container flex items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-3 flex-shrink-0"
      >
        <div class="w-auto h-10">
          <img
            src="/logo-01.png"
            alt="Haisan Lagi"
            class="h-10 w-full object-cover scale-150"
          >
        </div>
      </NuxtLink>

      <!-- Search bar -->
      <div class="flex-1 max-w-md mx-4">
        <div class="relative">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Tìm kiếm..."
            class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          >
          <button
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white p-1 rounded"
          >
            <Icon
              icon="mdi:magnify"
              width="18"
              height="18"
            />
          </button>
        </div>
      </div>
      <div class="flex items-center gap-8">
        <!-- Hotline -->
        <div class="hidden sm:flex items-center gap-3">
          <div class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-600 text-white">
            <Icon
              icon="mdi-light:phone"
              width="20"
              height="20"
            />
          </div>
          <div class="text-black font-medium">
            <span class="block text-xs text-gray-600">Hỗ trợ khách hàng</span>
            <span class="text-sm font-semibold">0367 497 642</span>
          </div>
        </div>
        <!-- Cart -->
        <div class="flex items-center gap-2 sm:gap-4">
          <NuxtLink
            :to="{
              name: 'cart',
            }"
            class="relative"
          >
            <div
              class="w-10 h-10 relative rounded-full bg-blue-600 text-white flex items-center justify-center"
            >
              <Icon
                icon="famicons:cart-outline"
                width="25"
                height="25"
              />
              <span
                v-if="cartCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
              >{{ cartCount }}</span>
            </div>
          </NuxtLink>
          <span class="text-sm font-medium hidden sm:inline">Giỏ hàng</span>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
  import { useState } from '#app'
  import { Icon } from '@iconify/vue'
  import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'
  import { useCart } from '~/composables/useCart'

  const { items } = useCart()
  const cartCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))

  // Search functionality
  const searchQuery = ref('')

  // Categories dropdown state
  const categoryBtnRef = ref<HTMLElement | null>(null)
  const catPanelWidth = ref<number>(280)
  const showCategoryPanel = ref<boolean>(false)
  const manualCategoryOpen = ref<boolean>(false)
  const heroInView = ref<boolean>(true)
  const catBtnWidthState = useState<number>('category_btn_width', () => 280)
  const route = useRoute()
  const isHomeRoute = computed(() => route.path === '/' || (route.name as any) === 'index')

  // Scroll-based header behavior
  const headerRef = ref<HTMLElement | null>(null)
  const showHeader = ref(true)
  const atTop = ref(true)
  const hovering = ref(false)
  const activeSection = ref<string>('')
  const menuItems = [
    { id: 'home', label: 'Home' },
    { id: 'best-selling', label: 'Best Selling' },
    { id: 'products', label: 'Products' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'how-we-ship', label: 'How We Ship' },
  ]
  const navRef = ref<HTMLElement | null>(null)
  const menuRefs = ref<HTMLElement[]>([])
  const indicatorLeft = ref(0)
  const indicatorWidth = ref(0)

  function updateIndicator() {
    let idx = menuItems.findIndex((m) => m.id === activeSection.value)
    if (idx < 0) idx = 0
    const el = menuRefs.value[idx]
    const nav = navRef.value
    if (el && nav) {
      const rect = el.getBoundingClientRect()
      const navRect = nav.getBoundingClientRect()
      indicatorLeft.value = rect.left - navRect.left
      indicatorWidth.value = rect.width
    }
  }
  let lastY = 0
  let idleTimer: any = null
  let threshold = 56 // default, will be updated after mount

  function onScroll() {
    const y = window.scrollY || 0
    atTop.value = y <= 2

    // When passing header height, make sure header is shown with a smooth drop
    if (y > threshold && !showHeader.value) {
      showHeader.value = true
    }

    // Always show while scrolling, then auto-hide when idle
    showHeader.value = true

    // Reset idle timer; hide header if user stops scrolling for a moment
    if (idleTimer) clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      // Only hide if scrolled past the threshold; keep visible at top
      if (window.scrollY > threshold && !hovering.value) {
        showHeader.value = false
      }
    }, 800)

    lastY = y

    // Update active section based on viewport
    try {
      const offset = (headerRef.value?.offsetHeight || 0) + 12
      let current: string | null = null
      for (const item of menuItems) {
        const el = document.getElementById(item.id)
        if (!el) continue
        const top = el.offsetTop
        const height = el.offsetHeight
        if (y >= top - offset && y < top + height - offset) {
          current = item.id
          break
        }
      }
      if (current) activeSection.value = current
      // Update category visibility based on hero section, with fallback near top on first load
      const nearTop = y <= (headerRef.value?.offsetHeight || 0) + 12
      // Chỉ coi là đang ở trong hero khi đang ở trang Home
      heroInView.value = isHomeRoute.value && (activeSection.value === 'home' || nearTop)
      // Show header categories while hero is visible; hide outside hero until clicked
      showCategoryPanel.value = heroInView.value ? true : manualCategoryOpen.value
    } catch {}
  }

  onMounted(() => {
    // Measure header height for threshold
    const h = headerRef.value?.offsetHeight || 0
    threshold = Math.max(56, h)
    lastY = window.scrollY || 0
    atTop.value = lastY <= 2
    window.addEventListener('scroll', onScroll, { passive: true })
    nextTick(() => {
      onScroll()
      updateIndicator()
      // Ensure categories loaded and measure button width
      const w = categoryBtnRef.value?.offsetWidth || 0
      if (w > 0) {
        catPanelWidth.value = w
        catBtnWidthState.value = w
      }
    })
    window.addEventListener('resize', () => {
      updateIndicator()
      const w = categoryBtnRef.value?.offsetWidth || 0
      if (w > 0) {
        catPanelWidth.value = w
        catBtnWidthState.value = w
      }
    })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
    window.removeEventListener('resize', updateIndicator)
    if (idleTimer) clearTimeout(idleTimer)
  })

  function onMouseEnter() {
    hovering.value = true
    showHeader.value = true
    if (idleTimer) clearTimeout(idleTimer)
  }

  function onMouseLeave() {
    hovering.value = false
    // If user is scrolled down and not moving, hide after a small delay
    if (window.scrollY > threshold) {
      if (idleTimer) clearTimeout(idleTimer)
      idleTimer = setTimeout(() => {
        if (!hovering.value) showHeader.value = false
      }, 500)
    }
  }

  watch(activeSection, () => {
    updateIndicator()
  })

  function toggleCategoryPanel() {
    // In hero, keep categories open by default and ignore toggle
    if (heroInView.value) {
      showCategoryPanel.value = true
      manualCategoryOpen.value = false
      return
    }
    manualCategoryOpen.value = !manualCategoryOpen.value
    showCategoryPanel.value = manualCategoryOpen.value
  }
</script>

<style scoped>
  /* Improve performance for transform animations */
  header {
    backface-visibility: hidden;
    height: var(--header-h);
  }
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }
  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }
</style>
