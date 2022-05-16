import { ForbiddenError, ResolverError, UserInputError } from '@vtex/api'
import type {
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequest,
} from 'vtex.return-app'

// A partial update on MD requires all required field to be sent. If any new field is added to the ReturnRequest as required, it has to be added here too.
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
) => {
  const {
    state: { userProfile },
    clients: { returnRequest: returnRequestClient },
  } = ctx

  const { status, requestId, comment } = args

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

  if (status === request.status) {
    if (!comment) {
      throw new UserInputError('Missing comment')
    }

    if (!request.refundStatusData) {
      throw new ResolverError('Request does not have redundStatusData')
    }

    const statusPayload = request.refundStatusData.map((statusObject) => {
      if (statusObject.status !== status) return statusObject
      const newComment = {
        comment,
        createdAt: requestDate,
        submittedBy,
        visibleForCustomer: false,
      }

      const commentsUpdated =
        statusObject?.comments?.map((commentArg) => {
          if (!commentArg.visibleForCustomer) {
            return {
              ...commentArg,
              visibleForCustomer: false,
            }
          }

          return commentArg
        }) ?? []

      const updatedStatusObject = {
        ...statusObject,
        comments: [...commentsUpdated, newComment],
      }

      return updatedStatusObject
    })

    await returnRequestClient.update(requestId, {
      ...formatRequestToPartialUpdate(request),
      refundStatusData: statusPayload,
    })

    return statusPayload
  }

  // placeholder for return value. It should return the updated object
  return request.refundStatusData
}
