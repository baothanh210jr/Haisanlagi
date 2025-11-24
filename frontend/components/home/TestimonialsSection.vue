<template>
  <section id="testimonials" class="py-8">
    <div class="container mx-auto px-6">
      <h2 class="text-3xl font-bold text-center text-gray-800 mb-12">Ý kiến của khách hàng</h2>
      <div class="grid md:grid-cols-3 gap-8">
        <div v-for="item in feedback" :key="item.id" class="bg-gray-50 p-8 rounded-xl shadow">
          <div class="flex items-center mb-4">
            <div
              class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold"
            >
              J
            </div>
            <div class="ml-4">
              <h4 class="font-semibold text-gray-800">
                {{ item.name }}
              </h4>
              <p class="text-gray-600 text-sm">
                {{ item.job }}
              </p>
            </div>
          </div>
          <p class="text-gray-600 italic">
            {{ item.content }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
  import { onMounted } from 'vue'
  import { useFeedback } from '~/composables/useFeedback'

  const { feedback, ensureFeedback } = useFeedback()

  onMounted(() => {
    ensureFeedback()
  })
</script>
