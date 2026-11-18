import {
  buildWhereClause,
  returnRequestListService,
} from '../services/returnRequestListService'

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

  it('trims surrounding whitespace before validating', () => {
    expect(
      buildWhereClause({
        orderId: ' 1352940506688-02 ',
        userEmail: ' jane.doe@acme.com',
      })
    ).toBe(
      'orderId=1352940506688-02 AND customerProfileData.email = "jane.doe@acme.com"'
    )
  })

  it('ignores a value that is only whitespace', () => {
    expect(buildWhereClause({ orderId: '   ' })).toBe('')
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

const rowWithInternalComment = () => ({
  id: 'request-id',
  refundStatusData: [
    {
      status: 'new',
      submittedBy: 'Staff Member',
      comments: [
        { comment: 'visible', visibleForCustomer: true },
        { comment: 'internal', visibleForCustomer: false },
      ],
    },
  ],
})

const listCtx = (state: unknown) =>
  ({
    state,
    request: { header: {} },
    clients: {
      returnRequest: {
        searchRaw: jest.fn().mockResolvedValue({
          data: [rowWithInternalComment()],
          pagination: { page: 1, pageSize: 25, total: 1 },
        }),
      },
    },
  } as any)

describe('returnRequestListService with all fields', () => {
  it('hides internal comments and submittedBy from a store user', async () => {
    const ctx = listCtx({
      userProfile: { userId: 'u', email: 'u@acme.com', role: 'store-user' },
    })

    const { list }: any = await returnRequestListService(ctx, { page: 1 }, true)
    const [status] = list[0].refundStatusData

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toEqual([
      { comment: 'visible', visibleForCustomer: true },
    ])
  })

  it('keeps everything for an appkey caller', async () => {
    const ctx = listCtx({ appkey: 'vtexappkey-acme-ABC' })

    const { list }: any = await returnRequestListService(ctx, { page: 1 }, true)

    expect(list[0].refundStatusData[0].comments).toHaveLength(2)
  })
})
