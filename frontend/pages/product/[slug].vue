<template>
  <Breadcrumb
    :items="[
      { label: 'Trang chủ', to: '/' },
      { label: product?.category?.name || '', to: `/hai-san/${product?.category?.slug || ''}` },
      { label: product?.name || slug }
    ]"
  />
  <div class="">
    <div class="container py-8">
      <div v-if="product" class="flex gap-5 sm:gap-8 flex-col md:flex-row">
        <div class="w-full md:w-1/2 sm:pb-10 relative">
          <div class="relative z-10 w-full h-auto overflow-hidden rounded">
            <img
              :src="formatImage(product, { width: 1200, height: 800 })"
              :alt="product.name"
              class="transition-transform duration-200 ease-out w-full h-full object-cover"
            />
          </div>
        </div>
        <div class="w-full md:w-1/2">
          <h1 class="text-3xl font-bold">
            {{ product.name }}
          </h1>
          <p class="mt-2">
            <span class="text-2xl font-bold color-price">{{ formatPrice(totalPrice) }}</span>
            <span
              v-if="selectVariant?.original_price"
              class="text-lg font-medium discount-price line-through ml-3"
              >{{ formatPrice(totalPriceWithDiscount) }}</span
            >
          </p>
          <div class="capacity">
            <label class="font-bold text-theme-text mb-3 block">Chọn:</label>
            <div class="options mt-2 flex flex-wrap gap-3">
              <label
                v-for="opt in product.variants"
                :key="opt.id"
                class="variant-option"
                :class="{ 'variant-option--active': selectVariant?.id === opt.id }"
              >
                <input
                  v-model="selectVariant"
                  type="radio"
                  name="capacity"
                  :value="opt"
                  class="sr-only"
                />
                <span class="variant-option__label">{{ opt.product_variants_id?.label }}</span>
              </label>
            </div>
          </div>
          <div class="my-6">
            <div class="mb-2 font-bold">Số lượng:</div>
            <Counter :model-value="quantity" @update:model-value="(val) => (quantity = val)" />
          </div>
          <p v-if="product.description" class="desc">
            {{ product.description }}
          </p>
          <div class="flex flex-col sm:flex-row gap-5 w-full sm:w-[90%]">
            <button
              class="flex-1 add-to-cart-btn bg-secondary hover:bg-orange-600 text-white py-3 px-9 rounded-lg font-medium flex items-center justify-center gap-1 text-md"
              @click="add(product)"
            >
              <Icon icon="mdi:cart-plus" class="w-6 h-6" />
              <span class="uppercase font-semibold">Thêm giỏ hàng</span>
            </button>
            <button
              class="flex-1 bg-red-600 hover:bg-red-600 text-white py-3 px-9 rounded-lg font-medium flex items-center justify-center gap-1 text-md"
              @click="add(product)"
            >
              <span class="uppercase font-semibold">Mua ngay</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="empty">Sản phẩm không tồn tại hoặc đã ẩn.</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import Breadcrumb from '~/components/ui/Breadcrumb.vue';
import Counter from '~/components/ui/Counter.vue';
import { useCart } from '~/composables/useCart';
import { useProductDetail } from '~/composables/useProductDetail';
import { useToast } from '~/composables/useToast';
import type { ProductItem, Variants } from '~/types/Product';
import { formatImage } from '~/utils/formatImage';
import { formatPrice } from '~/utils/formatPrice';

const route = useRoute();
const slug = route.params.slug as string;
const { addToCart } = useCart();
const { success } = useToast();

const { product, ensureProduct } = useProductDetail(slug);
onMounted(() => {
  ensureProduct();
});

const selectVariant = ref<Variants | null>(null);
const quantity = ref<number>(1);
const unitPrice = computed(() => Number(selectVariant.value?.price ?? 0));
const totalPrice = computed(() => unitPrice.value * quantity.value);
const totalPriceWithDiscount = computed(() =>
  selectVariant.value?.original_price
    ? selectVariant.value?.original_price * quantity.value
    : totalPrice.value
);

watch(
  () => product.value,
  (val) => {
    if (val && val.variants && val.variants.length > 0) {
      selectVariant.value = val.variants[0] || null;
    }
  },
  { immediate: true }
);

function add(p: ProductItem) {
  addToCart(
    {
      id: p.id,
      name: p.name,
      price: selectVariant.value?.price || p.price,
      image: p.image,
      capacity: selectVariant.value?.label || ''
    },
    quantity.value
  );
  success(`Đã thêm ${selectVariant.value?.label} \"${p.name}\" vào giỏ hàng`, {
    actionText: 'Xem giỏ hàng',
    actionTo: '/gio-hang',
    image: formatImage(p as any, { width: 120, height: 120 }),
    layout: 'drawer',
    timeout: 0
  });
}
</script>

<style>
.actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.capacity {
  margin: 16px 0;
}

.variant-option {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 80px;
  padding: 10px 20px;
  border: 2px solid var(--theme-border);
  border-radius: 10px;
  background: var(--theme-surface);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  color: var(--theme-text);
  user-select: none;
}

.variant-option:hover {
  border-color: var(--theme-secondary);
  background: var(--theme-subtle);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 122, 89, 0.15);
}

.variant-option--active {
  border-color: var(--theme-secondary);
  background: linear-gradient(135deg, rgba(255, 122, 89, 0.1), rgba(255, 122, 89, 0.05));
  color: var(--theme-secondary);
  font-weight: 600;
  box-shadow: 0 4px 12px rgba(255, 122, 89, 0.2);
}

.variant-option--active:hover {
  box-shadow: 0 6px 16px rgba(255, 122, 89, 0.25);
}

.variant-option__label {
  pointer-events: none;
}

.variant-option input[type='radio'] {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

/* Dark mode support */
:root.dark .variant-option {
  border-color: var(--theme-border);
}

:root.dark .variant-option:hover {
  border-color: var(--theme-secondary);
  background: rgba(255, 122, 89, 0.1);
}

:root.dark .variant-option--active {
  background: linear-gradient(135deg, rgba(255, 122, 89, 0.2), rgba(255, 122, 89, 0.1));
  border-color: var(--theme-secondary);
}
</style>
