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

const buildCtx = () => {
  const update = jest.fn().mockResolvedValue({})
  const ctx: any = {
    state: {
      userProfile: {
        userId: OWNER_ID,
        email: 'shopper@acme.com',
        firstName: 'Jane',
        lastName: 'Doe',
        role: 'store-user',
      },
    },
    clients: {
      returnRequest: {
        get: jest.fn().mockResolvedValue({
          orderId: '1352940506688-02',
          status: 'new',
          customerProfileData: { userId: OWNER_ID, email: 'shopper@acme.com' },
          refundableAmountTotals: [],
          refundStatusData: [],
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

  return { ctx, update }
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
})
