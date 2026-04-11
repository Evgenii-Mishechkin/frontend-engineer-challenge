import type { SessionUser } from '@/entities/session/types'

const STORAGE_KEY = 'atlantis.session.v1'

export type PersistedSession = {
  accessToken: string
  refreshToken: string
  user: SessionUser
}

export function loadPersistedSession(): PersistedSession | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as PersistedSession
    if (
      typeof parsed.accessToken !== 'string' ||
      typeof parsed.refreshToken !== 'string' ||
      !parsed.user ||
      typeof parsed.user.id !== 'string' ||
      typeof parsed.user.email !== 'string' ||
      typeof parsed.user.status !== 'string'
    ) {
      return null
    }
    return parsed
  } catch {
    return null
  }
}

export function persistSession(data: PersistedSession): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function clearPersistedSession(): void {
  localStorage.removeItem(STORAGE_KEY)
}
