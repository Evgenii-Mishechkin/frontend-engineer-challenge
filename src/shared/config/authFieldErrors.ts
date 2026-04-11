/**
 * Тексты ошибок полей auth-форм — как в макете Orbitto (Figma).
 * - E-mail: frame 102:12326
 * - Несовпадение паролей: frame 102:12408 («Повторите пароль», оба поля с красной границей)
 */
export const AUTH_FIELD_ERROR_INVALID_EMAIL = 'Недопустимый адрес почты'

/** Email введён в правильном формате, но не зарегистрирован в системе. */
export const AUTH_FIELD_ERROR_EMAIL_NOT_FOUND = 'Нет аккаунтов с таким e-mail'

/** Email уже занят другим аккаунтом (регистрация). */
export const AUTH_FIELD_ERROR_EMAIL_ALREADY_REGISTERED = 'Этот адрес уже зарегистрирован'

/**
 * Неверная пара email/пароль (логин).
 * Бэк намеренно не уточняет, что именно неверно — anti-enumeration.
 */
export const AUTH_FIELD_ERROR_INVALID_CREDENTIALS = 'Введены неверные данные'

export const AUTH_FIELD_ERROR_PASSWORDS_MISMATCH = 'Пароли не совпадают'

/** Отдельного кадра в файле нет; формулировка согласована с полем «Токен сброса». */
export const AUTH_FIELD_ERROR_RESET_TOKEN_EMPTY = 'Укажите токен сброса'
