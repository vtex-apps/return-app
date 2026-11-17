import { buildWhereClause } from '../services/returnRequestListService'

// The jest 24 resolver cannot load @vtex/api (see licenseManager.test.ts).
jest.mock('@vtex/api', () => {
  class FakeError extends Error {
    constructor(message: string) {
      super(message)
      this.name = new.target.name
    }
  }

  return {
    ForbiddenError: class ForbiddenError extends FakeError {},
    UserInputError: class UserInputError extends FakeError {},
  }
})

describe('buildWhereClause', () => {
  it('returns undefined without a filter', () => {
    expect(buildWhereClause(undefined)).toBeUndefined()
  })

  it('keeps valid values unchanged', () => {
    expect(
      buildWhereClause({
        orderId: '1352940506688-02',
        sequenceNumber: '506689-2',
        id: '3f2a9c1e-5b7d-4e1a-9c3b-1a2b3c4d5e6f',
        userId: 'a1b2c3d4-0000-1111-2222-333344445555',
        userEmail: 'jane.doe+tag@acme.com',
      })
    ).toBe(
      'orderId=1352940506688-02 AND sequenceNumber=506689-2 AND id=3f2a9c1e-5b7d-4e1a-9c3b-1a2b3c4d5e6f AND customerProfileData.userId = "a1b2c3d4-0000-1111-2222-333344445555" AND customerProfileData.email = "jane.doe+tag@acme.com"'
    )
  })

  it('rejects an unquoted value with query syntax', () => {
    expect(() => buildWhereClause({ orderId: '* OR orderId=*' })).toThrow(
      'Invalid filter value'
    )
  })

  it('rejects quotes and backslashes in userEmail and userId', () => {
    expect(() => buildWhereClause({ userEmail: 'a"b@acme.com' })).toThrow(
      'Invalid filter value'
    )
    expect(() => buildWhereClause({ userEmail: 'a\\b@acme.com' })).toThrow(
      'Invalid filter value'
    )
    expect(() => buildWhereClause({ userId: 'x" OR id="y' })).toThrow(
      'Invalid filter value'
    )
  })
})
