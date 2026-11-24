import type { ReturnRequest } from '../typings/returnRequest'

type RefundStatusData = ReturnRequest['refundStatusData']

/**
 * Removes what only the merchant should see: who changed each status and
 * comments not marked as visible for the customer.
 */
export const hideInternalStatusData = (
  refundStatusData: RefundStatusData | null | undefined
) =>
  refundStatusData?.map((statusData) => ({
    ...statusData,
    submittedBy: undefined,
    // Comment authors are staff names too. An empty string keeps the
    // GraphQL String! contract.
    comments: statusData.comments
      ?.filter((comment) => comment.visibleForCustomer)
      .map((comment) => ({ ...comment, submittedBy: '' })),
  })) ?? []

/** Applies hideInternalStatusData to a full return request document. */
export const hideInternalFields = <
  T extends { refundStatusData?: RefundStatusData | null }
>(
  request: T
): T =>
  request?.refundStatusData
    ? ({
        ...request,
        refundStatusData: hideInternalStatusData(request.refundStatusData),
      } as T)
    : request
