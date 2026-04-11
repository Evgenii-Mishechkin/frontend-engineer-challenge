<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  hint: string
  linkText: string
  linkTo: RouteLocationRaw
}>()
</script>

<template>
  <span class="auth-split-footer__hint">{{ hint }}</span>
  <RouterLink class="ui-text-link" :to="linkTo">{{ linkText }}</RouterLink>
</template>

<style scoped>
.auth-split-footer__hint {
  color: var(--color-text-tertiary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
}
</style>
