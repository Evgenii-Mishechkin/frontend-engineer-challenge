import {
  AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED,
  AUTH_FIELD_ERROR_EMAIL_NOT_FOUND,
  AUTH_FIELD_ERROR_INVALID_CREDENTIALS,
} from '@/shared/config/authFieldErrors'
import type { AuthApiFormErrorScope } from '@/shared/lib/authFormInject'

/**
 * Сообщения с бэка (Go) → текст для UI и область красной границы полей.
 */
export function presentAuthApiError(raw: string): {
  message: string
  fieldScope: AuthApiFormErrorScope
} {
  const m = raw.toLowerCase()

  if (isPasswordApiError(m)) {
    return { message: translatePasswordApiError(raw), fieldScope: 'password' }
  }
  if (isEmailApiError(m)) {
    return { message: translateEmailApiError(raw), fieldScope: 'email' }
  }

  if (m.includes('invalid credentials')) {
    return { message: AUTH_FIELD_ERROR_INVALID_CREDENTIALS, fieldScope: 'password' }
  }

  return { message: translateGenericAuthError(raw), fieldScope: 'all' }
}

function isPasswordApiError(m: string): boolean {
  return (
    m.includes('invalid password:') ||
    m.startsWith('password must ') ||
    m.includes('failed to hash password')
  )
}

function isEmailApiError(m: string): boolean {
  return (
    m.includes('invalid email:') ||
    m.includes('email already registered') ||
    m.includes('email address cannot be empty') ||
    m.includes('invalid email format') ||
    m.includes('email address too long') ||
    m.includes('user not found')
  )
}

function translatePasswordApiError(raw: string): string {
  const inner = raw.replace(/^invalid password:\s*/i, '').trim()
  const t = inner.toLowerCase()

  const atLeast = inner.match(/at least (\d+) characters/i)
  if (atLeast) {
    return `Пароль должен быть не короче ${atLeast[1]} символов`
  }
  if (t.includes('must not exceed 128')) {
    return 'Пароль не может быть длиннее 128 символов'
  }
  if (t.includes('uppercase letter')) {
    return 'В пароле должна быть хотя бы одна заглавная буква'
  }
  if (t.includes('lowercase letter')) {
    return 'В пароле должна быть хотя бы одна строчная буква'
  }
  if (t.includes('one digit') || t.includes('at least one digit')) {
    return 'В пароле должна быть хотя бы одна цифра'
  }
  if (t.includes('special character')) {
    return 'В пароле должен быть хотя бы один спецсимвол'
  }
  if (t.includes('failed to hash password')) {
    return 'Не удалось обработать пароль. Попробуйте другой.'
  }
  return inner || raw
}

function translateEmailApiError(raw: string): string {
  const inner = raw.replace(/^invalid email:\s*/i, '').trim()
  const t = inner.toLowerCase()
  const m = raw.toLowerCase()

  if (m.includes('email already registered')) {
    return AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED
  }
  if (t.includes('cannot be empty')) {
    return 'Укажите адрес почты'
  }
  if (t.includes('invalid email format')) {
    return 'Недопустимый адрес почты'
  }
  if (t.includes('too long')) {
    return 'Слишком длинный адрес почты'
  }
  if (m.includes('user not found')) {
    return AUTH_FIELD_ERROR_EMAIL_NOT_FOUND
  }
  return inner || raw
}

function translateGenericAuthError(raw: string): string {
  const m = raw.toLowerCase()

  if (m === 'unauthorized') {
    return 'Введены неверные данные'
  }
  if (m.includes('too many registration attempts')) {
    return 'Слишком много попыток регистрации. Попробуйте позже.'
  }
  if (m.includes('too many login attempts')) {
    return 'Слишком много попыток входа. Попробуйте позже.'
  }
  if (m.includes('too many reset attempts')) {
    return 'Слишком много попыток сброса. Попробуйте позже.'
  }
  if (m.includes('invalid reset request')) {
    return 'Неверные данные для сброса пароля'
  }
  if (m.includes('password reset failed')) {
    return 'Не удалось сменить пароль. Проверьте токен и срок действия ссылки.'
  }
  if (m.includes('empty login response') || m.includes('empty register response')) {
    return 'Пустой ответ сервера'
  }
  if (m.includes('delete account failed')) {
    return 'Не удалось удалить учётную запись'
  }

  return raw
}
