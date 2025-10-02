import type {
  MutationUpdateAdjustmentNoteStatusArgs,
  AdjustmentNote,
} from 'odp.return-app'
import {
  ResolverError,
  ForbiddenError,
  NotFoundError,
  UserInputError,
} from '@vtex/api'

import { createOrUpdateAdjustmentStatusPayload } from '../utils/createOrUpdateStatusPayload'
import { createAdjustmentRefundData } from '../utils/createRefundData'
import { handleAdjustmentRefund } from '../utils/handleRefund'

// A partial update on MD requires all required field to be sent. https://vtex.slack.com/archives/C8EE14F1C/p1644422359807929
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (
  request: AdjustmentNote
): AdjustmentNote => {
  const {
    orderId,
    requestAmount,
    sequenceNumber,
    type,
    status,
    customerProfileData,
    adjustmentData,
    authorizationData,
    transactionData,
    statusData,
    cultureInfoData,
    dateSubmitted,
    additionalInfo,
    financialStatus,
  } = request

  const partialUpdate = {
    orderId,
    requestAmount,
    type,
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
    financialStatus,
  }

  return partialUpdate
}

export const updateAdjustmentStatusService = async (
  ctx: Context,
  args: MutationUpdateAdjustmentNoteStatusArgs
): Promise<AdjustmentNote> => {
  const {
    state: { userProfile, appkey },
    clients: { adjustmentNoteClient, oms, giftCard: giftCardClient, events },
    vtex: { logger },
  } = ctx

  const { status, adjustmentId, comment, authorizationData, transactionData } =
    args

  const { role, firstName, lastName, email, userId } = userProfile ?? {}

  const requestDate = new Date().toISOString()
  const submittedByNameOrEmail =
    firstName || lastName ? `${firstName} ${lastName}` : email

  const submittedBy = appkey ?? submittedByNameOrEmail

  if (!submittedBy) {
    throw new ResolverError(
      'Unable to get submittedBy from context. The request is missing the userProfile info or the appkey'
    )
  }

  const adjustmentNote = (await adjustmentNoteClient.get(adjustmentId, [
    '_all',
  ])) as AdjustmentNote

  if (!adjustmentNote) {
    throw new NotFoundError(`Adjustment Note ${adjustmentId} not found`)
  }

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  const belongsToStoreUser =
    adjustmentNote.customerProfileData.userId === userId &&
    adjustmentNote.status === 'pending'

  if (!userIsAdmin && !belongsToStoreUser) {
    throw new ForbiddenError('Not authorized')
  }

  // validateStatusUpdate(status, adjustmentNote.status as Status)

  // when a request is made for the same status, it means admin user is adding a new comment
  if (status === adjustmentNote.status && !comment) {
    throw new UserInputError(
      'Missing comment. Comment is needed when status sent is equal the current status.'
    )
  }

  const isAuthorized = status === 'authorized'
  const isRefunded = status === 'refunded'

  // This is need in case a user wants to add a comment when status is authorized.
  // It avoids recreating a new authorizationData object and updating the request status
  const createAuthorization = isAuthorized && !adjustmentNote.authorizationData

  if (createAuthorization && !authorizationData) {
    throw new UserInputError(
      'Missing authorizationData property. To update status to authorized it is necessary to send the authorization object.'
    )
  }

  // This is need in case a user wants to add a comment when status is refunded.
  // It avoids recreating a new transactionData object and updating the request status
  const createRefundInvoice = isRefunded && !adjustmentNote.transactionData

  if (createRefundInvoice && !transactionData) {
    throw new UserInputError(
      'Missing transactionData property. To update status to refunded it is necessary to send the transaction object.'
    )
  }

  const requestStatus = status

  const statusData = createOrUpdateAdjustmentStatusPayload({
    statusData: adjustmentNote.statusData,
    requestStatus,
    comment,
    submittedBy,
    createdAt: requestDate,
  })

  const refundInvoice = createRefundInvoice
    ? createAdjustmentRefundData({
        sequenceNumber: adjustmentNote.sequenceNumber ?? 0,
        requestAmount: adjustmentNote.requestAmount,
        authorizedAmount: authorizationData?.authorizedAmount ?? 0,
        refundValue: transactionData?.invoiceValue ?? 0,
      })
    : adjustmentNote.transactionData

  const refundReturn = await handleAdjustmentRefund({
    currentStatus: requestStatus,
    previousStatus: adjustmentNote.status,
    adjustmentData: adjustmentNote.adjustmentData,
    orderId: adjustmentNote.orderId as string,
    createdAt: requestDate,
    refundInvoice,
    userEmail: adjustmentNote.customerProfileData?.email as string,
    clients: {
      omsClient: oms,
      giftCardClient,
    },
  })

  const giftCard = refundReturn?.giftCard

  const updatedRequest = {
    ...formatRequestToPartialUpdate(adjustmentNote),
    status: requestStatus,
    statusData,
    transactionData: refundInvoice
      ? { ...refundInvoice, ...(giftCard ? { giftCard } : null) }
      : null,
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

  // Log the event data being sent to external systems
  const eventData = {
    adjustmentNoteId: adjustmentId,
    status,
    comment,
    transactionData,
  }

  // Ensure refundData is always included, especially for amountRefunded status
  if (status === 'refunded' && !eventData.transactionData && refundInvoice) {
    logger.warn({
      message:
        'Missing transactionData in refunded event - using refundInvoice',
      adjustmentId,
      refundInvoice,
    })
    // Convert refundInvoice to the expected format for the event
    eventData.transactionData = {
      invoiceValue: refundInvoice.invoiceValue || 0,
    }
  }

  logger.info({
    message: 'Sending updateAdjustmentNote event to external systems',
    adjustmentId,
    eventData,
  })

  events.sendEvent('', 'return-app.updateAdjustmentNote', eventData)

  // Only send closeReturn event if the status is actually changing
  if (
    (requestStatus === 'refunded' ||
      requestStatus === 'charged' ||
      requestStatus === 'denied' ||
      requestStatus === 'cancelled') &&
    requestStatus !== adjustmentNote.status
  ) {
    events.sendEvent('', 'return-app.closeAdjustmentNote', {
      adjustmentNoteId: adjustmentId,
      status,
    })
  }

  return { id: adjustmentId, ...updatedRequest }
}
