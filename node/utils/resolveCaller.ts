import { AuthenticationError, ForbiddenError, ResolverError } from '@vtex/api'

import type { VtexIdCredentialInfo } from '../clients/vtexIdCredential'
import { getUserProfileFromSession } from './getUserProfileFromSession'

const VTEX_SESSION = 'vtex_session'

const warnAdminVerification = (ctx: Context, reason: string) => {
  ctx.vtex.logger.warn({
    message: 'MR-1601 admin verification failed',
    reason,
  })
}

const errorReason = (error: unknown) =>
  error instanceof Error ? error.message : 'unknown error'

/**
 * Verifies that the token is a valid VTEX ID admin token whose login is
 * granted in the current account. Fails closed: any error returns null.
 * The token account is not compared with the current account, so logins
 * and appkeys granted from another account keep working.
 */
export const verifyAdminToken = async (
  ctx: Context,
  token?: string
): Promise<VtexIdCredentialInfo | null> => {
  if (!token) return null

  const { vtexIdCredential, licenseManagerClient } = ctx.clients

  try {
    const info = await vtexIdCredential.validate(token)

    if (info?.authStatus !== 'Success') {
      warnAdminVerification(ctx, 'auth-status')

      return null
    }

    if (info.audience !== 'admin') {
      return null
    }

    const granted = await licenseManagerClient.isGranted(info.user)

    if (!granted) {
      warnAdminVerification(ctx, 'not-granted')

      return null
    }

    return info
  } catch (error) {
    warnAdminVerification(ctx, errorReason(error))

    return null
  }
}

/**
 * Logs in with the appkey and checks that the appkey is granted in the
 * current account. A login error propagates (today's 401).
 */
export const verifyAppKey = async (
  ctx: Context,
  appkey: string,
  apptoken: string
): Promise<string> => {
  const { vtexId, licenseManagerClient } = ctx.clients

  const { token } = await vtexId.login({ appkey, apptoken })

  let granted = false

  try {
    granted = await licenseManagerClient.isGranted(appkey)
  } catch (error) {
    ctx.vtex.logger.warn({
      message: 'MR-1601 appkey verification failed',
      reason: errorReason(error),
    })
  }

  if (!granted) {
    throw new ForbiddenError('Appkey is not authorized for this account')
  }

  return token
}

/**
 * Sets ctx.state.userProfile for GraphQL requests. Identity comes from the
 * store session profile. A verified admin token only grants the role, and
 * gives the identity only when there is no store profile.
 */
export const resolveGraphQLCaller = async (ctx: Context): Promise<void> => {
  if (ctx.state.userProfile) return

  const {
    cookies,
    clients: { session },
  } = ctx

  const { store } = await getUserProfileFromSession(
    session,
    cookies.get(VTEX_SESSION)
  )

  // A shopper without an admin token never reaches VTEX ID or License Manager.
  const admin = await verifyAdminToken(ctx, ctx.vtex.adminUserAuthToken)

  if (store) {
    ctx.state.userProfile = { ...store, role: admin ? 'admin' : 'store-user' }

    return
  }

  if (admin) {
    ctx.state.userProfile = {
      userId: admin.id,
      email: admin.user,
      role: 'admin',
      firstName: '',
      lastName: '',
    }

    return
  }

  throw new ResolverError('Invalid session data')
}

/**
 * Sets ctx.state.userProfile and/or ctx.state.appkey for REST requests.
 */
export const resolveRestCaller = async (ctx: Context): Promise<void> => {
  const {
    header,
    clients: { vtexId },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined
  const authCookie = header.vtexidclientautcookie as string | undefined

  if (authCookie) {
    const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

    // When the auth cookie is invalid, the API returns null
    if (authenticatedUser) {
      const isAdmin = Boolean(await verifyAdminToken(ctx, authCookie))
      const { user, userId } = authenticatedUser

      state.userProfile = {
        userId,
        email: user,
        role: isAdmin ? 'admin' : 'store-user',
      }

      if (isAdmin) {
        ctx.vtex.adminUserAuthToken = authCookie
      }
    }
  }

  if (appkey && apptoken) {
    const token = await verifyAppKey(ctx, appkey, apptoken)

    state.appkey = appkey
    ctx.vtex.adminUserAuthToken = token
  }

  if (!state.userProfile && !state.appkey) {
    throw new AuthenticationError('Request failed with status code 401')
  }
}
