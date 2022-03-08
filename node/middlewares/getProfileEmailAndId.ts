import { statusToError } from '../utils/statusToError'

const VTEX_SESSION = 'vtex_session'

const getProfileEmailAndId = async (
  ctx: Context,
  next: () => Promise<void>
) => {
  try {
    const {
      clients: { session },
      cookies,
      state,
      vtex: { adminUserAuthToken, storeUserAuthToken },
    } = ctx

    const sessionCookie = cookies.get(VTEX_SESSION)

    if (!sessionCookie) {
      throw statusToError({
        status: 401,
        message: 'Profile not found',
      })
    }

    if (storeUserAuthToken) {
      state.storeUserAuthToken = storeUserAuthToken

      await next()
    }

    if (adminUserAuthToken) {
      /**
       * when we have adminUserAuthToken, we dont want to keep processing and get the email and the userId.
       */
      state.isAdmin = true
      state.adminUserAuthToken = adminUserAuthToken

      await next()
      return state
    }

    if (!adminUserAuthToken && !storeUserAuthToken) {
      throw statusToError({
        status: 401,
        message: 'Profile not found',
      })
    }
  
    const { sessionData } = await session.getSession(sessionCookie, [
      'profile.email',
      'profile.id',
    ])

    const email = sessionData?.namespaces?.profile?.email?.value
    const userId = sessionData?.namespaces?.profile?.id?.value

    if (!email || !userId) {
      throw statusToError({
        status: 401,
        message: 'Profile not found',
      })
    }

    state.userEmail = email
    state.userId = userId

    await next()
    return state
  } catch (error) {
    throw statusToError({
      status: 401,
      message: `Profile not found ${error.message}`,
    })
  }
}

export { getProfileEmailAndId }
