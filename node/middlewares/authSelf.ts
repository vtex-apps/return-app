import { AuthenticationError } from '@vtex/api'

export async function authSelf(ctx: Context, next: () => Promise<void>) {
  const {
    clients: { vtexId, sphinx },
    state,
  } = ctx

  const authCookie = vtexId.getAuthToken()

  const authenticatedUser = await vtexId.getAuthenticatedUser(authCookie)

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

  const { userProfile, appkey: appKeyState } = state

  // Either userProfile or appKeyState must be on state to continue
  if (!userProfile && !appKeyState) {
    throw new AuthenticationError('Request failed with status code 401')
  }

  await next()
}
