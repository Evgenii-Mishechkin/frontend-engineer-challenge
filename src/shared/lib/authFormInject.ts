import type { ComputedRef, InjectionKey } from 'vue'

/** Какие поля подсвечивать при ошибке API (не «все подряд»). */
export type AuthApiFormErrorScope = 'none' | 'all' | 'email' | 'password'

export const authFormApiErrorScopeKey: InjectionKey<ComputedRef<AuthApiFormErrorScope>> =
  Symbol('authFormApiErrorScope')

/** Сбросить сообщение об ошибке формы (при вводе в поле). */
export const authFormClearErrorKey: InjectionKey<() => void> = Symbol('authFormClearError')

/** Текущее текстовое сообщение ошибки формы (для показа inline в поле при нужном scope). */
export const authFormErrorMessageKey: InjectionKey<ComputedRef<string>> =
  Symbol('authFormErrorMessage')
