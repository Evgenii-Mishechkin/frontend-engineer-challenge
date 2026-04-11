import { graphqlRequest } from '@/shared/api/graphql'
import { firstGraphQLErrorMessage } from '@/shared/api/graphqlErrors'
import type { SessionUser } from '@/entities/session/types'

const M_LOGIN = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      accessToken
      refreshToken
      user {
        id
        email
        status
      }
    }
  }
`

const M_REFRESH = `
  mutation Refresh($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      accessToken
      refreshToken
    }
  }
`

const M_LOGOUT = `
  mutation Logout($refreshToken: String!) {
    logout(refreshToken: $refreshToken)
  }
`

const M_REGISTER = `
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      id
      email
      status
    }
  }
`

const M_REQUEST_PASSWORD_RESET = `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(email: $email) {
      success
      token
    }
  }
`

const M_RESET_PASSWORD = `
  mutation ResetPassword($email: String!, $token: String!, $newPassword: String!) {
    resetPassword(email: $email, token: $token, newPassword: $newPassword)
  }
`

const M_DELETE_MY_ACCOUNT = `
  mutation DeleteMyAccount {
    deleteMyAccount
  }
`

export type LoginResult = {
  accessToken: string
  refreshToken: string
  user: SessionUser
}

export async function apiLogin(email: string, password: string): Promise<LoginResult> {
  const r = await graphqlRequest<{
    login: LoginResult
  }>(M_LOGIN, {
    variables: { email, password },
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (!r.data?.login) {
    throw new Error('Empty login response')
  }
  return r.data.login
}

export async function apiRefresh(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
  const r = await graphqlRequest<{
    refreshToken: { accessToken: string; refreshToken: string }
  }>(M_REFRESH, {
    variables: { refreshToken },
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (!r.data?.refreshToken) {
    throw new Error('Empty refreshToken response')
  }
  return r.data.refreshToken
}

export async function apiLogout(refreshToken: string): Promise<void> {
  const r = await graphqlRequest<{ logout: boolean }>(M_LOGOUT, {
    variables: { refreshToken },
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
}

export type RegisterResult = {
  id: string
  email: string
  status: string
}

export async function apiRegister(email: string, password: string): Promise<RegisterResult> {
  const r = await graphqlRequest<{ register: RegisterResult }>(M_REGISTER, {
    variables: { email, password },
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (!r.data?.register) {
    throw new Error('Empty register response')
  }
  return r.data.register
}

export type RequestPasswordResetResult = {
  success: boolean
  token: string | null
}

export async function apiRequestPasswordReset(
  email: string,
): Promise<RequestPasswordResetResult> {
  const r = await graphqlRequest<{ requestPasswordReset: RequestPasswordResetResult }>(
    M_REQUEST_PASSWORD_RESET,
    { variables: { email } },
  )
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (!r.data?.requestPasswordReset) {
    throw new Error('Empty requestPasswordReset response')
  }
  return r.data.requestPasswordReset
}

export async function apiResetPassword(
  email: string,
  token: string,
  newPassword: string,
): Promise<void> {
  const r = await graphqlRequest<{ resetPassword: boolean }>(M_RESET_PASSWORD, {
    variables: { email, token, newPassword },
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (r.data?.resetPassword !== true) {
    throw new Error('Password reset failed')
  }
}

/** Удаление текущего пользователя (Bearer access token). */
export async function apiDeleteMyAccount(accessToken: string): Promise<void> {
  const r = await graphqlRequest<{ deleteMyAccount: boolean }>(M_DELETE_MY_ACCOUNT, {
    accessToken,
  })
  if (r.errors?.length) {
    throw new Error(firstGraphQLErrorMessage(r.errors))
  }
  if (r.data?.deleteMyAccount !== true) {
    throw new Error('Delete account failed')
  }
}
