import { ResolverError } from '@vtex/api'
import type { ReturnRequest } from 'vtex.return-app'

import type { ReturnLabelMailData } from '../typings/mailClient'
import { templateName } from '../utils/emailTemplates'
import { OMS_RETURN_REQUEST_LABEL_TEMPLATE } from '../utils/templates'
import { formatRequestToPartialUpdate } from './updateRequestStatusService'

export const sendReturnLabelService = async (
  ctx: Context,
  requestId: string,
  labelUrl: string
) => {
  const {
    clients: { mail, returnRequest: returnRequestClient },
    vtex: { logger },
  } = ctx

  if (!requestId || !labelUrl) {
    throw new ResolverError(
      'The requestId or the labelUrl was not provided',
      400
    )
  }

  const returnRequest = (await returnRequestClient.get(requestId, [
    '_all',
  ])) as ReturnRequest

  const {
    pickupReturnData,
    cultureInfoData: { locale },
  } = returnRequest

  const updatedPickupReturnData = {
    ...pickupReturnData,
    labelUrl,
  }

  const updatedRequest = {
    ...formatRequestToPartialUpdate(returnRequest),
    pickupReturnData: updatedPickupReturnData,
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

  try {
    const templateExists = await mail.getTemplate(templateName('label', locale))

    if (!templateExists) {
      await mail.publishTemplate(OMS_RETURN_REQUEST_LABEL_TEMPLATE(locale))
    }

    const { customerProfileData } = updatedRequest

    const mailData: ReturnLabelMailData = {
      templateName: templateName('label', locale),
      jsonData: {
        data: {
          name: customerProfileData.name,
          DocumentId: requestId,
          email: customerProfileData.email,
          labelUrl,
        },
      },
    }

    await mail.sendMail(mailData)
  } catch (error) {
    logger.warn({
      message: `Failed to send email for return request ${requestId}`,
      error,
    })

    return false
  }

  return true
}
