<script setup lang="ts">
import type { RouteLocationRaw } from 'vue-router'

defineProps<{
  to: RouteLocationRaw
  text: string
}>()
</script>

<template>
  <RouterLink class="ui-text-link auth-form-tertiary-link" :to="to">{{ text }}</RouterLink>
</template>

<style scoped>
.auth-form-tertiary-link {
  align-self: center;
  margin-top: var(--space-tertiary-top);
  line-height: var(--line-height-none);
}
</style>
