<template>
  <section id="testimonials">
    <div class="py-8 bg-white/90">
      <div class="container mx-auto px-6">
        <h2 class="text-3xl font-bold text-center text-primary mb-12">Ý kiến của khách hàng</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="item in feedback" :key="item.id" class="bg-secondary p-8 rounded-xl shadow">
            <div class="flex items-center mb-4">
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold bg-primary rounded-full"
              >
                <img
                  :src="
                    item.avatar
                      ? formatImage({ image: item.avatar }, { width: 48, height: 48 })
                      : ''
                  "
                  alt="Avatar"
                  class="w-12 h-12 rounded-full object-cover"
                />
              </div>
              <div class="ml-4">
                <h4 class="font-bold text-white text-lg">
                  {{ item.name }}
                </h4>
                <p class="text-white text-md">
                  {{ item.job }}
                </p>
              </div>
            </div>
            <p class="text-white italic">
              {{ item.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useFeedback } from '~/composables/useFeedback';
import { formatImage } from '~/utils/formatImage';

const { feedback, ensureFeedback } = useFeedback();

onMounted(() => {
  ensureFeedback();
});
</script>
