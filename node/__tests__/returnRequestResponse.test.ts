import { ReturnRequestResponse } from '../resolvers/ReturnRequestResponse'
import type { ReturnRequest } from '../typings/returnRequest'

const refundStatusData = [
  {
    status: 'new',
    submittedBy: 'Staff Member',
    createdAt: '2026-11-18T00:00:00.000Z',
    comments: [
      { comment: 'visible', visibleForCustomer: true },
      { comment: 'internal', visibleForCustomer: false },
    ],
  },
]

const resolve = (state: Partial<State>, header: Record<string, string> = {}) =>
  ReturnRequestResponse.refundStatusData(
    { id: 'request-id', refundStatusData } as unknown as ReturnRequest,
    {},
    { state, request: { header }, clients: {} } as unknown as Context
  )

describe('ReturnRequestResponse.refundStatusData', () => {
  it('hides internal comments and submittedBy from a store user without the store header', async () => {
    const [status] = await resolve(
      {
        userProfile: {
          userId: 'shopper-id',
          email: 'shopper@acme.com',
          role: 'store-user',
        },
      },
      { 'x-vtex-product': 'admin' }
    )

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toEqual([
      { comment: 'visible', visibleForCustomer: true, submittedBy: '' },
    ])
  })

  it('shows everything to an admin outside the storefront', async () => {
    const [status] = await resolve(
      {
        userProfile: {
          userId: 'admin-id',
          email: 'admin@acme.com',
          role: 'admin',
        },
      },
      { 'x-vtex-product': 'admin' }
    )

    expect(status.submittedBy).toBe('Staff Member')
    expect(status.comments).toHaveLength(2)
  })

  it('keeps the storefront view for an admin browsing the store', async () => {
    const [status] = await resolve(
      {
        userProfile: {
          userId: 'admin-id',
          email: 'admin@acme.com',
          role: 'admin',
        },
      },
      { 'x-vtex-product': 'store' }
    )

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toHaveLength(1)
  })

  it('hides internal data from a caller with no profile and no header', async () => {
    const [status] = await resolve({})

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toHaveLength(1)
  })
})
