import type { Session } from '@vtex/api'

const createUserProfile = (sessionData: SessionData): UserProfile => {
  const {
    namespaces: { profile },
  } = sessionData

  return {
    email: profile.email.value,
    userId: profile.id.value,
  }
}

export const getUserProfileFromSession = async (
  session: Session,
  sessionCookie: string | undefined
) => {
  if (!sessionCookie) throw new Error('No session cookie provided')

  const { sessionData } = (await session.getSession(sessionCookie, [
    'profile.id',
    'profile.email',
    'impersonate.storeUserId',
    'impersonate.storeUserEmail',
  ])) as {
    sessionData: SessionData
    sessionToken: string
  }

  return createUserProfile(sessionData)
}
