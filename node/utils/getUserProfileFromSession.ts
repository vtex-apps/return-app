import type { Session } from '@vtex/api'
import { ResolverError } from '@vtex/api'

const createUserProfile = (sessionData: SessionData): UserProfile => {
  const {
    namespaces: { profile, authentication },
  } = sessionData

  const email = profile.email?.value ?? authentication.adminUserEmail?.value
  const userId = profile.id?.value ?? authentication.adminUserId?.value

  const role = authentication.adminUserId ? 'admin' : 'store-user'

  if (!email || !userId) {
    throw new ResolverError('Invalid session data')
  }

  const { firstName, lastName } = profile

  const firstNameValue = firstName?.value ?? ''
  const lastNameValue = lastName?.value ?? ''

  return {
    email,
    userId,
    role,
    firstName: firstNameValue,
    lastName: lastNameValue,
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
    'profile.firstName',
    'profile.lastName',
    'authentication.adminUserEmail',
    'authentication.adminUserId',
  ])) as {
    sessionData: SessionData
    sessionToken: string
  }

  return createUserProfile(sessionData)
}
