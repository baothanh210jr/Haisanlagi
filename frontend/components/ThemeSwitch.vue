<template>
  <button ref="buttonRef" aria-label="Toggle theme" class="theme-switch" @click="onToggleTheme">
    <span
      class="switch-track"
      :class="theme === 'light' ? 'track-light' : 'track-dark'"
      aria-hidden="true"
    />
    <span
      class="switch-thumb"
      :class="theme === 'light' ? 'thumb-left' : 'thumb-right'"
      aria-hidden="true"
    >
      <Icon
        :icon="theme === 'light' ? 'mdi:white-balance-sunny' : 'mdi:moon-waning-crescent'"
        :class="theme === 'light' ? 'thumb-icon sun' : 'thumb-icon moon'"
      />
    </span>
  </button>
</template>

<script setup lang="ts">
import { Icon } from '@iconify/vue';
import { ref } from 'vue';
import { useTheme } from '~/composables/useTheme';

const buttonRef = ref<HTMLElement | null>(null);
const { theme, toggleTheme } = useTheme();

const onToggleTheme = async () => {
  if (
    !document.startViewTransition ||
    !buttonRef.value ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ) {
    toggleTheme();
    return;
  }

  await document.startViewTransition(() => {
    toggleTheme();
  }).ready;

  const { top, left, width, height } = buttonRef.value.getBoundingClientRect();
  const x = left + width / 2;
  const y = top + height / 2;
  const right = window.innerWidth - left;
  const bottom = window.innerHeight - top;
  const maxRadius = Math.hypot(Math.max(left, right), Math.max(top, bottom));

  document.documentElement.animate(
    {
      clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${maxRadius}px at ${x}px ${y}px)`]
    },
    {
      duration: 500,
      easing: 'ease-in-out',
      pseudoElement: '::view-transition-new(root)'
    }
  );
};
</script>

<style scoped>
::view-transition-old(root),
.theme-switch {
  position: relative;
  width: 56px;
  height: 32px;
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 9999px;
  padding: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.theme-switch:focus-visible {
  outline: 2px solid #f97316;
  outline-offset: 3px;
}

.switch-track {
  position: absolute;
  inset: 0;
  border-radius: 9999px;
  border: 1px solid #d1d5db;
  background: #f4f5f7;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
  transition:
    background 0.25s ease,
    border-color 0.25s ease,
    box-shadow 0.25s ease;
}

.track-dark {
  background: #374151;
  border-color: #1f2937;
  box-shadow:
    inset 0 1px 2px rgba(0, 0, 0, 0.18),
    inset 0 0 0 1px rgba(255, 255, 255, 0.06);
}
.track-light {
  background: #e2e1e1;
  border-color: #b1b1b1;
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.04);
}

.switch-thumb {
  position: absolute;
  top: 3px;
  left: 3px;
  width: 26px;
  height: 26px;
  border-radius: 9999px;
  background: #ffffff;
  box-shadow:
    0 6px 10px rgba(0, 0, 0, 0.12),
    0 1px 2px rgba(0, 0, 0, 0.08);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition:
    transform 0.22s ease,
    background 0.22s ease;
  will-change: transform;
}

.thumb-right {
  transform: translateX(22px);
  background: #111827;
}

.thumb-left {
  transform: translateX(0);
}

.thumb-icon {
  width: 16px;
  height: 16px;
  transition:
    transform 0.25s ease,
    color 0.2s ease;
}

.thumb-icon.sun {
  color: #f2c14e;
  transform: rotate(-8deg);
}

.thumb-icon.moon {
  color: #f8fafc;
  transform: rotate(0deg);
}

.theme-switch:active .switch-thumb {
  transform: translateX(0) scale(0.97);
}

.theme-switch:active .thumb-right {
  transform: translateX(22px) scale(0.97);
}
</style>
