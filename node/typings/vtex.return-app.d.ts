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

type ReturnAppSettingsCustom = ReturnAppSettings & {
  options: ReturnOptionCustom
}

type ReturnOptionCustom = ReturnOption & {
  disableTaxRefund?: boolean
}
