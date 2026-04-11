<script setup lang="ts">
import { computed, provide } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import {
  authFormApiErrorScopeKey,
  authFormClearErrorKey,
  authFormErrorMessageKey,
  type AuthApiFormErrorScope,
} from '@/shared/lib/authFormInject'
import AuthPrimaryButton from '@/shared/ui/AuthPrimaryButton.vue'
import AuthTertiaryLink from '@/shared/ui/AuthTertiaryLink.vue'

/**
 * Общая оболочка auth-формы: заголовок, статусы, поля, кнопка, опционально блок под кнопкой (юр. текст), третичная ссылка.
 */
const props = defineProps<{
  title: string
  /** Отправка формы */
  loading?: boolean
  /** Сообщение об ошибке API (уже для UI, напр. на русском) */
  errorMessage?: string
  /** Какие поля подсвечивать красной границей при ошибке API */
  apiErrorFieldScope?: AuthApiFormErrorScope
  /** Нейтральная подсказка / успех (role="status") */
  hint?: string
  /** Доп. текст над полями (например восстановление пароля) */
  description?: string
  submitLabel: string
  submitLabelLoading: string
  /** Ссылка под кнопкой (например «Забыли пароль?», «Назад к входу») */
  tertiaryTo?: RouteLocationRaw
  tertiaryText?: string
  /** Стрелка «назад» слева от заголовка (как в макете восстановления пароля) */
  titleBackTo?: RouteLocationRaw
  titleBackAriaLabel?: string
  submitDisabled?: boolean
  maxWidth?: string
}>()

const tertiaryLink = computed(() => {
  const to = props.tertiaryTo
  const text = props.tertiaryText
  if (to == null || text == null || text === '') return null
  return { to, text }
})

const apiErrorScopeForFields = computed<AuthApiFormErrorScope>(() => {
  if (!props.errorMessage) return 'none'
  return props.apiErrorFieldScope ?? 'all'
})

const inlineFieldErrorHandled = computed(
  () => apiErrorScopeForFields.value === 'email' || apiErrorScopeForFields.value === 'password',
)

const showFormError = computed(
  () => Boolean(props.errorMessage) && !inlineFieldErrorHandled.value,
)

const emit = defineEmits<{
  submit: []
  'clear-error': []
}>()

function requestClearError() {
  if (props.errorMessage) emit('clear-error')
}

provide(authFormApiErrorScopeKey, apiErrorScopeForFields)
provide(authFormClearErrorKey, requestClearError)
provide(authFormErrorMessageKey, computed(() => props.errorMessage ?? ''))
</script>

<template>
  <form class="auth-form" :style="{ 'max-width': maxWidth }" novalidate @submit.prevent="emit('submit')">
    <div v-if="titleBackTo" class="auth-title-row">
      <RouterLink
        :to="titleBackTo"
        class="auth-title-back"
        :aria-label="titleBackAriaLabel ?? 'Назад'"
      >
        <svg
          class="auth-title-back-icon"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M15 18l-6-6 6-6"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </RouterLink>
      <h1 class="auth-title">{{ title }}</h1>
    </div>
    <h1 v-else class="auth-title">{{ title }}</h1>
    <p v-if="description" class="auth-intro">{{ description }}</p>
    <slot />
    <div
      v-if="hint || errorMessage"
      class="auth-alerts"
      aria-live="polite"
    >
      <p v-if="hint" class="auth-hint" role="status">{{ hint }}</p>
      <p v-if="showFormError" class="auth-error" role="alert">
        {{ errorMessage }}
      </p>
    </div>
    <AuthPrimaryButton
      type="submit"
      :loading="loading"
      :disabled="submitDisabled"
      :label="submitLabel"
      :loading-label="submitLabelLoading"
    />
    <div v-if="$slots.belowButton" class="auth-below-btn">
      <slot name="belowButton" />
    </div>
    <AuthTertiaryLink v-if="tertiaryLink" :to="tertiaryLink.to" :text="tertiaryLink.text" />
  </form>
</template>

<style scoped>
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-auth-form-gap);
  width: var(--size-full);
  max-width: var(--size-form-max-width);
  font-family: var(--font-family-sans);
}

.auth-title {
  margin: var(--space-none);
  font-size: var(--font-size-auth-title);
  font-weight: var(--font-weight-medium);
  line-height: var(--line-height-tight);
  color: var(--color-text-primary);
}

.auth-title-row {
  display: flex;
  align-items: center;
  gap: var(--space-field-toggle-gap);
}

.auth-title-row .auth-title {
  flex: 1;
  min-width: var(--min-width-flex);
}

.auth-title-back {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  margin-inline-start: -8px;
  color: var(--color-text-primary);
  text-decoration: none;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;
}

@media (hover: hover) {
  .auth-title-back:hover {
    background-color: var(--color-border-subtle);
  }
}

.auth-title-back:focus {
  outline: none;
}

.auth-title-back:focus-visible {
  outline: var(--width-shell-outline) solid var(--color-focus-ring);
  outline-offset: var(--offset-shell-outline);
}

.auth-title-back-icon {
  display: block;
}

.auth-intro {
  margin: var(--space-none);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-relaxed);
}

.auth-alerts {
  display: flex;
  flex-direction: column;
  gap: var(--space-auth-footer-gap);
}

.auth-error {
  margin: var(--space-none);
  color: var(--color-error);
  font-size: var(--font-size-body-xs);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-snug);
}

.auth-hint {
  margin: var(--space-none);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-normal);
  line-height: var(--line-height-snug);
}

.auth-below-btn {
  margin-top: var(--space-tertiary-top);
  text-align: center;
  line-height: var(--line-height-relaxed);
}
</style>
