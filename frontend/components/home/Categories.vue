<template>
  <section class="w-full">
    <div class="panel px-10 pt-20 pb-28">
      <div class="flex flex-col items-center justify-center mb-10">
        <h1 class="text-4xl text-white px-3 py-1 font-semibold my-4 text-center">
          Danh mục nổi bật
        </h1>
      </div>

      <div ref="panelEl" class="relative overflow-hidden">
        <!-- Floating shared background -->
        <div ref="hoverBg" class="hover-bg absolute top-0 left-0 pointer-events-none" />

        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 grid-sponsor relative z-10">
          <NuxtLink
            v-for="(cat, index) in categories"
            :key="cat.id"
            :to="{ name: 'category-slug', params: { slug: cat.slug } }"
            class="card flex items-center gap-4 p-6 text-white transition-colors"
          >
            <div class="icon-frame">
              <div class="icon-grid" />

              <div class="icon-inner">
                <img :src="formatImage(cat, { width: 200, height: 200 })" />
              </div>
            </div>

            <div class="text-left text-lg">
              <p class="font-medium">
                {{ cat.name }}
              </p>
              <div class="text-xs text-slate-400 mt-1">
                Tôm thẻ, tôm sú tươi sống, thịt chắc ngọt tự nhiên, đảm bảo chất lượng
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { nextTick, onMounted, ref } from 'vue';
import { formatImage } from '~/utils/formatImage';
const { categories, ensureCategories } = useCategories(8);
onMounted(() => {
  ensureCategories();
});

const panelEl = ref<HTMLElement | null>(null);
const hoverBg = ref<HTMLElement | null>(null);

onMounted(async () => {
  await ensureCategories();
  await nextTick();
  if (!panelEl.value) return;

  const panel = panelEl.value!;
  const bg = hoverBg.value!;
  const cards = panel.querySelectorAll<HTMLElement>('.card');

  if (!cards.length) return;

  const moveTo = (el: HTMLElement) => {
    const rect = el.getBoundingClientRect();
    const parent = panel.getBoundingClientRect();

    bg.style.width = rect.width + 'px';
    bg.style.height = rect.height + 'px';

    bg.style.transform = `translate(
      ${rect.left - parent.left}px,
      ${rect.top - parent.top}px
    )`;
  };

  // Card đầu tiên active sẵn
  moveTo(cards[0]);

  cards.forEach((card) => {
    card.addEventListener('mouseenter', () => moveTo(card));
  });
});
</script>

<style scoped>
.panel {
  background: linear-gradient(180deg, #071024, #071726);
}

.grid-sponsor > a {
  border-bottom: 1px solid rgba(148, 163, 184, 0.04);
  border-right: 1px solid rgba(148, 163, 184, 0.04);
}

.hover-bg {
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.06), rgba(255, 255, 255, 0.02));
  backdrop-filter: blur(6px);

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.06),
    0 12px 30px rgba(0, 0, 0, 0.6);

  transition:
    transform 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    width 0.35s cubic-bezier(0.2, 0.8, 0.2, 1),
    height 0.35s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.icon-frame {
  position: relative;
  width: 72px;
  height: 72px;
  border-radius: 14px;
  overflow: hidden;
  flex-shrink: 0;

  background: linear-gradient(180deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.01));

  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.08),
    0 10px 25px rgba(0, 0, 0, 0.5);
}

/* grid */
.icon-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px),
    linear-gradient(90deg, rgba(255, 255, 255, 0.06) 1px, transparent 1px);
  background-size: 16px 16px;
  opacity: 0.35;
}

/* crosshair */
.icon-cross::before,
.icon-cross::after {
  content: '';
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
}

.icon-cross::before {
  width: 100%;
  height: 1px;
  top: 50%;
  left: 0;
}

.icon-cross::after {
  height: 100%;
  width: 1px;
  left: 50%;
  top: 0;
}

/* icon content */
.icon-inner {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.icon-inner img {
  width: 60px;
  height: 60px;
  object-fit: contain;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6));
}

.card:hover .icon-frame {
  box-shadow:
    inset 0 0 0 1px rgba(255, 255, 255, 0.18),
    0 12px 35px rgba(0, 0, 0, 0.8);
}

.card:hover .icon-grid {
  opacity: 0.6;
}

.card:hover .icon-inner img {
  transform: scale(1.06);
}
</style>
