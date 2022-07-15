import type {
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequest,
  Status,
  RefundItemInput,
} from 'vtex.return-app'
import {
  ResolverError,
  ForbiddenError,
  NotFoundError,
  UserInputError,
} from '@vtex/api'

import { validateStatusUpdate } from '../utils/validateStatusUpdate'
import { createOrUpdateStatusPayload } from '../utils/createOrUpdateStatusPayload'
import { createRefundData } from '../utils/createRefundData'
import { handleRefund } from '../utils/handleRefund'
import { OMS_RETURN_REQUEST_STATUS_UPDATE } from '../utils/constants'
import { OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE } from '../utils/templates'
import type { MailData } from '../typings/mailClient'

// A partial update on MD requires all required field to be sent. https://vtex.slack.com/archives/C8EE14F1C/p1644422359807929
// And the request to update fails when we pass the auto generated ones.
// If any new field is added to the ReturnRequest as required, it has to be added here too.
const formatRequestToPartialUpdate = (
  request: ReturnRequest
): ReturnRequest => {
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
    cultureInfoData,
    dateSubmitted,
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
    cultureInfoData,
    dateSubmitted,
  }

  return partialUpdate
}

const acceptOrDenyPackage = (refundItemList?: RefundItemInput[]) => {
  return refundItemList?.some(({ quantity }) => quantity > 0)
    ? 'packageVerified'
    : 'denied'
}

export const updateRequestStatusService = async (
  ctx: Context,
  args: MutationUpdateReturnRequestStatusArgs
): Promise<ReturnRequest> => {
  const {
    state: { userProfile, appkey },
    clients: {
      returnRequest: returnRequestClient,
      oms,
      giftCard: giftCardClient,
      mail,
    },
    vtex: { logger },
  } = ctx

  const { status, requestId, comment, refundData } = args

  const { role, firstName, lastName, email } = userProfile ?? {}

  const requestDate = new Date().toISOString()
  const submittedByNameOrEmail =
    firstName || lastName ? `${firstName} ${lastName}` : email

  const submittedBy = appkey ?? submittedByNameOrEmail

  if (!submittedBy) {
    throw new ResolverError(
      'Unable to get submittedBy from context. The request is missing the userProfile info or the appkey'
    )
  }

  const userIsAdmin = Boolean(appkey) || role === 'admin'

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

  const refundInvoice =
    createRefundInvoice && requestStatus !== 'denied'
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
    createdAt: requestDate,
    refundInvoice,
    userEmail: returnRequest.customerProfileData?.email as string,
    clients: {
      omsClient: oms,
      giftCardClient,
    },
  })

  const giftCard = refundReturn?.giftCard

  const updatedRequest = {
    ...formatRequestToPartialUpdate(returnRequest),
    status: requestStatus,
    refundStatusData,
    refundData: refundInvoice
      ? { ...refundInvoice, ...(giftCard ? { giftCard } : null) }
      : null,
  }

  await returnRequestClient.update(requestId, updatedRequest)

  const { cultureInfoData } = updatedRequest

  // We add a try/catch here so we avoid sending an error to the browser only if the email fails.
  try {
    const templateExists = await mail.getTemplate(
      OMS_RETURN_REQUEST_STATUS_UPDATE(cultureInfoData?.locale)
    )

    if (!templateExists) {
      await mail.publishTemplate(
        OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE(cultureInfoData?.locale)
      )
    }

    const {
      status: updatedStatus,
      items,
      customerProfileData,
      refundStatusData: updatedRefundStatusData,
      refundPaymentData,
      refundData: updatedRefundData,
    } = updatedRequest

    const mailData: MailData = {
      templateName: OMS_RETURN_REQUEST_STATUS_UPDATE(cultureInfoData?.locale),
      jsonData: {
        data: {
          status: updatedStatus,
          name: customerProfileData?.name,
          DocumentId: requestId,
          email: customerProfileData?.email,
          paymentMethod: refundPaymentData?.refundPaymentMethod,
          iban: refundPaymentData?.iban,
          refundedAmount:
            Number(updatedRefundData?.refundedItemsValue) +
            Number(updatedRefundData?.refundedShippingValue),
        },
        products: items,
        refundStatusData: updatedRefundStatusData,
      },
    }

    await mail.sendMail(mailData)
  } catch (error) {
    logger.warn({
      message: `Failed to send email for return request ${requestId}`,
      error,
    })
  }

  return { id: requestId, ...updatedRequest }
}
