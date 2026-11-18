/* tslint:disable:max-classes-per-file */
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

const buildCtx = ({
  userId = OWNER_ID as string | undefined,
  ownerId = OWNER_ID as string | undefined,
  status = 'new',
  role = 'store-user',
} = {}) => {
  const update = jest.fn().mockResolvedValue({})
  const ctx: any = {
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
  }

  return { ctx, update, sendMail: ctx.clients.mail.sendMail as jest.Mock }
}

describe('updateRequestStatusService for the request owner', () => {
  it.each(['processing', 'denied'])(
    'rejects moving their own new request to %s',
    async (status) => {
      const { ctx, update } = buildCtx()

      await expect(
        updateRequestStatusService(ctx, {
          requestId: 'request-id',
          status: status as any,
        })
      ).rejects.toMatchObject({ name: 'ForbiddenError' })
      expect(update).not.toHaveBeenCalled()
    }
  )

  it('allows cancelling their own new request', async () => {
    const { ctx, update } = buildCtx()

    await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'cancelled' as any,
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
      status: 'new' as any,
      comment: { value: 'please refund', visibleForCustomer: false },
    })

    const [, saved] = update.mock.calls[0]
    const [newStatus] = saved.refundStatusData
    const added = newStatus.comments[newStatus.comments.length - 1]

    expect(added).toMatchObject({
      comment: 'please refund',
      role: 'storeUser',
      visibleForCustomer: true,
    })
  })

  it('returns the updated request without internal comments to the owner', async () => {
    const { ctx } = buildCtx()

    const result = await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'cancelled' as any,
    })

    const comments = result.refundStatusData.flatMap((s: any) => s.comments)

    expect(comments.some((c: any) => !c.visibleForCustomer)).toBe(false)
    expect(result.refundStatusData.every((s: any) => !s.submittedBy)).toBe(true)
  })

  it.each([
    ['a non-owner', { ownerId: 'someone-else' }],
    ['the owner of a request that is no longer new', { status: 'processing' }],
    [
      'a caller without userId on a request without userId',
      { userId: '', ownerId: '' },
    ],
  ])('rejects %s', async (_, options) => {
    const { ctx, update } = buildCtx(options as any)

    await expect(
      updateRequestStatusService(ctx, {
        requestId: 'request-id',
        status: 'cancelled' as any,
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
      status: 'new' as any,
      comment: { value: 'internal note', visibleForCustomer: false },
    })

    const [, saved] = update.mock.calls[0]
    const [newStatus] = saved.refundStatusData
    const added = newStatus.comments[newStatus.comments.length - 1]

    expect(added).toMatchObject({
      role: 'adminUser',
      visibleForCustomer: false,
    })
    expect(result.refundStatusData[0].comments).toHaveLength(2)
  })

  it('sends the customer email without internal comments or staff names', async () => {
    const { ctx, sendMail } = buildCtx({ role: 'admin', userId: 'admin-id' })

    await updateRequestStatusService(ctx, {
      requestId: 'request-id',
      status: 'new' as any,
      comment: { value: 'internal note', visibleForCustomer: false },
    })

    const [{ jsonData }] = sendMail.mock.calls[0]
    const statuses = jsonData.refundStatusData

    expect(statuses.every((s: any) => !s.submittedBy)).toBe(true)
    expect(
      statuses
        .flatMap((s: any) => s.comments)
        .some((c: any) => !c.visibleForCustomer)
    ).toBe(false)
  })
})
