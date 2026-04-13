import { apiRequestPasswordReset } from '@/entities/session/auth.api'
import { AUTH_FIELD_ERROR_INVALID_EMAIL } from '@/shared/config/authFieldErrors'
import { useAsyncFormSubmit } from '@/shared/lib/form/useAsyncFormSubmit'
import { isValidEmail } from '@/shared/lib/validation/isValidEmail'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

/** Ключ для dev-подсказки сброса пароля (также читается в ForgotPasswordSentPage). */
export const DEV_PW_RESET_STORAGE = 'atlantis-dev-pw-reset'

export function useForgotPasswordRequest() {
  const router = useRouter()
  const { loading, errorMessage, apiErrorFieldScope, execute, clearError } = useAsyncFormSubmit()
  const email = ref('')
  const emailFieldError = ref('')

  function submit() {
    clearError()
    emailFieldError.value = ''
    if (!isValidEmail(email.value)) {
      emailFieldError.value = AUTH_FIELD_ERROR_INVALID_EMAIL
      return
    }
    return execute(async () => {
      const trimmed = email.value.trim()
      const r = await apiRequestPasswordReset(trimmed)

      /**
       * Бэк всегда возвращает success: true и не раскрывает, зарегистрирован ли email
       * (anti-enumeration на уровне Go — resolver.go всегда пишет "success": true,
       * при незнакомом email token остаётся пустым).
       *
       * Фронт намеренно игнорирует различие пустой/непустой token и всегда переходит
       * на страницу «письмо отправлено». Это необходимо, чтобы исключить возможность
       * перебора зарегистрированных адресов через реакцию UI.
       *
       * В dev-режиме токен сохраняется в sessionStorage только когда он непустой —
       * это не раскрывает информацию пользователям, т.к. доступно лишь в сборке DEV.
       */
      const devToken = r.token?.trim() ?? ''

      if (import.meta.env.DEV && devToken) {
        sessionStorage.setItem(DEV_PW_RESET_STORAGE, JSON.stringify({ email: trimmed, token: devToken }))
      }

      await router.replace({
        name: 'forgot-password-sent',
        query: { email: trimmed },
      })
    })
  }

  return {
    email,
    loading,
    errorMessage,
    apiErrorFieldScope,
    submit,
    clearError,
    emailFieldError,
  }
}
