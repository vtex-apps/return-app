import type {
  AdjustmentNoteCreated,
  AdjustmentNoteInput,
  AdjustmentNoteStatus,
} from 'odp.return-app'
import { UserInputError, ResolverError } from '@vtex/api'
import type { DocumentResponse } from '@vtex/clients/build/clients/masterData/MasterDataEntity'

import { SETTINGS_PATH } from '../utils/constants'
import { isUserAdmin } from '../utils/isUserAllowed'
import { canOrderBeAdjusted } from '../utils/canOrderBeReturned'
import { getCustomerEmail } from '../utils/getCostumerEmail'

export const createAdjustmentNoteService = async (
  ctx: Context,
  args: AdjustmentNoteInput
): Promise<AdjustmentNoteCreated> => {
  const {
    clients: { oms, adjustmentNoteClient, appSettings, events },
    state: { userProfile, appkey },
    vtex: { logger },
  } = ctx

  const {
    orderId,
    type,
    requestAmount,
    customerProfileData,
    paymentData,
    userComment,
    locale,
    additionalInfo,
  } = args

  if (!appkey && !userProfile) {
    throw new ResolverError('Missing appkey or userProfile')
  }

  const { firstName, lastName, email } = userProfile ?? {}

  const submittedByNameOrEmail =
    firstName || lastName ? `${firstName} ${lastName}` : email

  // If request was validated using appkey and apptoken, we assign the appkey as a sender
  // Otherwise, we try to use requester name. Email is the last resort.
  const submittedBy = appkey ?? submittedByNameOrEmail

  if (!submittedBy) {
    throw new ResolverError(
      'Unable to get submittedBy from context. The request is missing the userProfile info or the appkey'
    )
  }

  const requestDate = new Date().toISOString()

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const orderPromise = oms.order(orderId, 'AUTH_TOKEN')

  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, request searchRMA will be an empty array.
  const [order, settings] = await Promise.all([orderPromise, settingsPromise])

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  if (!order) {
    throw new ResolverError('Order not found', 404)
  }

  const {
    clientProfileData,
    status,
    storePreferencesData: { currencyCode },
  } = order

  const { paymentOptions } = settings

  isUserAdmin({
    requesterUser: userProfile,
    appkey,
  })

  canOrderBeAdjusted({
    status,
  })

  if (requestAmount <= 0) {
    throw new UserInputError('Request amount must be greater than 0')
  }

  if (type !== 'creditNote' && type !== 'debitNote') {
    throw new UserInputError('Invalid adjustment note type')
  }

  const userCommentData = userComment
    ? [
        {
          comment: userComment,
          createdAt: requestDate,
          submittedBy,
          visibleForCustomer: true,
          role: 'storeUser' as const,
        },
      ]
    : []

  // customerProfileData can be undefined when coming from a endpoint request
  const { email: inputEmail } = customerProfileData ?? {}

  const customerEmail = getCustomerEmail(
    clientProfileData,
    {
      userProfile,
      appkey,
      inputEmail,
    },
    {
      logger,
    }
  )

  const { paymentMethod } = paymentData

  const { automaticallyRefundPaymentMethod } = paymentOptions

  const createTransaction =
    paymentMethod === 'sameAsPurchase'
      ? Boolean(automaticallyRefundPaymentMethod)
      : null

  let adjDocument: DocumentResponse

  try {
    const adjDocumentPayload = {
      orderId,
      requestAmount,
      type,
      status: 'pending' as AdjustmentNoteStatus,
      customerProfileData: {
        userId: clientProfileData.userProfileId,
        name: customerProfileData.name,
        email: customerEmail,
        phoneNumber: customerProfileData.phoneNumber,
      },
      paymentData: {
        paymentMethod,
        automaticallyCreateTransaction: createTransaction,
      },
      dateSubmitted: requestDate,
      authorizationData: null,
      transactionData: null,
      statusData: [
        {
          status: 'pending' as AdjustmentNoteStatus,
          submittedBy,
          createdAt: requestDate,
          comments: userCommentData,
        },
      ],
      cultureInfoData: {
        currencyCode,
        locale,
      },
      additionalInfo: additionalInfo ?? undefined,
    }

    adjDocument = await adjustmentNoteClient.save(adjDocumentPayload)
  } catch (error) {
    const mdValidationErrors = error?.response?.data?.errors?.[0]?.errors

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

  /*
  * Disabling email sending
  // We add a try/catch here so we avoid sending an error to the browser only if the email fails.
  try {
    const templateExists = await mail.getTemplate(
      OMS_RETURN_REQUEST_CONFIRMATION(locale)
    )

    if (!templateExists) {
      await mail.publishTemplate(
        OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE(locale)
      )
    }

    const {
      firstName: clientFirstName,
      lastName: clientLastName,
      phone,
    } = clientProfileData

    const {
      address: { country, city, street },
    } = shippingData

    const mailData: ConfirmationMailData = {
      templateName: OMS_RETURN_REQUEST_CONFIRMATION(locale),
      jsonData: {
        data: {
          status: 'new',
          name: `${clientFirstName} ${clientLastName}`,
          DocumentId: rmaDocument.DocumentId,
          email: customerEmail,
          phoneNumber: phone,
          country,
          locality: city,
          address: street,
          paymentMethod: refundPaymentData.refundPaymentMethod,
        },
        products: [...itemsToReturn],
        refundStatusData: [
          {
            status: 'new',
            submittedBy,
            createdAt: requestDate,
            comments: userCommentData,
          },
        ],
      },
    }

    await mail.sendMail(mailData)
  } catch (error) {
    logger.warn({
      message: `Failed to send email for adjustment request ${adjDocument.DocumentId}`,
      error,
    })
  }
  */

  events.sendEvent('', 'return-app.createAdjustmentNote', {
    adjustmentNoteId: adjDocument.DocumentId,
  })

  return { adjustmentNoteId: adjDocument.DocumentId }
}
