import { apiResetPassword } from '@/entities/session/auth.api'
import {
  AUTH_FIELD_ERROR_INVALID_EMAIL,
  AUTH_FIELD_ERROR_PASSWORDS_MISMATCH,
  AUTH_FIELD_ERROR_RESET_TOKEN_EMPTY,
} from '@/shared/config/authFieldErrors'
import { useAsyncFormSubmit } from '@/shared/lib/form/useAsyncFormSubmit'
import { pickFirstQueryParam } from '@/shared/lib/router/pickFirstQueryParam'
import { isValidEmail } from '@/shared/lib/validation/isValidEmail'
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useResetPasswordForm() {
  const route = useRoute()
  const router = useRouter()
  const { loading, errorMessage, apiErrorFieldScope, execute, clearError } = useAsyncFormSubmit()

  const email = ref('')
  const token = ref('')
  const newPassword = ref('')
  const newPasswordConfirm = ref('')
  const done = ref(false)
  const emailFieldError = ref('')
  const tokenFieldError = ref('')
  const passwordConfirmFieldError = ref('')

  const queryValid = computed(() => Boolean(email.value.trim() && token.value.trim()))

  watch(
    () => route.query,
    (q) => {
      email.value = pickFirstQueryParam(q.email)
      token.value = pickFirstQueryParam(q.token)
    },
    { immediate: true, deep: true },
  )

  function submit() {
    clearError()
    emailFieldError.value = ''
    tokenFieldError.value = ''
    passwordConfirmFieldError.value = ''

    const trimmedEmail = email.value.trim()
    if (!isValidEmail(trimmedEmail)) {
      emailFieldError.value = AUTH_FIELD_ERROR_INVALID_EMAIL
      return
    }
    if (!token.value.trim()) {
      tokenFieldError.value = AUTH_FIELD_ERROR_RESET_TOKEN_EMPTY
      return
    }
    if (newPassword.value !== newPasswordConfirm.value) {
      passwordConfirmFieldError.value = AUTH_FIELD_ERROR_PASSWORDS_MISMATCH
      return
    }

    return execute(async () => {
      await apiResetPassword(trimmedEmail, token.value.trim(), newPassword.value)
      done.value = true
      await router.replace({ query: {} })
    })
  }

  return {
    email,
    token,
    newPassword,
    newPasswordConfirm,
    loading,
    errorMessage,
    apiErrorFieldScope,
    done,
    queryValid,
    submit,
    clearError,
    emailFieldError,
    tokenFieldError,
    passwordConfirmFieldError,
  }
}
