import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiDeleteMyAccount, apiLogin, apiLogout, apiRefresh } from '@/entities/session/auth.api'
import {
  clearPersistedSession,
  loadPersistedSession,
  persistSession,
} from '@/entities/session/storage'
import type { SessionUser } from '@/entities/session/types'

export const useSessionStore = defineStore('session', () => {
  const accessToken = ref<string | null>(null)
  const refreshToken = ref<string | null>(null)
  const user = ref<SessionUser | null>(null)

  const isAuthenticated = computed(
    () => Boolean(accessToken.value && refreshToken.value && user.value),
  )

  let refreshPromise: Promise<boolean> | null = null

  function persistCurrent(): void {
    const a = accessToken.value
    const rt = refreshToken.value
    const u = user.value
    if (a && rt && u) {
      persistSession({ accessToken: a, refreshToken: rt, user: u })
    } else {
      clearPersistedSession()
    }
  }

  function hydrateFromStorage(): void {
    const saved = loadPersistedSession()
    if (!saved) return
    accessToken.value = saved.accessToken
    refreshToken.value = saved.refreshToken
    user.value = saved.user
  }

  function setSession(payload: {
    accessToken: string
    refreshToken: string
    user: SessionUser
  }): void {
    accessToken.value = payload.accessToken
    refreshToken.value = payload.refreshToken
    user.value = payload.user
    persistCurrent()
  }

  function clearSession(): void {
    accessToken.value = null
    refreshToken.value = null
    user.value = null
    clearPersistedSession()
  }

  async function login(email: string, password: string): Promise<void> {
    const data = await apiLogin(email, password)
    setSession({
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      user: data.user,
    })
  }

  /**
   * Ротация пары токенов на бэкенде. При ошибке сессия сбрасывается.
   * Повторные вызовы, пока идёт запрос, возвращают тот же Promise (anti-race).
   *
   * Вызывается из HTTP-интерсептора при 401 (планируется в shared/api/httpClient).
   */
  async function refreshAccessToken(): Promise<boolean> {
    const rt = refreshToken.value
    if (!rt) return false
    if (refreshPromise) return refreshPromise

    refreshPromise = (async () => {
      try {
        const pair = await apiRefresh(rt)
        accessToken.value = pair.accessToken
        refreshToken.value = pair.refreshToken
        persistCurrent()
        return true
      } catch {
        clearSession()
        return false
      } finally {
        refreshPromise = null
      }
    })()

    return refreshPromise
  }

  /** Серверная инвалидация сессии + локальная очистка. */
  async function logout(): Promise<void> {
    const rt = refreshToken.value
    if (rt) {
      try {
        await apiLogout(rt)
      } catch {
        /* сеть / бэк — всё равно чистим локально */
      }
    }
    clearSession()
  }

  /** Удаление учётной записи на сервере и локальная очистка сессии. */
  async function deleteAccount(): Promise<void> {
    const at = accessToken.value
    if (!at) {
      clearSession()
      return
    }
    await apiDeleteMyAccount(at)
    clearSession()
  }

  return {
    accessToken,
    refreshToken,
    user,
    isAuthenticated,
    hydrateFromStorage,
    setSession,
    clearSession,
    login,
    refreshAccessToken,
    logout,
    deleteAccount,
  }
})
