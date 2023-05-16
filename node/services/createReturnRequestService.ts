import type { ReturnRequestCreated, ReturnRequestInput } from '../../typings/ReturnRequest'
import { UserInputError, ResolverError } from '@vtex/api'
import type { DocumentResponse } from '@vtex/clients'

import {
  SETTINGS_PATH,
  OMS_RETURN_REQUEST_CONFIRMATION,
} from '../utils/constants'
import { isUserAllowed } from '../utils/isUserAllowed'
import { canOrderBeReturned } from '../utils/canOrderBeReturned'
import { canReturnAllItems } from '../utils/canReturnAllItems'
import { validateReturnReason } from '../utils/validateReturnReason'
import { validatePaymentMethod } from '../utils/validatePaymentMethod'
import { validateCanUsedropoffPoints } from '../utils/validateCanUseDropoffPoints'
import { createItemsToReturn } from '../utils/createItemsToReturn'
import { createRefundableTotals } from '../utils/createRefundableTotals'
import { OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE } from '../utils/templates'
import type { ConfirmationMailData } from '../typings/mailClient'
import { getCustomerEmail } from '../utils/getCostumerEmail'
import { validateItemCondition } from '../utils/validateItemCondition'

export const createReturnRequestService = async (
  ctx: Context,
  args: ReturnRequestInput
): Promise<ReturnRequestCreated> => {
  const {
    clients: {
      oms,
      returnRequest: returnRequestClient,
      appSettings,
      mail,
      catalogGQL,
    },
    state: { userProfile, appkey },
    vtex: { logger },
  } = ctx

  const {
    orderId,
    sellerName,
    items,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    userComment,
    locale,
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

  // Check items since a request via endpoint might not have it.
  // Graphql validation doesn't prevent user to send empty items
  if (!items || items.length === 0) {
    throw new UserInputError('There are no items in the request')
  }

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const orderPromise = oms.order(orderId, 'AUTH_TOKEN')

  const searchRMAPromise = returnRequestClient.searchRaw(
    { page: 1, pageSize: 1 },
    ['id'],
    undefined,
    `orderId=${orderId}`
  )

  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, request searchRMA will be an empty array.
  const [order, searchRMA, settings] = await Promise.all([
    orderPromise,
    searchRMAPromise,
    settingsPromise,
  ])

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const {
    pagination: { total },
  } = searchRMA

  const {
    sequence,
    clientProfileData,
    items: orderItems,
    totals,
    creationDate,
    status,
    sellers,
    // @ts-expect-error itemMetadata is not typed in the OMS client project
    itemMetadata,
    shippingData,
    storePreferencesData: { currencyCode },
  } = order

  const {
    maxDays,
    excludedCategories,
    customReturnReasons,
    paymentOptions,
    options: settingsOptions,
    orderStatus
  } = settings

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
    orderStatus
  })

  // Validate if all items are available to be returned
  await canReturnAllItems(items, {
    order,
    excludedCategories,
    returnRequestClient,
    catalogGQL,
  })

  // Validate maxDays for custom reasons.
  validateReturnReason(items, creationDate, customReturnReasons)

  // Validate payment methods
  validatePaymentMethod(refundPaymentData, paymentOptions)

  // validate address type
  validateCanUsedropoffPoints(
    pickupReturnData,
    settingsOptions?.enablePickupPoints
  )

  // validate item condition
  validateItemCondition(items, settingsOptions?.enableSelectItemCondition)

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
  // Possible alternative: Save a key value pair in to VBase where key is the orderId and value is either the latest sequence (as number) or an array with all Ids, so we can use the length to calcualate the next seuqence number.
  const sequenceNumber = `${sequence}-${total + 1}`

  const itemsToReturn = await createItemsToReturn({
    itemsToReturn: items,
    orderItems,
    sellers,
    itemMetadata,
    catalogGQL,
  })

  const refundableAmountTotals = createRefundableTotals(
    itemsToReturn,
    totals,
    settings?.options?.enableProportionalShippingValue
  )

  const refundableAmount = refundableAmountTotals.reduce(
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    (amount, cur) => amount + cur.value,
    0
  )

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

  const { refundPaymentMethod } = refundPaymentData

  const { iban, accountHolderName, ...refundPaymentMethodSubset } =
    refundPaymentData

  const refundPaymentDataResult =
    refundPaymentMethod === 'bank'
      ? refundPaymentData
      : refundPaymentMethodSubset

  const { automaticallyRefundPaymentMethod } = paymentOptions

  const createInvoiceTypeInput =
    refundPaymentMethod === 'sameAsPurchase'
      ? Boolean(automaticallyRefundPaymentMethod)
      : null

  let rmaDocument: DocumentResponse

  try {
    rmaDocument = await returnRequestClient.save({
      orderId,
      sellerName: sellerName || sellers?.[0]?.id || undefined,
      refundableAmount,
      sequenceNumber,
      status: 'new',
      refundableAmountTotals,
      customerProfileData: {
        userId: clientProfileData.userProfileId,
        name: customerProfileData.name,
        email: customerEmail,
        phoneNumber: customerProfileData.phoneNumber,
      },
      pickupReturnData,
      refundPaymentData: {
        ...refundPaymentDataResult,
        automaticallyRefundPaymentMethod: createInvoiceTypeInput,
      },
      items: itemsToReturn,
      dateSubmitted: requestDate,
      refundData: null,
      refundStatusData: [
        {
          status: 'new',
          submittedBy,
          createdAt: requestDate,
          comments: userCommentData,
        },
      ],
      cultureInfoData: {
        currencyCode,
        locale,
      },
      logisticsInfo: {
        currier: shippingData?.logisticsInfo.map((logisticInfo: any) => logisticInfo?.deliveryCompany)?.join(','),
        sla: shippingData?.logisticsInfo.map((logisticInfo: any) => logisticInfo?.selectedSla)?.join(',')
      }
    })
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
      message: `Failed to send email for return request ${rmaDocument.DocumentId}`,
      error,
    })
  }

  return { returnRequestId: rmaDocument.DocumentId }
}
