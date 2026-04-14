import { graphqlUrl } from '@/shared/config/env'

export type GraphQLErrorPayload = {
  message: string
}

export type GraphQLResponse<TData> = {
  data?: TData
  errors?: GraphQLErrorPayload[]
}

/** Ошибка HTTP-транспорта с кодом статуса. Используется интерсептором для перехвата 401. */
export class HttpError extends Error {
  constructor(
    public readonly status: number,
    statusText: string,
  ) {
    super(`GraphQL: HTTP ${status} ${statusText}`.trim())
    this.name = 'HttpError'
  }
}

/**
 * Один POST на `/graphql` с телом `{ query, variables }`.
 * Для защищённых операций передайте access token.
 */
export async function graphqlRequest<TData>(
  query: string,
  options?: {
    variables?: Record<string, unknown>
    accessToken?: string | null
    signal?: AbortSignal
  },
): Promise<GraphQLResponse<TData>> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  }
  const token = options?.accessToken
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const res = await fetch(graphqlUrl, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables: options?.variables ?? {},
    }),
    signal: options?.signal,
  })

  const text = await res.text()
  let body: unknown
  try {
    body = text ? JSON.parse(text) : {}
  } catch {
    throw new Error(`GraphQL: response is not JSON (HTTP ${res.status})`)
  }

  if (!res.ok) {
    throw new HttpError(res.status, res.statusText)
  }

  return body as GraphQLResponse<TData>
}
