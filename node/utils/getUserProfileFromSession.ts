import type { Session } from '@vtex/api'

export interface SessionIdentity {
  store?: {
    userId: string
    email: string
    firstName: string
    lastName: string
  }
}

// Identity comes only from the profile namespace.
const createSessionIdentity = (sessionData: SessionData): SessionIdentity => {
  const profile = sessionData?.namespaces?.profile

  const userId = profile?.id?.value
  const email = profile?.email?.value

  if (!userId || !email) {
    return {}
  }

  return {
    store: {
      userId,
      email,
      firstName: profile.firstName?.value ?? '',
      lastName: profile.lastName?.value ?? '',
    },
  }
}

export const getUserProfileFromSession = async (
  session: Session,
  sessionCookie: string | undefined
): Promise<SessionIdentity> => {
  if (!sessionCookie) throw new Error('No session cookie provided')

  const { sessionData } = (await session.getSession(sessionCookie, [
    'profile.id',
    'profile.email',
    'profile.firstName',
    'profile.lastName',
  ])) as {
    sessionData: SessionData
    sessionToken: string
  }

  return createSessionIdentity(sessionData)
}
