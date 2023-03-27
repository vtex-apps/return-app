import type { ReturnRequest } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

import { OMS_RETURN_REQUEST_STATUS_UPDATE } from '../utils/constants'
import { OMS_RETURN_REQUEST_STATUS_UPDATE_TEMPLATE } from '../utils/templates'
import type { StatusUpdateMailData } from '../typings/mailClient'

export const updateRequestStatusFromSellerService = async (
  ctx: Context,
  args: ReturnRequest,
  requestId: string
): Promise<ReturnRequest> => {
  const {
    clients: { returnRequest: returnRequestClient, mail },
    vtex: { logger },
  } = ctx

  const { sellerName } = args

  const updatedRequest = {
    ...args,
    sellerName: sellerName || undefined,
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
