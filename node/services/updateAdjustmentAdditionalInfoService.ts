import type { AdjustmentNote } from 'odp.return-app'
import { ResolverError, ForbiddenError, NotFoundError } from '@vtex/api'

import type { UpdateAdjustmentNoteAdditionalInfoArgs } from '../typings/adjustmentNote'

// A partial update on MD requires all required field to be sent.
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (
  request: AdjustmentNote
): AdjustmentNote => {
  const {
    orderId,
    type,
    requestAmount,
    sequenceNumber,
    status,
    customerProfileData,
    adjustmentData,
    authorizationData,
    transactionData,
    statusData,
    cultureInfoData,
    dateSubmitted,
    additionalInfo,
  } = request

  const partialUpdate = {
    orderId,
    type,
    requestAmount,
    sequenceNumber,
    status,
    customerProfileData,
    adjustmentData,
    authorizationData,
    transactionData,
    statusData,
    cultureInfoData,
    dateSubmitted,
    additionalInfo,
  }

  return partialUpdate
}

export const updateAdjustmentAdditionalInfoService = async (
  ctx: Context,
  args: UpdateAdjustmentNoteAdditionalInfoArgs
): Promise<AdjustmentNote> => {
  const {
    state: { userProfile, appkey },
    clients: { adjustmentNoteClient },
  } = ctx

  const { adjustmentId, additionalInfo: newAdditionalInfo } = args

  const { role } = userProfile ?? {}

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  if (!userIsAdmin) {
    throw new ForbiddenError('Not authorized')
  }

  const adjustmentNote = (await adjustmentNoteClient.get(adjustmentId, [
    '_all',
  ])) as AdjustmentNote

  if (!adjustmentNote) {
    throw new NotFoundError(`Adjustment Note ${adjustmentId} not found`)
  }

  // Parse existing additionalInfo or use empty object if null/undefined
  const existingAdditionalInfo = adjustmentNote.additionalInfo
    ? JSON.parse(adjustmentNote.additionalInfo)
    : {}

  // Merge existing additionalInfo with new values, only updating fields that are provided
  const updatedAdditionalInfo = {
    ...existingAdditionalInfo,
    ...newAdditionalInfo,
  }

  const updatedRequest = {
    ...formatRequestToPartialUpdate(adjustmentNote),
    additionalInfo: JSON.stringify(updatedAdditionalInfo),
  }

  try {
    await adjustmentNoteClient.update(adjustmentId, updatedRequest)
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

  return { id: adjustmentId, ...updatedRequest }
}
