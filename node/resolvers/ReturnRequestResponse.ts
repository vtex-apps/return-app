import type { ReturnRequest } from 'vtex.return-app'

// This resolver allows the parent one to fetch just the root fields for a ReturnRequest.
// In a search, it can save some kb transfering data.
export const ReturnRequestResponse = {
  customerProfileData: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, customerProfileData } = root

    if (customerProfileData) return customerProfileData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { customerProfileData: customerProfile } =
      await returnRequestClient.get(id as string, ['customerProfileData'])

    return customerProfile
  },
  pickupReturnData: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, pickupReturnData } = root

    if (pickupReturnData) return pickupReturnData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { pickupReturnData: pickupData } = await returnRequestClient.get(
      id as string,
      ['pickupReturnData']
    )

    return pickupData
  },
  refundPaymentData: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, refundPaymentData } = root

    if (refundPaymentData) return refundPaymentData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { refundPaymentData: refundData } = await returnRequestClient.get(
      id as string,
      ['refundPaymentData']
    )

    return refundData
  },
  items: async (root: ReturnRequest, _args: unknown, ctx: Context) => {
    const { id, items } = root

    if (items) return items

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { items: itemsList } = await returnRequestClient.get(id as string, [
      'items',
    ])

    return itemsList
  },
  refundData: async (root: ReturnRequest, _args: unknown, ctx: Context) => {
    const { id, refundData } = root

    if (refundData) return refundData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { refundData: refundDataList } = await returnRequestClient.get(
      id as string,
      ['refundData']
    )

    return refundDataList
  },
  refundStatusData: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, refundStatusData } = root

    if (refundStatusData) return refundStatusData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { refundStatusData: refundStatusDataList } =
      await returnRequestClient.get(id as string, ['refundStatusData'])

    return refundStatusDataList
  },
}
