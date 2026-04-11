import { describe, expect, it } from 'vitest'
import {
  AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED,
  AUTH_FIELD_ERROR_EMAIL_NOT_FOUND,
  AUTH_FIELD_ERROR_INVALID_CREDENTIALS,
} from '@/shared/config/authFieldErrors'
import { presentAuthApiError } from './presentAuthApiError'

describe('presentAuthApiError', () => {
  describe('email errors → fieldScope: email', () => {
    it('user not found → "Нет аккаунтов с таким e-mail"', () => {
      const r = presentAuthApiError('user not found')
      expect(r.message).toBe(AUTH_FIELD_ERROR_EMAIL_NOT_FOUND)
      expect(r.fieldScope).toBe('email')
    })

    it('email already registered → "Этот адрес уже зарегистрирован"', () => {
      const r = presentAuthApiError('email already registered')
      expect(r.message).toBe(AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED)
      expect(r.fieldScope).toBe('email')
    })

    it('invalid email format (nested в invalid email:)', () => {
      const r = presentAuthApiError('invalid email: invalid email format')
      expect(r.fieldScope).toBe('email')
      expect(r.message).toBeTruthy()
    })

    it('email address cannot be empty', () => {
      const r = presentAuthApiError('invalid email: email address cannot be empty')
      expect(r.fieldScope).toBe('email')
      expect(r.message).toContain('почты')
    })
  })

  describe('password errors → fieldScope: password', () => {
    it('invalid credentials → "Введены неверные данные"', () => {
      const r = presentAuthApiError('invalid credentials')
      expect(r.message).toBe(AUTH_FIELD_ERROR_INVALID_CREDENTIALS)
      expect(r.fieldScope).toBe('password')
    })

    it('invalid password: at least 8 characters', () => {
      const r = presentAuthApiError('invalid password: at least 8 characters')
      expect(r.fieldScope).toBe('password')
      expect(r.message).toContain('8')
    })

    it('password must contain uppercase letter', () => {
      const r = presentAuthApiError('password must contain uppercase letter')
      expect(r.fieldScope).toBe('password')
    })
  })

  describe('rate limit и generic errors → fieldScope: all', () => {
    it('too many login attempts → fieldScope: all', () => {
      const r = presentAuthApiError('too many login attempts, please try again later')
      expect(r.fieldScope).toBe('all')
      expect(r.message).toContain('Слишком много')
    })

    it('too many reset attempts → fieldScope: all', () => {
      const r = presentAuthApiError('too many reset attempts, please try again later')
      expect(r.fieldScope).toBe('all')
    })

    it('неизвестная ошибка → возвращается as-is, fieldScope: all', () => {
      const raw = 'some unknown backend error'
      const r = presentAuthApiError(raw)
      expect(r.message).toBe(raw)
      expect(r.fieldScope).toBe('all')
    })
  })
})
