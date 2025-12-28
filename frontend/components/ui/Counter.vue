<template>
  <div
    class="inline-flex items-center gap-1 rounded-lg border border-gray-300 bg-theme-surface shadow-sm px-2 py-1"
    role="group"
    aria-label="Chọn số lượng"
  >
    <button
      type="button"
      class="w-9 h-9 inline-flex items-center justify-center rounded-md border border-gray-400 bg-theme-surface hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      :aria-label="ariaMinus"
      :disabled="disabled || current <= min"
      @click="decrease"
    >
      −
    </button>
    <input
      :value="current"
      class="w-14 text-center appearance-none outline-none border border-transparent focus:border-gray-300 rounded-md py-2 bg-theme-surface"
      @input="onInput"
      @keydown.up.prevent="increase"
      @keydown.down.prevent="decrease"
    />
    <button
      type="button"
      class="w-9 h-9 inline-flex items-center justify-center rounded-md border border-gray-400 bg-theme-surface hover:opacity-80 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
      :aria-label="ariaPlus"
      :disabled="disabled || (max !== null && max !== undefined && current >= max)"
      @click="increase"
    >
      +
    </button>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue: number;
    min?: number;
    max?: number | null;
    disabled?: boolean;
  }>(),
  {
    min: 1,
    max: null,
    disabled: false
  }
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const ariaMinus = 'Giảm số lượng';
const ariaPlus = 'Tăng số lượng';

const current = computed(() => clamp(props.modelValue));

function clamp(v: number) {
  const min = Number(props.min ?? 1);
  const max = props.max;
  let val = Number.isFinite(v) ? Math.floor(v) : min;
  if (val < min) val = min;
  if (typeof max === 'number' && Number.isFinite(max) && val > max) val = max;
  return val;
}

function onInput(e: Event) {
  // If input digit more than 2, only allow 2 digits
  (e.target as HTMLInputElement).value = (e.target as HTMLInputElement).value
    .replace(/[^\d]/g, '')
    .slice(0, 2);
  const raw = Number((e.target as HTMLInputElement).value);
  emit('update:modelValue', clamp(raw));
}

function decrease() {
  emit('update:modelValue', clamp(current.value - 1));
}

function increase() {
  emit('update:modelValue', clamp(current.value + 1));
}
</script>

<style scoped>
/* Optional: tweak transitions */
button {
  transition:
    transform 0.12s ease,
    box-shadow 0.12s ease;
}
button:hover {
  box-shadow: 0 6px 10px rgba(0, 0, 0, 0.06);
}
</style>
