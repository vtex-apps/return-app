import { AuthenticationError } from '@vtex/api'

export async function auth(ctx: Context, next: () => Promise<void>) {
  const {
    header,
    clients: { vtexId, sphinx, session },
    state,
    vtex: { storeUserAuthToken, adminUserAuthToken, sessionToken },
  } = ctx

  const appkey = header['x-vtex-api-appkey'] as string | undefined
  const apptoken = header['x-vtex-api-apptoken'] as string | undefined
  const authCookie = adminUserAuthToken ?? storeUserAuthToken

  if (authCookie) {
    const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

    // When the auth cookie is invalid, the API returns null
    if (authenticatedUser) {
      const isAdmin = await sphinx.isAdmin(authenticatedUser.user)

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
  } else {
    const sessionData = await session
      .getSession(sessionToken as string, ['*'])
      .then((currentSession: any) => {
        return currentSession.sessionData
      })
      .catch((_: any) => {
        return null
      })

    const profileEmail = sessionData?.namespaces?.profile?.email?.value
    const sessionUserId = sessionData?.namespaces?.profile?.id?.value

    const isAdmin = await sphinx.isAdmin(profileEmail)

    state.userProfile = {
      userId: sessionUserId,
      email: profileEmail,
      role: isAdmin ? 'admin' : 'store-user',
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
