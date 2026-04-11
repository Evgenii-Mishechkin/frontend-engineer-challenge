<script setup lang="ts">
import AuthFieldInlineError from '@/shared/ui/AuthFieldInlineError.vue'
import {
  authFormApiErrorScopeKey,
  authFormClearErrorKey,
  type AuthApiFormErrorScope,
} from '@/shared/lib/authFormInject'
import { computed, inject, ref } from 'vue'

const props = defineProps<{
  id: string
  modelValue: string
  type?: string
  autocomplete?: string
  placeholder?: string
  /** Подпись сверху при фокусе или при вводе */
  floatLabel?: string
  ariaLabel: string
  required?: boolean
  /** Текст ошибки под полем (клиентская валидация), как в макете */
  fieldError?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear-field-error': []
}>()

const focused = ref(false)
const isActive = computed(
  () => Boolean(props.floatLabel && (focused.value || props.modelValue.length > 0)),
)

const apiErrorScope = inject(
  authFormApiErrorScopeKey,
  computed(() => 'none' as AuthApiFormErrorScope),
)
const requestClearError = inject(authFormClearErrorKey, () => {})

const apiHighlightsTextField = computed(
  () => apiErrorScope.value === 'all' || apiErrorScope.value === 'email',
)

function onInput(e: Event) {
  if (props.fieldError) emit('clear-field-error')
  requestClearError()
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <AuthFieldInlineError
    :id="id"
    :field-error="fieldError"
    target-scope="email"
    v-slot="{ hasError, errorDescribedBy, ariaInvalid }"
  >
    <div
      class="auth-field"
      :class="{
        'auth-field--float': floatLabel,
        'is-active': isActive,
        'auth-field--error': hasError || apiHighlightsTextField,
      }"
    >
      <label v-if="floatLabel" :for="id" class="auth-field-float-label">{{ floatLabel }}</label>
      <input
        :id="id"
        :value="modelValue"
        :type="type ?? 'text'"
        :autocomplete="autocomplete"
        :required="required"
        :placeholder="isActive ? '' : (placeholder ?? '')"
        :aria-label="ariaLabel"
        :aria-invalid="ariaInvalid"
        :aria-describedby="errorDescribedBy"
        @focus="focused = true"
        @blur="focused = false"
        @input="onInput"
      />
    </div>
  </AuthFieldInlineError>
</template>

<style scoped>
.auth-field {
  border-bottom: var(--border-width-hairline) solid var(--color-border-subtle);
  padding: var(--space-field-block-y) var(--space-none);
  min-height: var(--space-field-min-height);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  transition: border-color 0.2s ease;
}

.auth-field:focus-within {
  border-bottom-color: var(--color-primary);
}

.auth-field--error,
.auth-field--error:focus-within {
  border-bottom-color: var(--color-invalid);
}

.auth-field input {
  border: none;
  width: var(--size-full);
  padding: var(--space-none);
  font-family: inherit;
  font-size: var(--font-size-input);
  line-height: var(--line-height-input);
  color: var(--color-text-primary);
  background: transparent;
  outline: none;
}

.auth-field input::placeholder {
  color: var(--color-text-placeholder);
}

.auth-field--float {
  justify-content: flex-end;
  align-items: stretch;
  gap: var(--space-none);
}

.auth-field-float-label {
  margin: var(--space-none);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-snug);
  color: var(--color-text-secondary);
  max-height: var(--space-none);
  opacity: 0;
  overflow: hidden;
  transition:
    max-height 0.2s ease,
    opacity 0.2s ease,
    margin-bottom 0.2s ease;
  pointer-events: none;
}

.auth-field--float.is-active .auth-field-float-label {
  max-height: 2.5em;
  opacity: 1;
  margin-bottom: var(--space-field-float-gap);
}
</style>
