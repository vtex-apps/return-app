import { AuthenticationError } from '@vtex/api'

export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId, sphinx },
    state,
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined
  const authCookie = header.vtexidclientautcookie as string | undefined

  if (authCookie) {
    const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

    // When the auth cookie is invalid, the API returns null
    if (authenticatedUser) {
      const isAdmin = await sphinx.isAdmin(authenticatedUser.user)

      // user when coming from another account: vrn--vtexsphinx--aws-us-east-1--powerplanet--filarmamvp--link_vtex.return-app@3.5.0
      // maybe use it to get the seller name.
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
    // If appkey and apptoken are not valid, the method throws a 401 error
    const { token } = await vtexId.login({ appkey, apptoken })

    state.appkey = appkey
    ctx.vtex.adminUserAuthToken = token
  }

  const { userProfile, appkey: appKeyState } = state

  // Either userProfile or appKeyState must be on state to continue
  if (!userProfile && !appKeyState) {
    throw new AuthenticationError('Request failed with status code 401')
  }

  await next()
}
