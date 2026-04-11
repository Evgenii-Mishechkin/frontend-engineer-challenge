import type { GraphQLErrorPayload } from '@/shared/api/graphql'

export function firstGraphQLErrorMessage(errors: GraphQLErrorPayload[] | undefined): string {
  if (!errors?.length) return 'Unknown GraphQL error'
  return errors.map((e) => e.message).join('; ')
}
