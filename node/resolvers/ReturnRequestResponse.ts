import type { ReturnRequest } from 'vtex.return-app'

type VtexProduct = 'admin' | 'store' | undefined

const removeSubmittedByForStoreUser = (
  statusData: ReturnRequest['refundStatusData'][number],
  hideInternal: boolean
) => {
  if (hideInternal) {
    return {
      ...statusData,
      submittedBy: undefined,
    }
  }

  return statusData
}

// This function hides the submittedBy field and removes the comments that should not be visible to the store user
const transformStatusForStoreUser = (
  refundStatusDataList: ReturnRequest['refundStatusData'],
  hideInternal: boolean
) => {
  return (
    refundStatusDataList?.map((statusData) => {
      return {
        ...removeSubmittedByForStoreUser(statusData, hideInternal),
        comments: statusData.comments?.filter((comment) => {
          return !hideInternal || comment.visibleForCustomer
        }),
      }
    }) ?? []
  )
}

// This resolver allows the parent one to fetch just the root fields for a ReturnRequest.
// This stategy can save some kb when transfering data, since that in a search, we don't need all the fields.
export const ReturnRequestResponse = {
  refundableAmount: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, refundableAmount } = root

    if (refundableAmount) return refundableAmount

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { refundableAmount: refundableAmountValue } =
      await returnRequestClient.get(id as string, ['refundableAmount'])

    return refundableAmountValue
  },
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
  refundableAmountTotals: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, refundableAmountTotals } = root

    if (refundableAmountTotals) return refundableAmountTotals

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { refundableAmountTotals: refundableAmountTotalsData } =
      await returnRequestClient.get(id as string, ['refundableAmountTotals'])

    return refundableAmountTotalsData
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
    const {
      clients: { returnRequest: returnRequestClient },
      request: { header },
      state: { userProfile, appkey },
    } = ctx

    const vtexProduct = header['x-vtex-product'] as VtexProduct
    // The header is set by the caller, so it cannot be the only gate:
    // anyone who is not an admin or an appkey gets the store view.
    const isAdminCaller = Boolean(appkey) || userProfile?.role === 'admin'
    const hideInternal = vtexProduct === 'store' || !isAdminCaller

    const { refundStatusData: refundStatusDataList } = refundStatusData
      ? { refundStatusData }
      : await returnRequestClient.get(id as string, ['refundStatusData'])

    return transformStatusForStoreUser(
      refundStatusDataList as ReturnRequest['refundStatusData'],
      hideInternal
    )
  },
  cultureInfoData: async (
    root: ReturnRequest,
    _args: unknown,
    ctx: Context
  ) => {
    const { id, cultureInfoData } = root

    if (cultureInfoData) return cultureInfoData

    const {
      clients: { returnRequest: returnRequestClient },
    } = ctx

    const { cultureInfoData: cultureInfo } = await returnRequestClient.get(
      id as string,
      ['cultureInfoData']
    )

    return cultureInfo
  },
  // Resolve dateSubmitted value into createdIn field because we lost the original value of createdIn (migration data from v2 to v3).
  createdIn: async (root: ReturnRequest) => {
    const { dateSubmitted } = root

    return dateSubmitted
  },
}
