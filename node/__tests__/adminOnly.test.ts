/* tslint:disable:max-classes-per-file */
import type { GraphQLField } from 'graphql'

import { AdminOnly } from '../directives/adminOnly'
import { NoSessionCookieError } from '../utils/getUserProfileFromSession'
import {
  InvalidSessionError,
  resolveGraphQLCaller,
} from '../utils/resolveCaller'

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
  ...jest.requireActual('../utils/resolveCaller'),
  resolveGraphQLCaller: jest.fn(),
}))

const mockedResolveCaller = resolveGraphQLCaller as jest.Mock

type FieldResolve = (
  root: unknown,
  args: unknown,
  ctx: Context,
  info: unknown
) => Promise<unknown>

// SchemaDirectiveVisitor's constructor is protected; graphql-tools calls it
// internally. The test calls it directly with the same config shape.
type VisitorConstructor = new (config: {
  name: string
  args: Record<string, unknown>
  visitedType: unknown
  schema: unknown
  context: Record<string, unknown>
}) => AdminOnly

const applyDirective = (resolve: jest.Mock) => {
  const field = { resolve } as unknown as GraphQLField<unknown, Context>
  const visitor = new (AdminOnly as unknown as VisitorConstructor)({
    name: 'adminOnly',
    args: {},
    visitedType: field,
    schema: undefined,
    context: {},
  })

  visitor.visitFieldDefinition(field)

  return field.resolve as unknown as FieldResolve
}

const ctxWith = (state: Partial<State> = {}) =>
  ({ state } as unknown as Context)

const profile = (role: UserProfile['role']): UserProfile => ({
  userId: 'user-id',
  email: 'user@acme.com',
  role,
})

describe('@adminOnly directive', () => {
  beforeEach(() => mockedResolveCaller.mockReset())

  it('rejects a store user and does not call the resolver', async () => {
    const original = jest.fn()
    const ctx = ctxWith()

    mockedResolveCaller.mockImplementation(async (c: Context) => {
      c.state.userProfile = profile('store-user')
    })

    await expect(applyDirective(original)({}, {}, ctx, {})).rejects.toThrow(
      'Only admin users can perform this operation'
    )
    expect(original).not.toHaveBeenCalled()
  })

  it('resolves the caller itself and allows a verified admin with no prior userProfile', async () => {
    const original = jest.fn().mockResolvedValue(true)
    const ctx = ctxWith()

    mockedResolveCaller.mockImplementation(async (c: Context) => {
      c.state.userProfile = profile('admin')
    })

    expect(await applyDirective(original)({}, {}, ctx, {})).toBe(true)
    expect(mockedResolveCaller).toHaveBeenCalledWith(ctx)
    expect(original).toHaveBeenCalledTimes(1)
  })

  it('requires an admin profile even when appkey state is present', async () => {
    const original = jest.fn()
    const ctx = ctxWith({ appkey: 'vtexappkey-acme-ABC' })

    await expect(applyDirective(original)({}, {}, ctx, {})).rejects.toThrow(
      'Only admin users can perform this operation'
    )
    expect(original).not.toHaveBeenCalled()
  })

  it.each([
    ['there is no session cookie', () => new NoSessionCookieError()],
    ['the session has no identity', () => new InvalidSessionError()],
  ])('returns Forbidden when %s', async (_, makeError) => {
    const original = jest.fn()

    mockedResolveCaller.mockRejectedValue(makeError())

    await expect(
      applyDirective(original)({}, {}, ctxWith(), {})
    ).rejects.toThrow('Only admin users can perform this operation')
    expect(original).not.toHaveBeenCalled()
  })

  it('propagates a session service failure instead of hiding it as Forbidden', async () => {
    const original = jest.fn()
    const failure = new Error('Request failed with status code 503')

    mockedResolveCaller.mockRejectedValue(failure)

    await expect(applyDirective(original)({}, {}, ctxWith(), {})).rejects.toBe(
      failure
    )
    expect(original).not.toHaveBeenCalled()
  })
})
