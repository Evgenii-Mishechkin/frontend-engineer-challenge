<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const title = computed(() => String(route.meta.legalTitle ?? 'Документ'))
</script>

<template>
  <main class="legal-page">
    <h1 class="legal-page__title">{{ title }}</h1>
    <p class="legal-page__body">Здесь будет полный текст документа.</p>
    <RouterLink class="ui-text-link" to="/register">← К регистрации</RouterLink>
  </main>
</template>

<style scoped>
.legal-page {
  max-width: var(--size-home-max-width);
  margin: var(--space-none) auto;
  padding: var(--space-page-padding);
}

.legal-page__title {
  margin: var(--space-none) var(--space-none) var(--space-page-block);
  font-size: var(--font-size-page-title);
  font-weight: var(--font-weight-semibold);
}

.legal-page__body {
  margin: var(--space-none) var(--space-none) var(--space-page-block);
  color: var(--color-text-secondary);
  line-height: var(--line-height-relaxed);
}
</style>
