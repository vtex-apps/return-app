import type { ReturnRequest } from 'odp.return-app'
import { ResolverError, ForbiddenError, NotFoundError } from '@vtex/api'

import type { UpdateReturnRequestAdditionalInfoArgs } from '../typings/returnRequest'

// A partial update on MD requires all required field to be sent.
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (
  request: ReturnRequest
): ReturnRequest => {
  const {
    orderId,
    refundableAmount,
    sequenceNumber,
    externalReference,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    refundableAmountTotals,
    refundStatusData,
    cultureInfoData,
    dateSubmitted,
    additionalInfo,
  } = request

  const partialUpdate = {
    orderId,
    refundableAmount,
    sequenceNumber,
    externalReference,
    status,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    items,
    refundData,
    refundableAmountTotals,
    refundStatusData,
    cultureInfoData,
    dateSubmitted,
    additionalInfo,
  }

  return partialUpdate
}

export const updateRequestAdditionalInfoService = async (
  ctx: Context,
  args: UpdateReturnRequestAdditionalInfoArgs
): Promise<ReturnRequest> => {
  const {
    state: { userProfile, appkey },
    clients: { returnRequestClient },
  } = ctx

  const {
    requestId,
    additionalInfo: newAdditionalInfo,
    externalReference,
  } = args

  const { role } = userProfile ?? {}

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  if (!userIsAdmin) {
    throw new ForbiddenError('Not authorized')
  }

  const returnRequest = (await returnRequestClient.get(requestId, [
    '_all',
  ])) as ReturnRequest

  if (!returnRequest) {
    throw new NotFoundError(`Request ${requestId} not found`)
  }

  // Parse existing additionalInfo or use empty object if null/undefined
  const existingAdditionalInfo = returnRequest.additionalInfo
    ? JSON.parse(returnRequest.additionalInfo)
    : {}

  // Merge existing additionalInfo with new values, only updating fields that are provided
  const updatedAdditionalInfo = {
    ...existingAdditionalInfo,
    ...newAdditionalInfo,
  }

  const updatedRequest = {
    ...formatRequestToPartialUpdate(returnRequest),
    additionalInfo: JSON.stringify(updatedAdditionalInfo),
    ...(externalReference ? { externalReference } : {}),
  }

  try {
    await returnRequestClient.update(requestId, updatedRequest)
  } catch (error) {
    const mdValidationErrors = error?.response?.data?.errors[0]?.errors

    const errorMessageString = mdValidationErrors
      ? JSON.stringify(
          {
            message: 'Schema Validation error',
            errors: mdValidationErrors,
          },
          null,
          2
        )
      : error.message

    throw new ResolverError(errorMessageString, error.response?.status || 500)
  }

  return { id: requestId, ...updatedRequest }
}
