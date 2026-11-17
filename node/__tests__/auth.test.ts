/* tslint:disable:max-classes-per-file */
import { auth } from '../middlewares/auth'

// See resolveCaller.test.ts: jest 24 cannot load @vtex/api.
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

const buildCtx = (header: Record<string, string>, granted: boolean) =>
  ({
    header,
    state: {},
    clients: {
      vtexId: {
        login: jest.fn().mockResolvedValue({ token: 'login-token' }),
        getAuthenticatedUser: jest
          .fn()
          .mockResolvedValue({ user: 'shopper@acme.com', userId: 'u1' }),
      },
      vtexIdCredential: {
        validate: jest.fn().mockResolvedValue({
          user: 'shopper@acme.com',
          audience: 'webstore',
          authStatus: 'Success',
        }),
      },
      licenseManagerClient: { isGranted: jest.fn().mockResolvedValue(granted) },
    },
    vtex: { account: 'acme', logger: { warn: jest.fn() } },
  } as unknown as Context)

describe('auth middleware', () => {
  it('rejects a foreign appkey and does not call next', async () => {
    const ctx = buildCtx(
      {
        'x-vtex-api-appkey': 'vtexappkey-other-ABC',
        'x-vtex-api-apptoken': 't',
      },
      false
    )

    const next = jest.fn()

    await expect(auth(ctx, next)).rejects.toMatchObject({
      name: 'ForbiddenError',
    })
    expect(next).not.toHaveBeenCalled()
  })

  it('calls next once for a store cookie', async () => {
    const ctx = buildCtx({ vtexidclientautcookie: 'store-cookie' }, true)
    const next = jest.fn()

    await auth(ctx, next)

    expect(next).toHaveBeenCalledTimes(1)
    expect(ctx.state.userProfile?.role).toBe('store-user')
  })
})
