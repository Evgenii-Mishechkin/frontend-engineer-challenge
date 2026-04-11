import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withSetup } from '@/tests/withSetup'
import {
  AUTH_FIELD_ERROR_INVALID_CREDENTIALS,
  AUTH_FIELD_ERROR_INVALID_EMAIL,
} from '@/shared/config/authFieldErrors'
import { useLoginForm } from './loginForm'

// Один shared-экземпляр — и composable, и тест держат одну ссылку
const mockLogin = vi.fn()

vi.mock('@/entities/session', () => ({
  useSessionStore: vi.fn(() => ({ login: mockLogin })),
}))

vi.mock('@/app/router/redirect', () => ({
  resolvePostLoginRedirect: vi.fn(() => '/'),
}))

describe('useLoginForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('невалидный email → emailFieldError, login не вызывается', () => {
    const { result } = withSetup(() => useLoginForm())

    result.email.value = 'bad-email'
    result.password.value = 'password123'
    result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_EMAIL)
    expect(mockLogin).not.toHaveBeenCalled()
  })

  it('неверные credentials → passwordFieldError, errorMessage пустой', async () => {
    mockLogin.mockRejectedValue(new Error('invalid credentials'))

    const { result } = withSetup(() => useLoginForm())
    result.email.value = 'user@example.com'
    result.password.value = 'wrongpass'
    await result.submit()

    expect(result.passwordFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_CREDENTIALS)
    expect(result.errorMessage.value).toBe('')
  })

  it('неизвестная ошибка → errorMessage (баннер), passwordFieldError пустой', async () => {
    mockLogin.mockRejectedValue(new Error('some unexpected server error'))

    const { result } = withSetup(() => useLoginForm())
    result.email.value = 'user@example.com'
    result.password.value = 'pass'
    await result.submit()

    expect(result.errorMessage.value).not.toBe('')
    expect(result.passwordFieldError.value).toBe('')
  })

  it('успех → редирект, ошибок нет', async () => {
    mockLogin.mockResolvedValue(undefined)

    const { result, router } = withSetup(() => useLoginForm())
    const pushSpy = vi.spyOn(router, 'push')

    result.email.value = 'user@example.com'
    result.password.value = 'correct'
    await result.submit()

    expect(result.passwordFieldError.value).toBe('')
    expect(result.errorMessage.value).toBe('')
    expect(pushSpy).toHaveBeenCalled()
  })

  it('clearError сбрасывает errorMessage и apiErrorFieldScope', async () => {
    mockLogin.mockRejectedValue(new Error('some unexpected server error'))

    const { result } = withSetup(() => useLoginForm())
    result.email.value = 'user@example.com'
    result.password.value = 'pass'
    await result.submit()

    expect(result.errorMessage.value).not.toBe('')
    result.clearError()
    expect(result.errorMessage.value).toBe('')
  })

  it('повторный submit сбрасывает предыдущий passwordFieldError', async () => {
    mockLogin
      .mockRejectedValueOnce(new Error('invalid credentials'))
      .mockResolvedValueOnce(undefined)

    const { result } = withSetup(() => useLoginForm())
    result.email.value = 'user@example.com'
    result.password.value = 'wrongpass'
    await result.submit()
    expect(result.passwordFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_CREDENTIALS)

    result.password.value = 'correctpass'
    await result.submit()
    expect(result.passwordFieldError.value).toBe('')
  })
})
