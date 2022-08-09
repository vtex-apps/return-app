interface UserProfile {
  email: string
  userId: string
  firstName?: string
  lastName?: string
  role: 'admin' | 'store-user'
}

interface SessionData {
  id: string
  namespaces: {
    profile: ProfileSession
    authentication: AuthenticationSession
  }
}

interface ProfileSession {
  id?: {
    value: string
  }
  email?: {
    value: string
  }
  firstName?: {
    value: string
  }
  lastName?: {
    value: string
  }
}

interface AuthenticationSession {
  adminUserEmail?: {
    value: string
  }
  adminUserId?: {
    value: string
  }
}

// Allows to pick a field from a type and convert it to required. Useful for the discrepancies between GraphQL types and Masterdata
type RequiredField<T, K extends keyof T> = T & Required<Pick<T, K>>
