<template>
  <section id="contact">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-16">
        <div>
          <h2 class="text-3xl font-bold text-white mb-4">
            {{ contact?.title }}
          </h2>
          <p class="text-primary-200 mb-8">
            {{ contact?.description }}
          </p>

          <div class="space-y-6">
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-white/90 rounded-full text-secondary flex items-center justify-center"
                >
                  <Icon icon="mdi:map-marker-outline" class="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Địa chỉ cửa hàng</h3>
                <p class="text-primary-200">
                  {{ contact?.address }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-white/90 rounded-full text-secondary flex items-center justify-center"
                >
                  <Icon icon="ic:baseline-phone" class="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Hotline tư vấn</h3>
                <p class="text-primary-200">
                  {{ contact?.hotline }}
                </p>
              </div>
            </div>
            <div class="flex items-center gap-4">
              <div class="flex-shrink-0">
                <div
                  class="w-10 h-10 bg-white/90 rounded-full text-secondary flex items-center justify-center"
                >
                  <Icon icon="material-symbols:mail-outline" class="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 class="text-lg font-bold text-white">Email</h3>
                <p class="text-primary-200">
                  {{ contact?.email }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white/90 p-6 sm:p-8 rounded-2xl shadow-lg">
          <form class="space-y-6" @submit.prevent="handleSubmitContact">
            <div class="space-y-2">
              <label class="block text-gray-700 font-bold" for="name"> Họ và tên </label>
              <input
                id="name"
                v-model="formContact.name"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                type="text"
                placeholder="Nhập họ và tên"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="block text-gray-700 font-bold" for="phone"> Số điện thoại </label>
              <input
                id="phone"
                v-model="formContact.phone"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-secondary-500 focus:outline-none focus:ring-2 focus:ring-secondary transition"
                type="tel"
                placeholder="Nhập số điện thoại"
                required
              />
            </div>
            <div class="space-y-2">
              <label class="block text-gray-700 font-bold" for="message">
                Nội dung cần tư vấn
              </label>
              <textarea
                id="message"
                v-model="formContact.message"
                class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-secondary focus:outline-none focus:ring-2 focus:ring-secondary transition h-32"
                placeholder="Tôi muốn tư vấn về sản phẩm..."
              />
            </div>
            <button
              type="submit"
              class="w-full bg-primary text-white font-bold py-3 rounded-lg transition duration-300 shadow-lg transform flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              :class="submitting ? '' : 'hover:bg-secondary-700 hover:-translate-y-1'"
              :disabled="submitting"
            >
              <Icon v-if="submitting" icon="line-md:loading-loop" class="h-5 w-5" />
              <span>{{ submitting ? 'Đang gửi...' : 'Gửi Thông Tin' }}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { onMounted, ref } from 'vue';
import { useContact } from '~/composables/useContact';
import { useToast } from '~/composables/useToast';

const { contact, ensureContact, submitContactForm } = useContact();
const { success: showSuccess, error: showError } = useToast();

const formContact = ref({
  name: '',
  phone: '',
  message: ''
});
const submitting = ref(false);

async function handleSubmitContact() {
  if (submitting.value) return;
  const payload = {
    name: formContact.value.name.trim(),
    phone: formContact.value.phone.trim(),
    message: formContact.value.message.trim()
  };
  submitting.value = true;
  try {
    const ok = await submitContactForm(payload);
    if (ok) {
      showSuccess(
        'Cảm ơn bạn đã để lại thông tin! Chúng tôi sẽ liên hệ trong thời gian sớm nhất.',
        {
          timeout: 5000
        }
      );
      formContact.value = { name: '', phone: '', message: '' };
    } else {
      showError('Gửi thông tin thất bại. Vui lòng thử lại sau một chút.', { timeout: 5000 });
    }
  } catch (err) {
    console.error(err);
    showError('Có lỗi xảy ra khi gửi thông tin. Bạn hãy thử lại sau nhé.', { timeout: 5000 });
  } finally {
    submitting.value = false;
  }
}

onMounted(() => {
  ensureContact();
});
</script>
