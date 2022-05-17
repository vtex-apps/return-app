import { ForbiddenError, ResolverError, UserInputError } from '@vtex/api'
import type {
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequest,
  Status,
} from 'vtex.return-app'

const previousStatusAllowed: Record<Status, Status[]> = {
  new: ['new'],
  processing: ['new', 'processing'],
  pickedUpFromClient: ['processing', 'pickedUpFromClient'],
  pendingVerification: ['pickedUpFromClient', 'pendingVerification'],
  packageVerified: ['pendingVerification', 'packageVerified'],
  amountRefunded: ['packageVerified', 'amountRefunded'],
  denied: [
    'new',
    'processing',
    'pickedUpFromClient',
    'pendingVerification',
    'denied',
  ],
}

const validateStatus = (newStatus: Status, currentStatus: Status) => {
  if (!previousStatusAllowed[newStatus].includes(currentStatus)) {
    throw new ResolverError(
      `Status transition from ${currentStatus} to ${newStatus} is not allowed`
    )
  }
}

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

  validateStatus(status, request.status as Status)

  // when a request is made for the same status, it means user is adding a new comment
  if (status === request.status && !comment) {
    throw new UserInputError('Missing comment')
  }

  if (!request.refundStatusData) {
    throw new ResolverError('Request does not have refundStatusData')
  }

  const isPackageVerified = status === 'packageVerified'

  if (isPackageVerified && !refundData) {
    throw new UserInputError('Missing refundData')
  }

  const updatedStatus = !isPackageVerified
    ? status
    : refundData?.items.some(({ quantity }) => quantity > 0)
    ? status
    : 'denied'

  const newComment = comment
    ? {
        comment: comment.value,
        createdAt: requestDate,
        submittedBy,
        visibleForCustomer: comment.visibleForCustomer,
      }
    : null

  const hasStatusObject = request.refundStatusData.find(
    ({ status: statusRequest }) => statusRequest === updatedStatus
  )

  const statusPayload: ReturnRequest['refundStatusData'] = hasStatusObject
    ? request.refundStatusData.map((statusObject) => {
        if (statusObject.status !== updatedStatus) return statusObject
        const updatedStatusObject = {
          ...statusObject,
          comments: [
            ...(statusObject?.comments ?? []),
            { ...(newComment ? { newComment } : null) },
          ],
        }

        return updatedStatusObject
      })
    : [
        ...request.refundStatusData,
        {
          status: updatedStatus,
          submittedBy,
          createdAt: requestDate,
          comments: [{ ...(newComment ? { newComment } : null) }],
        },
      ]

  const refundDataObject: ReturnRequest['refundData'] = !isPackageVerified
    ? null
    : {
        invoiceNumber: requestId,
        invoiceValue: 1234,
        refundedItemsValue: 1234,
        refundedShippingValue: refundData?.refundedShippingValue ?? 0,
        items: refundData?.items ?? [],
      }

  await returnRequestClient.update(requestId, {
    ...formatRequestToPartialUpdate(request),
    status: updatedStatus,
    refundStatusData: statusPayload,
    refundData: refundDataObject,
  })

  return statusPayload
}
