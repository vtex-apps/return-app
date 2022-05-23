import { ForbiddenError, UserInputError } from '@vtex/api'
import type {
  MutationUpdateReturnRequestStatusArgs,
  RefundItemInput,
  ReturnRequest,
  Status,
} from 'vtex.return-app'

import { validateStatusUpdate } from '../utils/validateStatusUpdate'
import { createOrUpdateStatusPayload } from '../utils/createOrUpdateStatusPayload'

// A partial update on MD requires all required field to be sent. https://vtex.slack.com/archives/C8EE14F1C/p1644422359807929
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (request: ReturnRequest) => {
  const {
    orderId,
    totalReturnAmount,
    sequenceNumber,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    returnTotals,
    refundStatusData,
  } = request

  const partialUpdate = {
    orderId,
    totalReturnAmount,
    sequenceNumber,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    returnTotals,
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
    clients: { returnRequest: returnRequestClient },
  } = ctx

  const { status, requestId, comment, refundData } = args

  const { role, firstName, lastName, email } = userProfile

  const requestDate = new Date().toISOString()
  const submittedBy = firstName || lastName ? `${firstName} ${lastName}` : email

  const userIsAdmin = role === 'admin'

  if (!userIsAdmin) {
    throw new ForbiddenError('Not authorized')
  }

  const request = (await returnRequestClient.get(requestId, [
    '_all',
  ])) as ReturnRequest

  validateStatusUpdate(status, request.status as Status)

  // when a request is made for the same status, it means user is adding a new comment
  if (status === request.status && !comment) {
    throw new UserInputError('Missing comment')
  }

  const isPackageVerified = status === 'packageVerified'

  if (isPackageVerified && !refundData) {
    throw new UserInputError('Missing refundData')
  }

  // When status is packageVerified, the final status is based on the quantity of items. If none is approved, status is denied.
  const requestStatus = isPackageVerified
    ? acceptOrDenyPackage(refundData?.items)
    : status

  const refundStatusData = createOrUpdateStatusPayload({
    refundStatusData: request.refundStatusData,
    requestStatus,
    comment,
    submittedBy,
    createdAt: requestDate,
  })

  const refundDataObject: ReturnRequest['refundData'] =
    requestStatus !== 'packageVerified'
      ? request.refundData
      : {
          invoiceNumber: requestId,
          invoiceValue: 1234,
          refundedItemsValue: 1234,
          refundedShippingValue: refundData?.refundedShippingValue ?? 0,
          items: refundData?.items ?? [],
        }

  if (requestStatus === 'amountRefunded') {
    // handle gift card and credit card
  }

  await returnRequestClient.update(requestId, {
    ...formatRequestToPartialUpdate(request),
    status: requestStatus,
    refundStatusData,
    refundData: refundDataObject,
  })

  return refundStatusData
}
