import { apiRegister } from '@/entities/session/auth.api'
import {
  AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED,
  AUTH_FIELD_ERROR_INVALID_EMAIL,
  AUTH_FIELD_ERROR_PASSWORDS_MISMATCH,
} from '@/shared/config/authFieldErrors'
import { useAsyncFormSubmit } from '@/shared/lib/form/useAsyncFormSubmit'
import { isValidEmail } from '@/shared/lib/validation/isValidEmail'
import { ref } from 'vue'
import { useRouter } from 'vue-router'

export function useRegisterForm() {
  const router = useRouter()
  const { loading, errorMessage, apiErrorFieldScope, execute, clearError } = useAsyncFormSubmit()

  const email = ref('')
  const password = ref('')
  const passwordConfirm = ref('')
  const emailFieldError = ref('')
  const passwordConfirmFieldError = ref('')

  function submit() {
    clearError()
    emailFieldError.value = ''
    passwordConfirmFieldError.value = ''

    const trimmed = email.value.trim()
    if (!isValidEmail(trimmed)) {
      emailFieldError.value = AUTH_FIELD_ERROR_INVALID_EMAIL
      return
    }
    if (password.value !== passwordConfirm.value) {
      passwordConfirmFieldError.value = AUTH_FIELD_ERROR_PASSWORDS_MISMATCH
      return
    }

    return execute(async () => {
      try {
        await apiRegister(trimmed, password.value)
      } catch (e) {
        const msg = e instanceof Error ? e.message.toLowerCase() : ''
        if (msg.includes('email already registered')) {
          /**
           * TODO: user enumeration via registration endpoint.
           *
           * Раскрытие факта существования email нарушает требования OWASP ASVS
           * (V2.7 — Out of Band Verifier Requirements) и CWE-204 (Observable
           * Response Discrepancy). Атакующий может перебирать адреса, отправляя
           * POST-запросы и анализируя inline-ошибку под полем.
           *
           * Рекомендуемое устранение (в порядке приоритета):
           *   1. Перейти на email-confirmation flow: всегда возвращать нейтральный
           *      ответ («Если адрес свободен, письмо с подтверждением отправлено»),
           *      фактическое состояние сообщать только в письме.
           *   2. Ввести rate limiting на уровне API (по IP и по email) совместно
           *      с CAPTCHA для снижения практической применимости атаки при
           *      сохранении текущего UX.
           */
          emailFieldError.value = AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED
          return
        }
        throw e
      }
      await router.push({ name: 'login', query: { registered: '1' } })
    })
  }

  return {
    email,
    password,
    passwordConfirm,
    loading,
    errorMessage,
    apiErrorFieldScope,
    submit,
    clearError,
    emailFieldError,
    passwordConfirmFieldError,
  }
}
