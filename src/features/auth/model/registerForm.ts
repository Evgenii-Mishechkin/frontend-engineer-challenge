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
