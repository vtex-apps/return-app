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
      vtex: {
        adminUserAuthToken,
        // storeUserAuthToken
      },
    } = ctx

    const sessionCookie = cookies.get(VTEX_SESSION)
    console.log('sessionCookie', sessionCookie)
    // console.log('adminUserAuthToken', adminUserAuthToken)
    // console.log('storeUserAuthToken', storeUserAuthToken)

    if (adminUserAuthToken) {
      state.isAdmin = true
      return await next()
    }

    if (!sessionCookie) {
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
  } catch (error) {
    console.log('error.message', error.message)

    throw statusToError({
      status: 401,
      message: 'Profile not found',
    })
  }
}

export { getProfileEmailAndId }
