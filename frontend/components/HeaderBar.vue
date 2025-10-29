<template>
  <header
    ref="headerRef"
    class="sticky top-0 z-50  transition-all duration-300 ease-out will-change-transform"
    :class="[
      atTop ? 'bg-transparent' : ' bg-white/80 backdrop-blur-sm shadow-md',
      showHeader ? 'translate-y-0' : '-translate-y-full'
    ]"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <div class="container py-3 flex items-center justify-between">
      <NuxtLink
        to="/"
        class="flex items-center gap-3"
      >
        <!-- <img src="/logo.svg" alt="Haisan Lagi" class="h-8 w-8" /> -->
        <span
          :class="atTop ? 'text-white' : 'text-black'" 
          class="font-semibold"
        >Làng chài 86</span>
      </NuxtLink>
      <nav
        ref="navRef"
        class="hidden md:flex items-center gap-6 relative"
      >
        <button
          v-for="(item, index) in menuItems"
          :key="item.id"
          :ref="el => setMenuRef(el as HTMLElement | null, index)"
          class="uppercase tracking-wide text-sm px-2 pb-1 transition-colors"
          :class="[
            activeSection === item.id
              ? atTop
                ? 'text-white font-medium'
                : 'text-black font-medium'
              : atTop
                ? 'text-white'
                : 'text-black/90',
            'hover:text-white'
          ]"
          @click.prevent="scrollTo(item.id)"
        >
          {{ item.label }}
        </button>
        <div
          class="absolute bottom-0 h-[2px] transition-all duration-300 ease-out"
          :style="{ left: indicatorLeft + 'px', width: indicatorWidth + 'px', backgroundColor: atTop ? 'white' : 'orange' }"
        />
        <NuxtLink
          to="/cart"
          class="relative"
        >
          <div class="w-7 h-7 relative rounded-full bg-white text-primary flex items-center justify-center shadow-lg">
            <Icon
              icon="mdi:cart"
              width="18"
              height="18"
            />
            <span
              v-if="cartCount > 0"
              class="absolute -top-2 -right-3 bg-yellow-400 text-white text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center"
            >{{ cartCount }}</span>
          </div>
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue'
import { useCart } from '~/composables/useCart'
import { onMounted, onUnmounted, ref, computed, watch, nextTick } from 'vue'

const { items } = useCart()
const cartCount = computed(() => items.value.reduce((acc, i) => acc + i.quantity, 0))

// Scroll-based header behavior
const headerRef = ref<HTMLElement | null>(null)
const showHeader = ref(true)
const atTop = ref(true)
const hovering = ref(false)
const activeSection = ref<string>('')
const menuItems = [
  {id: 'home', label: 'Home'},
  { id: 'best-selling', label: 'Best Selling' },
  { id: 'products', label: 'Products' },
  { id: 'testimonials', label: 'Testimonials' },
  { id: 'how-we-ship', label: 'How We Ship' },
]
const navRef = ref<HTMLElement | null>(null)
const menuRefs = ref<HTMLElement[]>([])
const indicatorLeft = ref(0)
const indicatorWidth = ref(0)

function setMenuRef(el: HTMLElement | null, index: number) {
  if (el) menuRefs.value[index] = el
}

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
  })
  window.addEventListener('resize', updateIndicator)
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

function scrollTo(id: string) {
  const el = document.getElementById(id)
  const headerH = (headerRef.value?.offsetHeight || 0) + 8
  if (el) {
    const top = el.offsetTop - headerH
    window.scrollTo({ top, behavior: 'smooth' })
    // ensure header stays visible during scroll
    showHeader.value = true
  }
}

watch(activeSection, () => {
  updateIndicator()
})
</script>

<style scoped>
/* Improve performance for transform animations */
header { backface-visibility: hidden; }
</style>