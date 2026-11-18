import { ReturnRequestResponse } from '../resolvers/ReturnRequestResponse'

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

const resolve = (state: unknown, header: Record<string, string> = {}) =>
  ReturnRequestResponse.refundStatusData(
    { id: 'request-id', refundStatusData } as any,
    {},
    { state, request: { header }, clients: {} } as any
  )

describe('ReturnRequestResponse.refundStatusData', () => {
  it('hides internal comments and submittedBy from a store user without the store header', async () => {
    const [status] = await resolve(
      { userProfile: { role: 'store-user' } },
      { 'x-vtex-product': 'admin' }
    )

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toEqual([
      { comment: 'visible', visibleForCustomer: true },
    ])
  })

  it('shows everything to an admin outside the storefront', async () => {
    const [status] = await resolve(
      { userProfile: { role: 'admin' } },
      { 'x-vtex-product': 'admin' }
    )

    expect(status.submittedBy).toBe('Staff Member')
    expect(status.comments).toHaveLength(2)
  })

  it('keeps the storefront view for an admin browsing the store', async () => {
    const [status] = await resolve(
      { userProfile: { role: 'admin' } },
      { 'x-vtex-product': 'store' }
    )

    expect(status.submittedBy).toBeUndefined()
    expect(status.comments).toHaveLength(1)
  })
})
