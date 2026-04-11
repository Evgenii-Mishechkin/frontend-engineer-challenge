<script setup lang="ts">
import AuthFieldInlineError from '@/shared/ui/AuthFieldInlineError.vue'
import PasswordVisibilityToggle from '@/shared/ui/PasswordVisibilityToggle.vue'
import {
  authFormApiErrorScopeKey,
  authFormClearErrorKey,
  type AuthApiFormErrorScope,
} from '@/shared/lib/authFormInject'
import { computed, inject, ref } from 'vue'

const props = defineProps<{
  id: string
  modelValue: string
  autocomplete?: string
  placeholder?: string
  floatLabel?: string
  ariaLabel: string
  required?: boolean
  fieldError?: string
  /** Красная граница без текста (второе поле пары показывает сообщение), макет 102:12408 */
  invalidBorder?: boolean
  /** id блока с текстом ошибки у пары (aria-describedby) */
  pairedErrorId?: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
  'clear-field-error': []
}>()

const visible = ref(false)
const focused = ref(false)

const isActive = computed(
  () => Boolean(props.floatLabel && (focused.value || props.modelValue.length > 0)),
)

const apiErrorScope = inject(
  authFormApiErrorScopeKey,
  computed(() => 'none' as AuthApiFormErrorScope),
)
const requestClearError = inject(authFormClearErrorKey, () => {})

const apiHighlightsPasswordField = computed(
  () => apiErrorScope.value === 'all' || apiErrorScope.value === 'password',
)

function onInput(e: Event) {
  if (props.fieldError || props.invalidBorder) emit('clear-field-error')
  requestClearError()
  emit('update:modelValue', (e.target as HTMLInputElement).value)
}
</script>

<template>
  <AuthFieldInlineError
    :id="id"
    :field-error="fieldError"
    target-scope="password"
    :invalid-border="invalidBorder"
    :paired-error-id="pairedErrorId"
    v-slot="{ hasError, errorDescribedBy, ariaInvalid }"
  >
    <div
      class="auth-field auth-field--password"
      :class="{
        'auth-field--float': floatLabel,
        'is-active': isActive,
        'auth-field--error': hasError || apiHighlightsPasswordField,
      }"
    >
      <div class="auth-field-password-body">
        <label v-if="floatLabel" :for="id" class="auth-field-float-label">{{ floatLabel }}</label>
        <input
          :id="id"
          :value="modelValue"
          :type="visible ? 'text' : 'password'"
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
      <PasswordVisibilityToggle v-model="visible" />
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

/* Фокус только на кнопке «глаз» не должен подсвечивать нижнюю линию поля. */
.auth-field--password:focus-within:not(:has(input:focus)):not(.auth-field--error) {
  border-bottom-color: var(--color-border-subtle);
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

.auth-field--password {
  flex-direction: row;
  align-items: flex-end;
  gap: var(--space-field-toggle-gap);
  padding-right: var(--space-field-block-y);
}

.auth-field-password-body {
  flex: 1;
  min-width: var(--min-width-flex);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  align-items: stretch;
  gap: var(--space-none);
}

.auth-field--password.auth-field--float {
  align-items: center;
}

.auth-field--password .auth-field-float-label {
  align-self: flex-start;
}

.auth-field--password input {
  width: var(--size-full);
}
</style>
