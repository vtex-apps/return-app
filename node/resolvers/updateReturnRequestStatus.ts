import { ForbiddenError, UserInputError, NotFoundError } from '@vtex/api'
import type {
  MutationUpdateReturnRequestStatusArgs,
  RefundItemInput,
  ReturnRequest,
  Status,
} from 'vtex.return-app'

import { validateStatusUpdate } from '../utils/validateStatusUpdate'
import { createOrUpdateStatusPayload } from '../utils/createOrUpdateStatusPayload'
import { createRefundData } from '../utils/createRefundData'
import { handleRefund } from '../utils/handleRefund'

// A partial update on MD requires all required field to be sent. https://vtex.slack.com/archives/C8EE14F1C/p1644422359807929
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (request: ReturnRequest) => {
  const {
    orderId,
    refundableAmount,
    sequenceNumber,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    refundableAmountTotals,
    refundStatusData,
  } = request

  const partialUpdate = {
    orderId,
    refundableAmount,
    sequenceNumber,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    refundableAmountTotals,
    refundStatusData,
  }

  return partialUpdate
}

const acceptOrDenyPackage = (refundItemList?: RefundItemInput[]) => {
  return refundItemList?.some(({ quantity }) => quantity > 0)
    ? 'packageVerified'
    : 'denied'
}

export const updateReturnRequestStatus = async (
  _: unknown,
  args: MutationUpdateReturnRequestStatusArgs,
  ctx: Context
): Promise<ReturnRequest['refundStatusData']> => {
  const {
    state: { userProfile },
    clients: { returnRequest: returnRequestClient, oms },
  } = ctx

  const { status, requestId, comment, refundData } = args

  const { role, firstName, lastName, email } = userProfile

  const requestDate = new Date().toISOString()
  const submittedBy = firstName || lastName ? `${firstName} ${lastName}` : email

  const userIsAdmin = role === 'admin'

  if (!userIsAdmin) {
    throw new ForbiddenError('Not authorized')
  }

  const returnRequest = (await returnRequestClient.get(requestId, [
    '_all',
  ])) as ReturnRequest

  if (!returnRequest) {
    throw new NotFoundError('Request not found')
  }

  validateStatusUpdate(status, returnRequest.status as Status)

  // when a request is made for the same status, it means user is adding a new comment
  if (status === returnRequest.status && !comment) {
    throw new UserInputError('Missing comment')
  }

  const isPackageVerified = status === 'packageVerified'

  // This is need in case a user wants to add a comment when status is packageVerified.
  // It avoids recreating a new refundData object and updating the request status
  const createRefundInvoice = isPackageVerified && !returnRequest.refundData

  if (createRefundInvoice && !refundData) {
    throw new UserInputError('Missing refundData')
  }

  // When status is packageVerified, the final status is based on the quantity of items. If none is approved, status is denied.
  const requestStatus = createRefundInvoice
    ? acceptOrDenyPackage(refundData?.items)
    : status

  const refundStatusData = createOrUpdateStatusPayload({
    refundStatusData: returnRequest.refundStatusData,
    requestStatus,
    comment,
    submittedBy,
    createdAt: requestDate,
  })

  const refundInvoice = createRefundInvoice
    ? createRefundData({
        requestId,
        refundData,
        requestItems: returnRequest.items,
      })
    : returnRequest.refundData

  const refundReturn = await handleRefund({
    currentStatus: requestStatus,
    previousStatus: returnRequest.status,
    refundPaymentData: returnRequest.refundPaymentData ?? {},
    orderId: returnRequest.orderId as string,
    clients: {
      omsClient: oms,
    },
  })

  const giftCard = refundReturn?.giftCard

  await returnRequestClient.update(requestId, {
    ...formatRequestToPartialUpdate(returnRequest),
    status: requestStatus,
    refundStatusData,
    refundData: { ...refundInvoice, ...(giftCard ? { giftCard } : null) },
  })

  return refundStatusData
}
