import type { Session } from '@vtex/api'
import { ResolverError } from '@vtex/api'

const createUserProfile = (sessionData: SessionData): UserProfile => {
  const {
    namespaces: { profile, authentication },
  } = sessionData

  const email = profile.email?.value ?? authentication.adminUserEmail?.value
  const userId = profile.id?.value ?? authentication.adminUserId?.value

  if (!email || !userId) {
    throw new ResolverError('Invalid session data')
  }

  return { email, userId }
}

export const getUserProfileFromSession = async (
  session: Session,
  sessionCookie: string | undefined
) => {
  if (!sessionCookie) throw new Error('No session cookie provided')

  const { sessionData } = (await session.getSession(sessionCookie, [
    'profile.id',
    'profile.email',
    'authentication.adminUserEmail',
    'authentication.adminUserId',
  ])) as {
    sessionData: SessionData
    sessionToken: string
  }

  return createUserProfile(sessionData)
}
