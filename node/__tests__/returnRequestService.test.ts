/* tslint:disable:max-classes-per-file */

import { returnRequestService } from '../services/returnRequestService'
import type { ReturnRequest } from '../typings/returnRequest'

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
        {
          comment: 'visible',
          visibleForCustomer: true,
          submittedBy: 'Staff Member',
        },
        { comment: 'internal', visibleForCustomer: false },
      ],
    },
  ],
})

const ctxFor = (state: Partial<State>, ownerId?: string) =>
  ({
    state,
    clients: {
      returnRequest: { get: jest.fn().mockResolvedValue(stored(ownerId)) },
    },
  } as unknown as Context)

const read = async (ctx: Context) =>
  (await returnRequestService(ctx, 'request-id')) as ReturnRequest

describe('returnRequestService', () => {
  it('hides internal comments and submittedBy from the owner', async () => {
    const result = await read(
      ctxFor({
        userProfile: {
          userId: 'owner-id',
          email: 'owner@acme.com',
          role: 'store-user',
        },
      })
    )

    expect(result.refundStatusData[0].submittedBy).toBeUndefined()
    expect(result.refundStatusData[0].comments).toEqual([
      expect.objectContaining({ comment: 'visible', submittedBy: '' }),
    ])
  })

  it('returns everything to an admin', async () => {
    const result = await read(
      ctxFor({
        userProfile: {
          userId: 'admin-id',
          email: 'admin@acme.com',
          role: 'admin',
        },
      })
    )

    expect(result.refundStatusData[0].submittedBy).toBe('Staff Member')
    expect(result.refundStatusData[0].comments).toHaveLength(2)
    expect(result.refundStatusData[0].comments?.[0].submittedBy).toBe(
      'Staff Member'
    )
  })

  it('rejects a caller without userId on a request without userId', async () => {
    await expect(
      returnRequestService(
        ctxFor(
          {
            userProfile: {
              userId: '',
              email: 'shopper@acme.com',
              role: 'store-user',
            },
          },
          ''
        ),
        'request-id'
      )
    ).rejects.toMatchObject({ name: 'ForbiddenError' })
  })
})
