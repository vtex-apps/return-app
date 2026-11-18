/* tslint:disable:max-classes-per-file */
import { returnRequestService } from '../services/returnRequestService'

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
    ResolverError: class ResolverError extends FakeError {},
  }
})

const stored = (ownerId = 'owner-id') => ({
  id: 'request-id',
  customerProfileData: { userId: ownerId },
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

const ctxFor = (state: unknown, ownerId?: string) =>
  ({
    state,
    clients: {
      returnRequest: { get: jest.fn().mockResolvedValue(stored(ownerId)) },
    },
  } as any)

describe('returnRequestService', () => {
  it('hides internal comments and submittedBy from the owner', async () => {
    const result: any = await returnRequestService(
      ctxFor({ userProfile: { userId: 'owner-id', role: 'store-user' } }),
      'request-id'
    )

    expect(result.refundStatusData[0].submittedBy).toBeUndefined()
    expect(result.refundStatusData[0].comments).toHaveLength(1)
  })

  it('returns everything to an admin', async () => {
    const result: any = await returnRequestService(
      ctxFor({ userProfile: { userId: 'admin-id', role: 'admin' } }),
      'request-id'
    )

    expect(result.refundStatusData[0].submittedBy).toBe('Staff Member')
    expect(result.refundStatusData[0].comments).toHaveLength(2)
  })

  it('rejects a caller without userId on a request without userId', async () => {
    await expect(
      returnRequestService(
        ctxFor({ userProfile: { userId: '', role: 'store-user' } }, ''),
        'request-id'
      )
    ).rejects.toMatchObject({ name: 'ForbiddenError' })
  })
})
