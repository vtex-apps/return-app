import { AuthenticationError } from '@vtex/api'

export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined
  const authCookie = header.vtexidclientautcookie as string | undefined

  let authUser: string | undefined

  // authCookie takes precedence over appkey and apptoken
  if (authCookie) {
    const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

    // When the auth cookie is invalid, the API returns null
    if (!authenticatedUser) {
      throw new AuthenticationError('Request failed with status code 401')
    }

    const { user } = authenticatedUser

    authUser = user
  } else if (appkey && apptoken) {
    // If appkey and apptoken are not valid, the method throws a 401 error
    await vtexId.login({ appkey, apptoken })

    authUser = appkey
  }

  // authUser is either the authenticated user or the appkey. If it's undefined, it means all checks to validate failed.
  if (!authUser) {
    throw new AuthenticationError('Request failed with status code 401')
  }

  state.user = authUser

  ctx.body = 'success'

  await next()
}
