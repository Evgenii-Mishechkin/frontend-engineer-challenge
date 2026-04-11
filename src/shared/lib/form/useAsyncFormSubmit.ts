import { presentAuthApiError } from '@/shared/lib/api/presentAuthApiError'
import type { AuthApiFormErrorScope } from '@/shared/lib/authFormInject'
import { ref } from 'vue'

/**
 * Общий цикл async-отправки формы: loading + текст ошибки из throw (RU + область подсветки полей).
 */
export function useAsyncFormSubmit() {
  const loading = ref(false)
  const errorMessage = ref('')
  const apiErrorFieldScope = ref<AuthApiFormErrorScope>('none')

  function clearError() {
    errorMessage.value = ''
    apiErrorFieldScope.value = 'none'
  }

  async function execute(fn: () => Promise<void>) {
    errorMessage.value = ''
    apiErrorFieldScope.value = 'none'
    loading.value = true
    try {
      await fn()
    } catch (e) {
      const raw = e instanceof Error ? e.message : String(e)
      const { message, fieldScope } = presentAuthApiError(raw)
      errorMessage.value = message
      apiErrorFieldScope.value = fieldScope
    } finally {
      loading.value = false
    }
  }

  return { loading, errorMessage, apiErrorFieldScope, execute, clearError }
}
