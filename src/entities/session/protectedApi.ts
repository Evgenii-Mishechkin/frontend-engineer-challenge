import { firstGraphQLErrorMessage } from '@/shared/api/graphqlErrors'
import { graphqlRequestWithAuth } from '@/entities/session/graphqlWithAuth'

const M_DELETE_MY_ACCOUNT = `
  mutation DeleteMyAccount {
    deleteMyAccount
  }
`

/** Удаление текущего пользователя. Требует действующей сессии; при истёкшем
 *  access token автоматически выполняет ротацию через graphqlRequestWithAuth. */
export async function apiDeleteMyAccount(): Promise<void> {
  const r = await graphqlRequestWithAuth<{ deleteMyAccount: boolean }>(M_DELETE_MY_ACCOUNT)
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (r.data?.deleteMyAccount !== true) {
    throw new Error('Delete account failed')
  }
}
