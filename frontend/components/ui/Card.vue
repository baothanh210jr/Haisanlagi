<template>
  <div :class="classes">
    <slot />
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'

  type Padding = 'none' | 'sm' | 'md' | 'lg'

  const props = withDefaults(defineProps<{ padding?: Padding }>(), {
    padding: 'md',
  })

  const classes = computed(() => {
    const base = 'rounded-xl border border-gray-200 bg-white shadow-sm'
    const pads: Record<Padding, string> = {
      none: '',
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6',
    }
    return [base, pads[props.padding]].join(' ')
  })
</script>
