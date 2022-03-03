import { statusToError } from '../utils/statusToError'

const VTEX_SESSION = 'vtex_session'

const getProfileEmailAndId = async (
  { clients: { session }, cookies, state }: Context,
  next: () => Promise<void>
) => {
  try {
    const sessionCookie = cookies.get(VTEX_SESSION)

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

    const email = sessionData?.namespaces?.profile.email.value
    const userId = sessionData?.namespaces?.profile.id.value

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
    throw statusToError({
      status: 401,
      message: 'Profile not found',
    })
  }
}

export { getProfileEmailAndId }
