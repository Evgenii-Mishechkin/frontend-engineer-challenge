<script setup lang="ts">
import {
  authFormApiErrorScopeKey,
  authFormErrorMessageKey,
  type AuthApiFormErrorScope,
} from '@/shared/lib/authFormInject'
import { computed, inject } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    fieldError?: string
    targetScope?: Extract<AuthApiFormErrorScope, 'email' | 'password'>
    invalidBorder?: boolean
    pairedErrorId?: string
  }>(),
  { targetScope: undefined, invalidBorder: false, pairedErrorId: undefined },
)

const apiErrorScope = inject(
  authFormApiErrorScopeKey,
  computed(() => 'none' as AuthApiFormErrorScope),
)
const apiErrorMessage = inject(authFormErrorMessageKey, computed(() => ''))

const inlineErrorMessage = computed(() => {
  if (props.fieldError) return props.fieldError
  if (props.targetScope && apiErrorScope.value === props.targetScope) return apiErrorMessage.value
  return ''
})

const hasError = computed(() => Boolean(inlineErrorMessage.value || props.invalidBorder))

const errorDescribedBy = computed(() => {
  if (inlineErrorMessage.value) return `${props.id}-error`
  if (props.invalidBorder && props.pairedErrorId) return props.pairedErrorId
  return undefined
})

const ariaInvalid = computed(() => (hasError.value ? true : undefined))
</script>

<template>
  <div class="auth-field-group">
    <slot
      :inline-error-message="inlineErrorMessage"
      :has-error="hasError"
      :error-described-by="errorDescribedBy"
      :aria-invalid="ariaInvalid"
    />
    <p
      v-if="inlineErrorMessage"
      :id="`${id}-error`"
      class="auth-field-inline-error"
      role="alert"
    >
      {{ inlineErrorMessage }}
    </p>
  </div>
</template>

<style scoped>
.auth-field-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: var(--size-full);
}

.auth-field-inline-error {
  margin: var(--space-none);
  font-size: var(--font-size-legal);
  font-weight: var(--font-weight-normal);
  line-height: 1;
  color: var(--color-invalid);
}
</style>
