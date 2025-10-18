<template>
  <nav class="mt-6 flex items-center justify-center gap-2 select-none" aria-label="Pagination">
    <Button variant="outline" size="sm" :disabled="page <= 1" @click="prev">Trước</Button>
    <template v-for="p in pages" :key="p.key">
      <span v-if="p.type === 'ellipsis'" class="px-2 text-gray-500">…</span>
      <button
        v-else
        class="min-w-[34px] h-8 px-2 rounded-md border text-sm transition-colors"
        :class="p.value === page ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-700 hover:bg-gray-50'"
        @click="go(p.value)"
      >{{ p.value }}</button>
    </template>
    <Button variant="outline" size="sm" :disabled="page >= pageCount" @click="next">Sau</Button>
  </nav>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import Button from './Button.vue'

const props = withDefaults(defineProps<{ page: number; pageCount: number; siblingCount?: number }>(), {
  siblingCount: 1
})
const emit = defineEmits<{ (e: 'update:page', v: number): void }>()

function prev() {
  if (props.page > 1) emit('update:page', props.page - 1)
}
function next() {
  if (props.page < props.pageCount) emit('update:page', props.page + 1)
}
function go(v: number) {
  if (v !== props.page && v >= 1 && v <= props.pageCount) emit('update:page', v)
}

type PageItem = { type: 'page'; value: number; key: string } | { type: 'ellipsis'; key: string }
const pages = computed<PageItem[]>(() => {
  const total = props.pageCount
  const current = props.page
  const siblings = props.siblingCount
  if (total <= 1) return []
  const result: PageItem[] = []
  const start = Math.max(2, current - siblings)
  const end = Math.min(total - 1, current + siblings)
  result.push({ type: 'page', value: 1, key: 'p-1' })
  if (start > 2) result.push({ type: 'ellipsis', key: 'e-1' })
  for (let i = start; i <= end; i++) result.push({ type: 'page', value: i, key: 'p-' + i })
  if (end < total - 1) result.push({ type: 'ellipsis', key: 'e-2' })
  if (total > 1) result.push({ type: 'page', value: total, key: 'p-' + total })
  return result
})
</script>