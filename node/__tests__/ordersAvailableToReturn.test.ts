/* tslint:disable:max-classes-per-file */
import { resolveTargetEmail } from '../resolvers/ordersAvailableToReturn'

// The jest 24 resolver bundled with @vtex/test-tools cannot load @vtex/api
// (see resolveCaller.test.ts). Replace the error classes with simple fakes.
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

jest.mock('../utils/createOrdersToReturnSummary', () => ({
  createOrdersToReturnSummary: jest.fn(),
}))

const profile = (
  role: UserProfile['role'],
  email = 'ana@x.com'
): UserProfile => ({ userId: 'u1', email, role })

describe('resolveTargetEmail', () => {
  it('lets an admin target any customer email', () => {
    expect(resolveTargetEmail(profile('admin'), 'other@y.com')).toBe(
      'other@y.com'
    )
  })

  it('uses the admin own email when no storeUserEmail is given', () => {
    expect(resolveTargetEmail(profile('admin'))).toBe('ana@x.com')
  })

  it('uses the own email for a store-user without storeUserEmail', () => {
    expect(resolveTargetEmail(profile('store-user'))).toBe('ana@x.com')
    expect(resolveTargetEmail(profile('store-user'), null)).toBe('ana@x.com')
  })

  it('accepts the own email with different case and whitespace', () => {
    expect(resolveTargetEmail(profile('store-user'), 'Ana@X.com ')).toBe(
      'ana@x.com'
    )
  })

  it('rejects another email for a store-user', () => {
    expect(() =>
      resolveTargetEmail(profile('store-user'), 'other@y.com')
    ).toThrow(
      expect.objectContaining({
        name: 'ForbiddenError',
        message: 'User cannot access orders of another customer',
      })
    )
  })

  it('fails closed when there is no profile but storeUserEmail is given', () => {
    expect(() => resolveTargetEmail(undefined, 'other@y.com')).toThrow(
      expect.objectContaining({ name: 'ForbiddenError' })
    )
  })

  it('throws Missing user email when there is no email at all', () => {
    expect(() => resolveTargetEmail(undefined)).toThrow(
      expect.objectContaining({
        name: 'ResolverError',
        message: 'Missing user email',
      })
    )
    expect(() => resolveTargetEmail(profile('store-user', ''))).toThrow(
      expect.objectContaining({ message: 'Missing user email' })
    )
  })
})
