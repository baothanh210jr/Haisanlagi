<template>
  <button
    :class="classes"
    v-bind="$attrs"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Variant = 'default' | 'secondary' | 'destructive' | 'outline'
type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(defineProps<{ variant?: Variant; size?: Size }>(), {
  variant: 'default',
  size: 'md'
})

const classes = computed(() => {
  const base = 'inline-flex items-center justify-center rounded-md font-medium transition-colors transition-transform hover:scale-[1.02] hover:shadow-md active:scale-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none'
  const variants: Record<Variant, string> = {
    default: 'bg-primary text-white hover:opacity-90',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200',
    destructive: 'bg-red-600 text-white hover:bg-red-700',
    outline: 'border border-gray-300 hover:bg-gray-50'
  }
  const sizes: Record<Size, string> = {
    sm: 'text-xs h-8 px-3',
    md: 'text-sm h-10 px-4',
    lg: 'text-base h-11 px-5'
  }
  return [base, variants[props.variant], sizes[props.size]].join(' ')
})
</script>