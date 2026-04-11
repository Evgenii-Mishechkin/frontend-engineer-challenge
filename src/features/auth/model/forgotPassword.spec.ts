import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { withSetup } from '@/tests/withSetup'
import {
  AUTH_FIELD_ERROR_EMAIL_NOT_FOUND,
  AUTH_FIELD_ERROR_INVALID_EMAIL,
} from '@/shared/config/authFieldErrors'
import { DEV_PW_RESET_STORAGE, useForgotPasswordRequest } from './forgotPassword'

// Мок API-слоя — изолируем HTTP от логики composable
vi.mock('@/entities/session/auth.api', () => ({
  apiRequestPasswordReset: vi.fn(),
}))

import { apiRequestPasswordReset } from '@/entities/session/auth.api'
const mockApi = vi.mocked(apiRequestPasswordReset)

describe('useForgotPasswordRequest', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    sessionStorage.clear()
  })

  afterEach(() => {
    sessionStorage.clear()
  })

  it('невалидный формат email → emailFieldError, API не вызывается', async () => {
    const { result } = withSetup(() => useForgotPasswordRequest())

    result.email.value = 'not-an-email'
    result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_EMAIL)
    expect(mockApi).not.toHaveBeenCalled()
  })

  it('пустой email → emailFieldError', async () => {
    const { result } = withSetup(() => useForgotPasswordRequest())

    result.email.value = ''
    result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_EMAIL)
  })

  it('email не найден (пустой token) → emailFieldError, нет редиректа', async () => {
    mockApi.mockResolvedValue({ success: true, token: '' })
    const { result, router } = withSetup(() => useForgotPasswordRequest())
    const pushSpy = vi.spyOn(router, 'replace')

    result.email.value = 'unknown@example.com'
    await result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_EMAIL_NOT_FOUND)
    expect(pushSpy).not.toHaveBeenCalled()
  })

  it('email не найден (null token) → emailFieldError', async () => {
    mockApi.mockResolvedValue({ success: true, token: null })
    const { result } = withSetup(() => useForgotPasswordRequest())

    result.email.value = 'unknown@example.com'
    await result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_EMAIL_NOT_FOUND)
  })

  it('успех → редирект на forgot-password-sent с email в query', async () => {
    mockApi.mockResolvedValue({ success: true, token: 'abc123' })
    const { result, router } = withSetup(() => useForgotPasswordRequest(), {
      routes: [{ path: '/forgot-password/sent', name: 'forgot-password-sent' }],
    })
    const replaceSpy = vi.spyOn(router, 'replace')

    result.email.value = 'user@example.com'
    await result.submit()

    expect(result.emailFieldError.value).toBe('')
    expect(replaceSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'forgot-password-sent',
        query: { email: 'user@example.com' },
      }),
    )
  })

  it('успех в DEV → токен сохраняется в sessionStorage', async () => {
    const originalDev = import.meta.env.DEV
    import.meta.env.DEV = true

    mockApi.mockResolvedValue({ success: true, token: 'tok-xyz' })
    const { result } = withSetup(() => useForgotPasswordRequest(), {
      routes: [{ path: '/forgot-password/sent', name: 'forgot-password-sent' }],
    })

    result.email.value = 'user@example.com'
    await result.submit()

    const stored = JSON.parse(sessionStorage.getItem(DEV_PW_RESET_STORAGE) ?? 'null')
    expect(stored).toEqual({ email: 'user@example.com', token: 'tok-xyz' })

    import.meta.env.DEV = originalDev
  })

  it('loading: true во время запроса, false после', async () => {
    let resolveApi!: (v: { success: boolean; token: string }) => void
    mockApi.mockReturnValue(new Promise((r) => { resolveApi = r }))
    const { result } = withSetup(() => useForgotPasswordRequest())

    result.email.value = 'user@example.com'
    const p = result.submit()

    expect(result.loading.value).toBe(true)
    resolveApi({ success: true, token: 'x' })
    await p

    expect(result.loading.value).toBe(false)
  })
})
