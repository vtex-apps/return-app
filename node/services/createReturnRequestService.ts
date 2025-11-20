import type { ReturnRequestCreated, ReturnRequestInput } from 'odp.return-app'
import { UserInputError, ResolverError } from '@vtex/api'
import type { DocumentResponse } from '@vtex/clients/build/clients/masterData/MasterDataEntity'

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
import { CommonLogger } from '../utils/commonLogger'

export const createReturnRequestService = async (
  ctx: Context,
  args: ReturnRequestInput
): Promise<ReturnRequestCreated> => {
  const {
    clients: {
      oms,
      returnRequestClient,
      appSettings,
      mail,
      catalogGQL,
      events,
    },
    state: { userProfile, appkey },
    vtex: { logger },
  } = ctx

  const {
    orderId,
    items,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    userComment,
    locale,
    additionalInfo,
  } = args

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.started',
    {
      orderId,
      itemsCount: items?.length,
      locale,
      hasAppkey: !!appkey,
      hasUserProfile: !!userProfile,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  if (!appkey && !userProfile) {
    CommonLogger.logError(
      ctx,
      new Error('Missing appkey or userProfile'),
      'createReturnRequest.authentication',
      { orderId }
    )
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
  /* if (!items || items.length === 0) {
    throw new UserInputError('There are no items in the request')
  } */

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

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.dataFetched',
    {
      orderId,
      orderStatus: order.status,
      existingRMACount: searchRMA?.pagination?.total || 0,
      settingsConfigured: !!settings,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  if (!settings) {
    CommonLogger.logError(
      ctx,
      new Error('Return App settings is not configured'),
      'createReturnRequest.settings',
      { orderId }
    )
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
  } = settings

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.validationStarted',
    {
      orderId,
      orderStatus: status,
      maxDays,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
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

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.validationPassed',
    {
      orderId,
      itemsCount: items?.length,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
  // Possible alternative: Save a key value pair in to VBase where key is the orderId and value is either the latest sequence (as number) or an array with all Ids, so we can use the length to calcualate the next seuqence number.
  const sequenceNumber = `${sequence}-${Number(total) + 1}`

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

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.savingToMasterData',
    {
      orderId,
      sequenceNumber,
      refundableAmount,
      refundPaymentMethod,
      customerEmail,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  try {
    rmaDocument = await returnRequestClient.save({
      orderId,
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
        automaticallyRefundPaymentMethod: createInvoiceTypeInput ?? undefined,
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
      additionalInfo: additionalInfo ?? undefined,
    })

    CommonLogger.logApiOperation(
      ctx,
      'createReturnRequest.masterDataSaved',
      {
        orderId,
        returnRequestId: rmaDocument.DocumentId,
        sequenceNumber,
      },
      {
        file: 'services/createReturnRequestService.ts',
        function: 'createReturnRequestService',
      }
    )
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

    CommonLogger.logError(
      ctx,
      error,
      'createReturnRequest.masterDataSaveFailed',
      {
        orderId,
        sequenceNumber,
        errorMessage: errorMessageString,
        validationErrors: mdValidationErrors,
      },
      {
        file: 'services/createReturnRequestService.ts',
        function: 'createReturnRequestService',
      }
    )

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

    CommonLogger.logApiOperation(
      ctx,
      'createReturnRequest.emailSent',
      {
        orderId,
        returnRequestId: rmaDocument.DocumentId,
        customerEmail,
      },
      {
        file: 'services/createReturnRequestService.ts',
        function: 'createReturnRequestService',
      }
    )
  } catch (error) {
    CommonLogger.logWarning(
      ctx,
      `Failed to send email for return request ${rmaDocument.DocumentId}`,
      {
        orderId,
        returnRequestId: rmaDocument.DocumentId,
        error: error.message,
      },
      {
        file: 'services/createReturnRequestService.ts',
        function: 'createReturnRequestService',
      }
    )

    logger.warn({
      message: `Failed to send email for return request ${rmaDocument.DocumentId}`,
      error,
    })
  }

  events.sendEvent('', 'return-app.createReturn', {
    returnRequestId: rmaDocument.DocumentId,
  })

  CommonLogger.logApiOperation(
    ctx,
    'createReturnRequest.completed',
    {
      orderId,
      returnRequestId: rmaDocument.DocumentId,
      sequenceNumber,
      refundableAmount,
      itemsCount: items?.length,
    },
    {
      file: 'services/createReturnRequestService.ts',
      function: 'createReturnRequestService',
    }
  )

  return { returnRequestId: rmaDocument.DocumentId }
}
