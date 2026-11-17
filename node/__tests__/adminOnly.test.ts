/* tslint:disable:max-classes-per-file */
import { AdminOnly } from '../directives/adminOnly'
import { resolveGraphQLCaller } from '../utils/resolveCaller'

jest.mock('@vtex/api', () => {
  class FakeError extends Error {
    constructor(message: string) {
      super(message)
      this.name = new.target.name
    }
  }

  return {
    ForbiddenError: class ForbiddenError extends FakeError {},
    ResolverError: class ResolverError extends FakeError {},
  }
})

jest.mock('../utils/resolveCaller', () => ({
  resolveGraphQLCaller: jest.fn(),
}))

const mockedResolveCaller = resolveGraphQLCaller as jest.Mock

const applyDirective = (resolve: jest.Mock) => {
  const field: any = { resolve }
  const visitor: any = new (AdminOnly as any)({
    name: 'adminOnly',
    args: {},
    visitedType: field,
    schema: undefined as any,
    context: {},
  })

  visitor.visitFieldDefinition(field)

  return field.resolve as (...args: any[]) => Promise<unknown>
}

describe('@adminOnly directive', () => {
  beforeEach(() => mockedResolveCaller.mockReset())

  it('rejects a store user and does not call the resolver', async () => {
    const original = jest.fn()
    const ctx: any = { state: {} }

    mockedResolveCaller.mockImplementation(async (c: any) => {
      c.state.userProfile = { role: 'store-user' }
    })

    await expect(applyDirective(original)({}, {}, ctx, {})).rejects.toThrow(
      'Only admin users can perform this operation'
    )
    expect(original).not.toHaveBeenCalled()
  })

  it('resolves the caller itself and allows a verified admin with no prior userProfile', async () => {
    const original = jest.fn().mockResolvedValue(true)
    const ctx: any = { state: {} }

    mockedResolveCaller.mockImplementation(async (c: any) => {
      c.state.userProfile = { role: 'admin' }
    })

    expect(await applyDirective(original)({}, {}, ctx, {})).toBe(true)
    expect(mockedResolveCaller).toHaveBeenCalledWith(ctx)
    expect(original).toHaveBeenCalledTimes(1)
  })

  it('allows an app key caller', async () => {
    const original = jest.fn().mockResolvedValue(true)
    const ctx: any = { state: { appkey: 'vtexappkey-acme-ABC' } }

    expect(await applyDirective(original)({}, {}, ctx, {})).toBe(true)
  })

  it('returns Forbidden when the caller cannot be resolved', async () => {
    const original = jest.fn()

    mockedResolveCaller.mockRejectedValue(
      new Error('No session cookie provided')
    )

    await expect(
      applyDirective(original)({}, {}, { state: {} }, {})
    ).rejects.toThrow('Only admin users can perform this operation')
    expect(original).not.toHaveBeenCalled()
  })
})
