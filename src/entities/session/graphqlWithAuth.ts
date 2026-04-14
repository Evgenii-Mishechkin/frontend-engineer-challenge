import { graphqlRequest, HttpError } from '@/shared/api/graphql'
import type { GraphQLResponse } from '@/shared/api/graphql'
import { useSessionStore } from '@/entities/session/session.store'

/**
 * Обёртка над graphqlRequest для защищённых операций.
 *
 * Автоматически:
 *   1. Подставляет текущий access token из сессии.
 *   2. Определяет истёкший токен двумя способами:
 *      - HTTP 401 (транспортный уровень)
 *      - GraphQL-ошибка "unauthorized" в теле при HTTP 200 (стандарт GraphQL —
 *        транспорт всегда 200, статус операции передаётся в errors[])
 *   3. При обнаружении auth-ошибки выполняет ротацию токена и повторяет запрос.
 *   4. Если ротация не удалась — сессия сбрасывается внутри refreshAccessToken;
 *      ошибка пробрасывается наружу, навигационный гард перенаправит на /login.
 *
 * Использовать вместо graphqlRequest для всех мутаций и запросов,
 * требующих заголовка Authorization.
 *
 * ПРИМЕЧАНИЕ: useSessionStore() вызывается внутри тела функции, а не на уровне
 * модуля. Это делает мягкий циклический импорт (store → protectedApi →
 * graphqlWithAuth → store) безопасным: к моменту первого вызова все ES-модули
 * уже полностью инициализированы (live bindings).
 */
export async function graphqlRequestWithAuth<TData>(
  query: string,
  options?: {
    variables?: Record<string, unknown>
    signal?: AbortSignal
  },
): Promise<GraphQLResponse<TData>> {
  const session = useSessionStore()

  let result: GraphQLResponse<TData>

  try {
    result = await graphqlRequest<TData>(query, {
      ...options,
      accessToken: session.accessToken,
    })
  } catch (err) {
    // HTTP-уровень: транспортный 401
    if (!(err instanceof HttpError) || err.status !== 401) throw err

    const refreshed = await session.refreshAccessToken()
    if (!refreshed) throw err

    return graphqlRequest<TData>(query, {
      ...options,
      accessToken: session.accessToken,
    })
  }

  // GraphQL-уровень: HTTP 200, но в теле errors[] содержит "unauthorized".
  // Это стандартное поведение GraphQL-серверов — транспорт всегда 200.
  if (isUnauthorizedGraphQLError(result)) {
    const refreshed = await session.refreshAccessToken()
    if (!refreshed) return result // сессия сброшена, вернём ошибку — гард → /login

    return graphqlRequest<TData>(query, {
      ...options,
      accessToken: session.accessToken,
    })
  }

  return result
}

function isUnauthorizedGraphQLError(r: GraphQLResponse<unknown>): boolean {
  return (
    r.errors?.some((e) => e.message.toLowerCase() === 'unauthorized') ?? false
  )
}
