import { resolvePostLoginRedirect } from '@/app/router/redirect'
import { useSessionStore } from '@/entities/session'
import {
  AUTH_FIELD_ERROR_INVALID_CREDENTIALS,
  AUTH_FIELD_ERROR_INVALID_EMAIL,
} from '@/shared/config/authFieldErrors'
import { useAsyncFormSubmit } from '@/shared/lib/form/useAsyncFormSubmit'
import { isValidEmail } from '@/shared/lib/validation/isValidEmail'
import { computed, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useLoginForm() {
  const route = useRoute()
  const router = useRouter()
  const session = useSessionStore()
  const { loading, errorMessage, apiErrorFieldScope, execute, clearError } = useAsyncFormSubmit()

  const email = ref('')
  const password = ref('')
  const emailFieldError = ref('')
  const passwordFieldError = ref('')

  const statusHint = computed(() =>
    route.query.registered === '1' ? 'Регистрация прошла успешно. Войдите ниже.' : undefined,
  )

  function submit() {
    clearError()
    emailFieldError.value = ''
    passwordFieldError.value = ''
    const trimmed = email.value.trim()
    if (!isValidEmail(trimmed)) {
      emailFieldError.value = AUTH_FIELD_ERROR_INVALID_EMAIL
      return
    }
    return execute(async () => {
      try {
        await session.login(trimmed, password.value)
      } catch (e) {
        /**
         * Бэк всегда возвращает "invalid credentials" и для неверного email,
         * и для неверного пароля — anti-enumeration.
         * Показываем ошибку inline под полем пароля.
         */
        const msg = e instanceof Error ? e.message.toLowerCase() : ''
        if (msg.includes('invalid credentials')) {
          passwordFieldError.value = AUTH_FIELD_ERROR_INVALID_CREDENTIALS
          return
        }
        throw e
      }
      await router.push(resolvePostLoginRedirect(route))
    })
  }

  return {
    email,
    password,
    loading,
    errorMessage,
    apiErrorFieldScope,
    statusHint,
    submit,
    clearError,
    emailFieldError,
    passwordFieldError,
  }
}
