import { AuthenticationError, ForbiddenError, ResolverError } from '@vtex/api'

import type { VtexIdCredentialInfo } from '../clients/vtexIdCredential'
import { getUserProfileFromSession } from './getUserProfileFromSession'

const VTEX_SESSION = 'vtex_session'

const warnAdminVerification = (ctx: Context, reason: string) => {
  ctx.vtex.logger.warn({
    message: 'admin verification failed',
    reason,
  })
}

const errorReason = (error: unknown) =>
  error instanceof Error ? error.message : 'unknown error'

const authorizationUnavailable = () =>
  new ResolverError('Authorization service unavailable', 503)

/**
 * A 4xx answer (except 408 and 429) rejects the credential. Anything else,
 * such as a 5xx, a timeout or a rate limit, means the service could not
 * answer.
 */
const isCredentialRejection = (error: unknown) => {
  const status = (error as { response?: { status?: unknown } })?.response
    ?.status

  return (
    typeof status === 'number' &&
    status >= 400 &&
    status < 500 &&
    status !== 408 &&
    status !== 429
  )
}

/**
 * Verifies that the token is a valid VTEX ID admin token whose login is
 * granted in the current account. A rejected or ungranted token returns
 * null. When VTEX ID or License Manager cannot answer, it throws a
 * retryable 503, as for appkeys. The token account is not compared with the current account, so logins
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

    if (isCredentialRejection(error)) return null

    throw authorizationUnavailable()
  }
}

/**
 * Logs in with the appkey and checks that the appkey is granted in the
 * current account. A login error propagates (today's 401). When License
 * Manager is unavailable, the request fails with a retryable 503.
 */
export const verifyAppKey = async (
  ctx: Context,
  appkey: string,
  apptoken: string
): Promise<string> => {
  const { vtexId, licenseManagerClient } = ctx.clients

  const { token } = await vtexId.login({ appkey, apptoken })

  let granted: boolean

  try {
    granted = await licenseManagerClient.isGranted(appkey)
  } catch (error) {
    ctx.vtex.logger.warn({
      message: 'appkey verification failed',
      reason: errorReason(error),
    })

    throw authorizationUnavailable()
  }

  if (!granted) {
    throw new ForbiddenError('Appkey is not authorized for this account')
  }

  return token
}

/** The request has a session, but no store profile and no verified admin. */
export class InvalidSessionError extends ResolverError {
  constructor() {
    super('Invalid session data')
  }
}

const inFlightResolutions = new WeakMap<Context, Promise<void>>()

const resolveGraphQLCallerOnce = async (ctx: Context): Promise<void> => {
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

  throw new InvalidSessionError()
}

/**
 * Sets ctx.state.userProfile for GraphQL requests. Identity comes from the
 * store session profile. A verified admin token only grants the role, and
 * gives the identity only when there is no store profile.
 */
export const resolveGraphQLCaller = (ctx: Context): Promise<void> => {
  if (ctx.state.userProfile) return Promise.resolve()

  // Sibling fields resolve in parallel: share one resolution per request.
  let pending = inFlightResolutions.get(ctx)

  if (!pending) {
    pending = resolveGraphQLCallerOnce(ctx)
    inFlightResolutions.set(ctx, pending)
  }

  return pending
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
