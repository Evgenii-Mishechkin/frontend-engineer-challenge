/** Пользователь в контексте сессии (после login / me). */
export type SessionUser = {
  id: string
  email: string
  status: string
}
