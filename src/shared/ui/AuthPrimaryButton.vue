<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    /** Текст в обычном состоянии */
    label: string
    /** Текст при отправке (loading) */
    loadingLabel?: string
    loading?: boolean
    disabled?: boolean
    type?: 'button' | 'submit' | 'reset'
    /** Вариант кнопки: основная или нейтральная. */
    variant?: 'primary' | 'neutral'
    /** Для навигации: рендер RouterLink вместо кнопки. */
    to?: RouteLocationRaw
    /** Крупный отступ сверху (экраны-сообщения). */
    looseTop?: boolean
  }>(),
  {
    type: 'submit',
    loading: false,
    variant: 'primary',
    looseTop: false,
  },
)

const isBlocked = computed(() => Boolean(props.loading || props.disabled))
const loadingLabelResolved = computed(() => props.loadingLabel || props.label)
const showLoading = computed(() => Boolean(props.loading && props.to == null))
</script>

<template>
  <RouterLink v-if="to != null && !isBlocked" :to="to" custom v-slot="{ navigate, href }">
    <a
      class="auth-btn"
      :class="[`auth-btn--${variant}`, { 'auth-btn--loose-top': looseTop }]"
      :href="href"
      @click="navigate"
    >
      {{ label }}
    </a>
  </RouterLink>
  <button
    v-else
    class="auth-btn"
    :class="[`auth-btn--${variant}`, { 'auth-btn--loose-top': looseTop }]"
    :type="type"
    :disabled="isBlocked"
    :aria-busy="showLoading ? 'true' : undefined"
  >
    {{ showLoading ? loadingLabelResolved : label }}
  </button>
</template>

<style scoped>
.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: var(--space-primary-btn-top);
  width: var(--size-full);
  height: var(--height-primary-btn);
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-text-inverse);
  font-family: inherit;
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-none);
  text-decoration: none;
  cursor: pointer;
  box-sizing: border-box;
  transition:
    background-color 0.15s ease,
    filter 0.15s ease,
    transform 0.1s ease,
    opacity 0.15s ease;
}

.auth-btn--primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
}

.auth-btn--neutral {
  margin-inline: auto;
  min-width: 480px;
  background: var(--color-neutral-btn-bg);
  color: var(--color-primary);
}

.auth-btn--loose-top {
  margin-top: 40px;
}

@media (hover: hover) {
  .auth-btn--primary:hover:not(:disabled) {
    filter: brightness(0.94);
  }

  .auth-btn--neutral:hover:not(:disabled) {
    filter: brightness(0.97);
  }
}

.auth-btn:focus {
  outline: none;
}

.auth-btn:focus-visible {
  outline: var(--width-shell-outline) solid var(--color-focus-ring);
  outline-offset: var(--offset-shell-outline);
}

.auth-btn:active:not(:disabled) {
  transform: scale(0.99);
}

.auth-btn--primary:active:not(:disabled) {
  filter: brightness(0.88);
}

.auth-btn--neutral:active:not(:disabled) {
  filter: brightness(0.94);
}

.auth-btn:disabled {
  opacity: var(--opacity-disabled);
  cursor: not-allowed;
  filter: none;
  transform: none;
}
</style>
