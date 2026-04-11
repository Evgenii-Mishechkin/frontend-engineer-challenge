<template>
  <div class="auth-result">
    <slot />
  </div>
</template>

<style scoped>
.auth-result {
  max-width: var(--size-form-max-width);
}

.auth-result :deep(p) {
  margin: var(--space-none) var(--space-none) var(--space-page-block);
}

.auth-result :deep(p:last-child) {
  margin-bottom: var(--space-none);
}

.auth-result :deep(.auth-hint) {
  margin: var(--space-none);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-snug);
}

.auth-result :deep(.auth-code) {
  font-family: var(--font-family-mono);
  font-size: var(--font-size-xs);
  word-break: break-all;
}
</style>
