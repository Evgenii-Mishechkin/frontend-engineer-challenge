import { describe, it, expect, vi, beforeEach } from 'vitest'
import { withSetup } from '@/tests/withSetup'
import {
  AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED,
  AUTH_FIELD_ERROR_INVALID_EMAIL,
  AUTH_FIELD_ERROR_PASSWORDS_MISMATCH,
} from '@/shared/config/authFieldErrors'
import { useRegisterForm } from './registerForm'

vi.mock('@/entities/session/auth.api', () => ({
  apiRegister: vi.fn(),
}))

import { apiRegister } from '@/entities/session/auth.api'
const mockRegister = vi.mocked(apiRegister)

describe('useRegisterForm', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('невалидный email → emailFieldError, API не вызывается', () => {
    const { result } = withSetup(() => useRegisterForm())

    result.email.value = 'invalid'
    result.password.value = 'Password1!'
    result.passwordConfirm.value = 'Password1!'
    result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_INVALID_EMAIL)
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('пароли не совпадают → passwordConfirmFieldError', () => {
    const { result } = withSetup(() => useRegisterForm())

    result.email.value = 'user@example.com'
    result.password.value = 'Password1!'
    result.passwordConfirm.value = 'Different1!'
    result.submit()

    expect(result.passwordConfirmFieldError.value).toBe(AUTH_FIELD_ERROR_PASSWORDS_MISMATCH)
    expect(mockRegister).not.toHaveBeenCalled()
  })

  it('email уже занят → emailFieldError inline, errorMessage пустой', async () => {
    mockRegister.mockRejectedValue(new Error('email already registered'))

    const { result } = withSetup(() => useRegisterForm())
    result.email.value = 'taken@example.com'
    result.password.value = 'Password1!'
    result.passwordConfirm.value = 'Password1!'
    await result.submit()

    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED)
    expect(result.errorMessage.value).toBe('')
  })

  it('ошибка пароля с бэка → errorMessage (не emailFieldError)', async () => {
    mockRegister.mockRejectedValue(new Error('invalid password: at least 8 characters'))

    const { result } = withSetup(() => useRegisterForm())
    result.email.value = 'user@example.com'
    result.password.value = 'weak'
    result.passwordConfirm.value = 'weak'
    await result.submit()

    expect(result.errorMessage.value).not.toBe('')
    expect(result.emailFieldError.value).toBe('')
  })

  it('успешная регистрация → редирект на login с query registered=1', async () => {
    mockRegister.mockResolvedValue({
      id: '1',
      email: 'user@example.com',
      status: 'active',
    })

    const { result, router } = withSetup(() => useRegisterForm(), {
      routes: [{ path: '/login', name: 'login' }],
    })
    const pushSpy = vi.spyOn(router, 'push')

    result.email.value = 'user@example.com'
    result.password.value = 'Password1!'
    result.passwordConfirm.value = 'Password1!'
    await result.submit()

    expect(result.emailFieldError.value).toBe('')
    expect(result.errorMessage.value).toBe('')
    expect(pushSpy).toHaveBeenCalledWith(
      expect.objectContaining({ name: 'login', query: { registered: '1' } }),
    )
  })

  it('повторный submit очищает предыдущие ошибки полей', async () => {
    mockRegister
      .mockRejectedValueOnce(new Error('email already registered'))
      .mockResolvedValueOnce({ id: '1', email: 'user@example.com', status: 'active' })

    const { result } = withSetup(() => useRegisterForm(), {
      routes: [{ path: '/login', name: 'login' }],
    })
    result.email.value = 'taken@example.com'
    result.password.value = 'Password1!'
    result.passwordConfirm.value = 'Password1!'
    await result.submit()
    expect(result.emailFieldError.value).toBe(AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED)

    result.email.value = 'new@example.com'
    await result.submit()
    expect(result.emailFieldError.value).toBe('')
  })
})
