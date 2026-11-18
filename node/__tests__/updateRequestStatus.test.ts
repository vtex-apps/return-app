/* tslint:disable:max-classes-per-file */
import type { ReturnRequest, Status } from 'vtex.return-app'

import { updateRequestStatusService } from '../services/updateRequestStatusService'

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
    ForbiddenError: class ForbiddenError extends FakeError {},
    NotFoundError: class NotFoundError extends FakeError {},
    ResolverError: class ResolverError extends FakeError {},
    UserInputError: class UserInputError extends FakeError {},
  }
})

const OWNER_ID = 'shopper-id'

interface CtxOptions {
  userId?: string
  ownerId?: string
  status?: Status
  role?: UserProfile['role']
}

const buildCtx = ({
  userId = OWNER_ID,
  ownerId = OWNER_ID,
  status = 'new',
  role = 'store-user',
}: CtxOptions = {}) => {
  const update = jest.fn().mockResolvedValue({})
  const ctx = {
    state: {
      userProfile: {
        userId,
        email: 'shopper@acme.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role,
      },
    },
    clients: {
      returnRequest: {
        get: jest.fn().mockResolvedValue({
          orderId: '1352940506688-02',
          status,
          customerProfileData: { userId: ownerId, email: 'shopper@acme.com' },
          refundableAmountTotals: [],
          refundStatusData: [
            {
              status: 'new',
              submittedBy: 'Staff Member',
              createdAt: '2026-11-18T00:00:00.000Z',
              comments: [
                {
                  comment: 'internal',
                  visibleForCustomer: false,
                  role: 'adminUser',
                  submittedBy: 'Staff Member',
                  createdAt: '2026-11-18T00:00:00.000Z',
                },
              ],
            },
          ],
          items: [],
          cultureInfoData: { locale: 'en-US', currencyCode: 'USD' },
        }),
        update,
      },
      oms: {},
      giftCard: {},
      mail: {
        getTemplate: jest.fn().mockResolvedValue(true),
        sendMail: jest.fn().mockResolvedValue(undefined),
      },
    },
    vtex: { logger: { error: jest.fn(), warn: jest.fn() } },
  } as unknown as Context

  return { ctx, update }
}

/** The document passed to returnRequest.update in the first call. */
const savedDocument = (update: jest.Mock) =>
  update.mock.calls[0][1] as ReturnRequest

const lastComment = (request: ReturnRequest) => {
  const [firstStatus] = request.refundStatusData
  const { comments = [] } = firstStatus

  return comments[comments.length - 1]
}

describe('updateRequestStatusService for the request owner', () => {
  it.each<Status>(['processing', 'denied'])(
    'rejects moving their own new request to %s',
    async (status) => {
      const { ctx, update } = buildCtx()

      await expect(
        updateRequestStatusService(ctx, {
          requestId: 'request-id',
          status,
        })
      ).rejects.toMatchObject({ name: 'ForbiddenError' })
      expect(update).not.toHaveBeenCalled()
    }
  )

  it('allows cancelling their own new request', async () => {
    const { ctx, update } = buildCtx()

    await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'cancelled',
    })

    expect(update).toHaveBeenCalledWith(
      'request-id',
      expect.objectContaining({ status: 'cancelled' })
    )
  })

  it('stores an owner comment as a visible store user comment', async () => {
    const { ctx, update } = buildCtx()

    await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'new',
      comment: { value: 'please refund', visibleForCustomer: false },
    })

    expect(lastComment(savedDocument(update))).toMatchObject({
      comment: 'please refund',
      role: 'storeUser',
      visibleForCustomer: true,
    })
  })

  it('returns the updated request without internal comments to the owner', async () => {
    const { ctx } = buildCtx()

    const result = await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'cancelled',
    })

    const comments = result.refundStatusData.flatMap(
      (statusData) => statusData.comments ?? []
    )

    expect(comments.some((comment) => !comment.visibleForCustomer)).toBe(false)
    expect(
      result.refundStatusData.every((statusData) => !statusData.submittedBy)
    ).toBe(true)
  })

  it.each<[string, CtxOptions]>([
    ['a non-owner', { ownerId: 'someone-else' }],
    ['the owner of a request that is no longer new', { status: 'processing' }],
    [
      'a caller without userId on a request without userId',
      { userId: '', ownerId: '' },
    ],
  ])('rejects %s', async (_, options) => {
    const { ctx, update } = buildCtx(options)

    await expect(
      updateRequestStatusService(ctx, {
        requestId: 'request-id',
        status: 'cancelled',
      })
    ).rejects.toMatchObject({ name: 'ForbiddenError' })
    expect(update).not.toHaveBeenCalled()
  })
})

describe('updateRequestStatusService for an admin', () => {
  it('stores an admin comment with the visibility the admin chose', async () => {
    const { ctx, update } = buildCtx({ role: 'admin', userId: 'admin-id' })

    const result = await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'new',
      comment: { value: 'internal note', visibleForCustomer: false },
    })

    expect(lastComment(savedDocument(update))).toMatchObject({
      role: 'adminUser',
      visibleForCustomer: false,
    })
    expect(result.refundStatusData[0].comments).toHaveLength(2)
  })
})
