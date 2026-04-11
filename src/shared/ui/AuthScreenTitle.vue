<script setup lang="ts">
defineProps<{
  text: string
}>()
</script>

<template>
  <h1 class="auth-screen-title">{{ text }}</h1>
</template>

<style scoped>
.auth-screen-title {
  margin: var(--space-none);
  font-size: var(--font-size-auth-title);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}
</style>
