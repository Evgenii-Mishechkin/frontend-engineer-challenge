<script setup lang="ts">
import { AUTH_EYE_ICON, AUTH_EYE_CLOSED_ICON } from '@/shared/config/publicAssets'

/** true — пароль отображается открытым текстом */
const revealed = defineModel<boolean>({ default: false })

function toggle() {
  revealed.value = !revealed.value
}
</script>

<template>
  <button
    class="password-visibility-toggle"
    type="button"
    :aria-pressed="revealed"
    :aria-label="revealed ? 'Скрыть пароль' : 'Показать пароль'"
    @click="toggle"
  >
    <img :src="revealed ? AUTH_EYE_CLOSED_ICON : AUTH_EYE_ICON" width="22" height="16" alt="" />
  </button>
</template>

<style scoped>
.password-visibility-toggle {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-field-block-y);
  margin: calc(var(--space-field-block-y) * -1) calc(var(--space-field-block-y) * -1)
    calc(var(--space-field-block-y) * -1) var(--space-none);
  border: none;
  background: transparent;
  cursor: pointer;
  line-height: var(--line-height-zero);
  border-radius: var(--radius-sm);
}

.password-visibility-toggle:focus-visible {
  outline: var(--width-shell-outline) solid var(--color-primary);
  outline-offset: var(--offset-shell-outline);
}

.password-visibility-toggle img {
  display: block;
  width: 22px;
  height: 16px;
  object-fit: contain;
}
</style>
