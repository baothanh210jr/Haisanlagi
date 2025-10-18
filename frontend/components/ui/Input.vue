<template>
  <input
    :type="type"
    :value="modelValueComputed"
    :class="classes"
    @input="onInput"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Size = 'sm' | 'md' | 'lg'

const props = withDefaults(
  defineProps<{
    modelValue: string | number
    type?: string
    size?: Size
  }>(),
  {
    type: 'text',
    size: 'md',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', v: string | number): void
}>()

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 text-xs',
  md: 'h-10 text-sm',
  lg: 'h-11 text-base',
}

const classes = computed(() => {
  return [
    'w-full rounded-md border border-gray-300 bg-white',
    'px-3 py-2 text-gray-900 placeholder-gray-400',
    'focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500',
    'disabled:cursor-not-allowed disabled:opacity-50',
    sizeClasses[props.size],
  ].join(' ')
})

const modelValueComputed = computed(() => (props.modelValue ?? '') as string | number)

function onInput(e: Event) {
  const target = e.target as HTMLInputElement
  const raw = target.value
  emit('update:modelValue', props.type === 'number' ? Number(raw) : raw)
}
</script>