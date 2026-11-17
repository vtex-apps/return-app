/* tslint:disable:max-classes-per-file */
import {
  resolveGraphQLCaller,
  resolveRestCaller,
  verifyAdminToken,
  verifyAppKey,
} from '../utils/resolveCaller'

// The jest 24 resolver bundled with @vtex/test-tools cannot load @vtex/api
// (see licenseManager.test.ts). Replace the error classes with simple fakes.
jest.mock('@vtex/api', () => {
  class FakeError extends Error {
    constructor(message: string) {
      super(message)
      this.name = new.target.name
    }
  }

  return {
    AuthenticationError: class AuthenticationError extends FakeError {},
    ForbiddenError: class ForbiddenError extends FakeError {},
    ResolverError: class ResolverError extends FakeError {},
  }
})

const ADMIN_TOKEN = 'admin-token-secret'
const STORE_COOKIE = 'store-cookie-secret'

const adminInfo = {
  id: 'admin-id',
  user: 'admin@acme.com',
  account: 'acme',
  audience: 'admin',
  authStatus: 'Success',
}

const storeProfile = {
  id: { value: 'shopper-id' },
  email: { value: 'shopper@acme.com' },
  firstName: { value: 'Jane' },
  lastName: { value: 'Doe' },
}

interface MockOptions {
  adminToken?: string
  sessionCookie?: string
  profile?: Record<string, unknown>
  authentication?: Record<string, unknown>
  header?: Record<string, string>
}

const buildCtx = (options: MockOptions = {}) => {
  const {
    adminToken,
    sessionCookie = 'session-cookie',
    profile = {},
    authentication = {},
    header = {},
  } = options

  const validate = jest.fn().mockResolvedValue(adminInfo)
  const isGranted = jest.fn().mockResolvedValue(true)
  const login = jest.fn().mockResolvedValue({ token: 'appkey-login-token' })
  const getAuthenticatedUser = jest.fn().mockResolvedValue(null)
  const getSession = jest.fn().mockResolvedValue({
    sessionData: { id: 's', namespaces: { profile, authentication } },
    sessionToken: 't',
  })

  const warn = jest.fn()

  const ctx = {
    header,
    cookies: {
      get: jest.fn((name: string) =>
        name === 'vtex_session' ? sessionCookie : undefined
      ),
    },
    state: {} as State,
    clients: {
      vtexIdCredential: { validate },
      licenseManagerClient: { isGranted },
      vtexId: { login, getAuthenticatedUser },
      session: { getSession },
    },
    vtex: {
      account: 'acme',
      adminUserAuthToken: adminToken,
      logger: { warn, error: jest.fn(), info: jest.fn() },
    },
  }

  return {
    ctx: ctx as unknown as Context,
    raw: ctx,
    validate,
    isGranted,
    login,
    getAuthenticatedUser,
    getSession,
    warn,
  }
}

const serializedCalls = (mock: jest.Mock) => JSON.stringify(mock.mock.calls)

describe('verifyAdminToken', () => {
  it('returns the credential info for a granted admin token', async () => {
    const { ctx, validate, isGranted } = buildCtx()

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toEqual(adminInfo)
    expect(validate).toHaveBeenCalledWith(ADMIN_TOKEN)
    expect(isGranted).toHaveBeenCalledWith(adminInfo.user)
  })

  it('returns null for a webstore token', async () => {
    const { ctx, validate, isGranted } = buildCtx()

    validate.mockResolvedValue({ ...adminInfo, audience: 'webstore' })

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toBeNull()
    expect(isGranted).not.toHaveBeenCalled()
  })

  it('returns null when authStatus is not Success', async () => {
    const { ctx, validate, isGranted } = buildCtx()

    validate.mockResolvedValue({ ...adminInfo, authStatus: 'Expired' })

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toBeNull()
    expect(isGranted).not.toHaveBeenCalled()
  })

  it('returns null when the login is not granted in the account', async () => {
    const { ctx, isGranted, warn } = buildCtx()

    isGranted.mockResolvedValue(false)

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toBeNull()
    expect(serializedCalls(warn)).not.toContain(ADMIN_TOKEN)
  })

  it('returns null and logs a warning without the token when validate rejects', async () => {
    const { ctx, validate, warn } = buildCtx()

    validate.mockRejectedValue(new Error('Request failed with status 401'))

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toBeNull()
    expect(warn).toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'admin verification failed',
        reason: expect.any(String),
      })
    )
    expect(serializedCalls(warn)).not.toContain(ADMIN_TOKEN)
  })

  it('returns null when isGranted throws', async () => {
    const { ctx, isGranted, warn } = buildCtx()

    isGranted.mockRejectedValue(new Error('LM down'))

    expect(await verifyAdminToken(ctx, ADMIN_TOKEN)).toBeNull()
    expect(warn).toHaveBeenCalled()
  })

  it('returns null without calling any client when the token is missing', async () => {
    const { ctx, validate, isGranted } = buildCtx()

    expect(await verifyAdminToken(ctx, undefined)).toBeNull()
    expect(validate).not.toHaveBeenCalled()
    expect(isGranted).not.toHaveBeenCalled()
  })
})

describe('verifyAppKey', () => {
  it('returns the login token when the appkey is granted', async () => {
    const { ctx, login, isGranted } = buildCtx()

    expect(await verifyAppKey(ctx, 'vtexappkey-acme-X', 'tok')).toBe(
      'appkey-login-token'
    )
    expect(login).toHaveBeenCalledWith({
      appkey: 'vtexappkey-acme-X',
      apptoken: 'tok',
    })
    expect(isGranted).toHaveBeenCalledWith('vtexappkey-acme-X')
  })

  it('throws ForbiddenError for an appkey not granted in the account', async () => {
    const { ctx, isGranted } = buildCtx()

    isGranted.mockResolvedValue(false)

    await expect(
      verifyAppKey(ctx, 'vtexappkey-other-X', 'tok')
    ).rejects.toMatchObject({
      name: 'ForbiddenError',
      message: 'Appkey is not authorized for this account',
    })
  })

  it('throws ForbiddenError when isGranted throws', async () => {
    const { ctx, isGranted } = buildCtx()

    isGranted.mockRejectedValue(new Error('LM down'))

    await expect(
      verifyAppKey(ctx, 'vtexappkey-acme-X', 'tok')
    ).rejects.toMatchObject({ name: 'ForbiddenError' })
  })

  it('propagates the login error', async () => {
    const { ctx, login, isGranted } = buildCtx()
    const error = new Error('Request failed with status code 401')

    login.mockRejectedValue(error)

    await expect(verifyAppKey(ctx, 'k', 't')).rejects.toBe(error)
    expect(isGranted).not.toHaveBeenCalled()
  })
})

describe('resolveGraphQLCaller', () => {
  it('gives store-user to a shopper without calling VTEX ID or LM', async () => {
    const { ctx, validate, isGranted } = buildCtx({ profile: storeProfile })

    await resolveGraphQLCaller(ctx)

    expect(ctx.state.userProfile).toEqual({
      userId: 'shopper-id',
      email: 'shopper@acme.com',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'store-user',
    })
    expect(validate).not.toHaveBeenCalled()
    expect(isGranted).not.toHaveBeenCalled()
  })

  it('gives admin role but keeps the store identity when the admin token is verified', async () => {
    const { ctx } = buildCtx({ profile: storeProfile, adminToken: ADMIN_TOKEN })

    await resolveGraphQLCaller(ctx)

    expect(ctx.state.userProfile).toEqual({
      userId: 'shopper-id',
      email: 'shopper@acme.com',
      firstName: 'Jane',
      lastName: 'Doe',
      role: 'admin',
    })
  })

  it('keeps store-user and does not throw when the admin token is invalid', async () => {
    const { ctx, validate } = buildCtx({
      profile: storeProfile,
      adminToken: ADMIN_TOKEN,
    })

    validate.mockRejectedValue(new Error('invalid'))

    await resolveGraphQLCaller(ctx)

    expect(ctx.state.userProfile?.role).toBe('store-user')
    expect(ctx.state.userProfile?.userId).toBe('shopper-id')
  })

  it('shares one verification across concurrent calls on the same context', async () => {
    const { ctx, validate, getSession } = buildCtx({
      profile: storeProfile,
      adminToken: ADMIN_TOKEN,
    })

    await Promise.all([resolveGraphQLCaller(ctx), resolveGraphQLCaller(ctx)])

    expect(validate).toHaveBeenCalledTimes(1)
    expect(getSession).toHaveBeenCalledTimes(1)
    expect(ctx.state.userProfile?.role).toBe('admin')
  })

  it('ignores the authentication namespace', async () => {
    const { ctx } = buildCtx({
      authentication: {
        adminUserId: { value: 'other-admin' },
        adminUserEmail: { value: 'other@acme.com' },
      },
    })

    await expect(resolveGraphQLCaller(ctx)).rejects.toMatchObject({
      name: 'ResolverError',
      message: 'Invalid session data',
    })
    expect(ctx.state.userProfile).toBeUndefined()
  })

  it('takes identity from the verified token when there is no store profile', async () => {
    const { ctx } = buildCtx({
      adminToken: ADMIN_TOKEN,
      authentication: { adminUserId: { value: 'ignored' } },
    })

    await resolveGraphQLCaller(ctx)

    expect(ctx.state.userProfile).toEqual({
      userId: adminInfo.id,
      email: adminInfo.user,
      role: 'admin',
      firstName: '',
      lastName: '',
    })
  })

  it('propagates the missing session cookie error', async () => {
    const { ctx } = buildCtx({ sessionCookie: '' })

    await expect(resolveGraphQLCaller(ctx)).rejects.toThrow(
      'No session cookie provided'
    )
  })

  it('does nothing when userProfile is already set', async () => {
    const { ctx, validate, isGranted, getSession } = buildCtx({
      profile: storeProfile,
      adminToken: ADMIN_TOKEN,
    })

    const existing: UserProfile = {
      userId: 'u',
      email: 'e',
      role: 'store-user',
    }

    ctx.state.userProfile = existing

    await resolveGraphQLCaller(ctx)

    expect(ctx.state.userProfile).toBe(existing)
    expect(getSession).not.toHaveBeenCalled()
    expect(validate).not.toHaveBeenCalled()
    expect(isGranted).not.toHaveBeenCalled()
  })
})

describe('resolveRestCaller', () => {
  it('throws ForbiddenError for a foreign appkey', async () => {
    const { ctx, isGranted } = buildCtx({
      header: {
        'x-vtex-api-appkey': 'vtexappkey-other-X',
        'x-vtex-api-apptoken': 'tok',
      },
    })

    isGranted.mockResolvedValue(false)

    await expect(resolveRestCaller(ctx)).rejects.toMatchObject({
      name: 'ForbiddenError',
    })
    expect(ctx.state.appkey).toBeUndefined()
  })

  it('sets appkey and the login token for a granted appkey', async () => {
    const { ctx } = buildCtx({
      header: {
        'x-vtex-api-appkey': 'vtexappkey-acme-X',
        'x-vtex-api-apptoken': 'tok',
      },
    })

    await resolveRestCaller(ctx)

    expect(ctx.state.appkey).toBe('vtexappkey-acme-X')
    expect(ctx.vtex.adminUserAuthToken).toBe('appkey-login-token')
  })

  it('throws AuthenticationError when no credential is provided', async () => {
    const { ctx } = buildCtx()

    await expect(resolveRestCaller(ctx)).rejects.toMatchObject({
      name: 'AuthenticationError',
      message: 'Request failed with status code 401',
    })
  })

  it('gives store-user to a webstore cookie', async () => {
    const { ctx, validate, getAuthenticatedUser } = buildCtx({
      header: { vtexidclientautcookie: STORE_COOKIE },
    })

    getAuthenticatedUser.mockResolvedValue({
      user: 'shopper@acme.com',
      userId: 'shopper-id',
    })
    validate.mockResolvedValue({ ...adminInfo, audience: 'webstore' })

    await resolveRestCaller(ctx)

    expect(ctx.state.userProfile).toEqual({
      userId: 'shopper-id',
      email: 'shopper@acme.com',
      role: 'store-user',
    })
    expect(ctx.vtex.adminUserAuthToken).toBeUndefined()
  })

  it('gives admin and sets adminUserAuthToken for a verified admin cookie', async () => {
    const { ctx, validate, getAuthenticatedUser } = buildCtx({
      header: { vtexidclientautcookie: ADMIN_TOKEN },
    })

    getAuthenticatedUser.mockResolvedValue({
      user: adminInfo.user,
      userId: adminInfo.id,
    })

    await resolveRestCaller(ctx)

    expect(validate).toHaveBeenCalledWith(ADMIN_TOKEN)
    expect(ctx.state.userProfile).toEqual({
      userId: adminInfo.id,
      email: adminInfo.user,
      role: 'admin',
    })
    expect(ctx.vtex.adminUserAuthToken).toBe(ADMIN_TOKEN)
  })

  it('throws AuthenticationError when the cookie is invalid', async () => {
    const { ctx } = buildCtx({
      header: { vtexidclientautcookie: 'bad' },
    })

    await expect(resolveRestCaller(ctx)).rejects.toMatchObject({
      name: 'AuthenticationError',
    })
  })
})
