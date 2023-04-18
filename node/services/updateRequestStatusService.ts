import type {
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequest,
  Status,
  RefundItemInput,
} from '../../typings/ReturnRequest'
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
import type { StatusUpdateMailData } from '../typings/mailClient'

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
  if (!refundItemList) {
    throw new UserInputError(
      'Missing items inside refundData object. It is necessary to pass a list of items to refund. To deny all items, pass a empty array.'
    )
  }

  if (!Array.isArray(refundItemList)) {
    throw new UserInputError(
      'Item has to be an array. To deny all items, pass a empty array.'
    )
  }

  return refundItemList.some(({ quantity, orderItemIndex }) => {
    if (typeof quantity !== 'number') {
      throw new UserInputError(
        `Not a valid quantity for item index ${orderItemIndex}`
      )
    }

    return quantity > 0
  })
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

  const { status, requestId, comment, refundData, sellerName } = args

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

  const returnRequest = (await returnRequestClient.get(requestId, [
    '_all',
  ])) as ReturnRequest

  if (!returnRequest) {
    throw new NotFoundError(`Request ${requestId} not found`)
  }

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  const belongsToStoreUser =
    returnRequest.customerProfileData.userId === userId &&
    returnRequest.status === 'new'

  if (!userIsAdmin && !belongsToStoreUser) {
    throw new ForbiddenError('Not authorized')
  }

  validateStatusUpdate(status, returnRequest.status as Status)

  // when a request is made for the same status, it means admin user is adding a new comment
  if (status === returnRequest.status && !comment) {
    throw new UserInputError(
      'Missing comment. Comment is needed when status sent is equal the current status.'
    )
  }

  const isPackageVerified = status === 'packageVerified'

  // This is need in case a user wants to add a comment when status is packageVerified.
  // It avoids recreating a new refundData object and updating the request status
  const createRefundInvoice = isPackageVerified && !returnRequest.refundData

  if (createRefundInvoice && !refundData) {
    throw new UserInputError(
      'Missing refundData property. To update status to packageVerified it is necessary to send items verification object.'
    )
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

  const maxRefundableShipping =
    returnRequest.refundableAmountTotals.find(({ id }) => id === 'shipping')
      ?.value ?? 0

  const refundInvoice =
    createRefundInvoice && requestStatus !== 'denied'
      ? createRefundData({
          requestId,
          refundData,
          requestItems: returnRequest.items,
          refundableShipping: maxRefundableShipping,
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
    sellerName: sellerName || undefined,
    status: requestStatus,
    refundStatusData,
    refundData: refundInvoice
      ? { ...refundInvoice, ...(giftCard ? { giftCard } : null) }
      : null,
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

    const mailData: StatusUpdateMailData = {
      templateName: OMS_RETURN_REQUEST_STATUS_UPDATE(cultureInfoData?.locale),
      jsonData: {
        data: {
          status: updatedStatus,
          name: customerProfileData?.name ?? '',
          DocumentId: requestId,
          email: customerProfileData?.email ?? '',
          paymentMethod: refundPaymentData?.refundPaymentMethod ?? '',
          iban: refundPaymentData?.iban ?? '',
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
