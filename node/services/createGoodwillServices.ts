import { UserInputError, ResolverError } from '@vtex/api'
import type { DocumentResponse } from '@vtex/clients'

import { SETTINGS_PATH } from '../utils/constants'
import { validatePaymentMethod } from '../utils/validatePaymentMethod'

export const createGoodwillService = async (
  ctx: Context,
  args: any
): Promise<any> => {
  const {
    clients: {
      oms,
      returnRequest: returnRequestClient,
      appSettings,
      // mail,
      // catalogGQL,
    },
    state: { userProfile, appkey },
    // vtex: { logger },
  } = ctx

  console.info('args: ', args)

  const { orderId, sellerId, refundPaymentData, reason, creditAmount } = args

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

  const searchRMAData = await searchRMA

  if (searchRMAData && searchRMAData.data.length !== 0) {
    throw new Error("There's already a request or goodwill for this order")
  }

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const {
    pagination: { total },
  } = searchRMA

  const {
    sequence,
    // clientProfileData,
    // sellers,
    // itemMetadata,
    shippingData,
    storePreferencesData: { currencyCode },
    sellerOrderId,
  } = order

  const { paymentOptions } = settings

  // Validate payment methods
  validatePaymentMethod(refundPaymentData, paymentOptions)

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
  // Possible alternative: Save a key value pair in to VBase where key is the orderId and value is either the latest sequence (as number) or an array with all Ids, so we can use the length to calcualate the next seuqence number.
  const sequenceNumber = `${sequence}-${total + 1}`

  // const refundableAmountTotals = createRefundableTotals(
  //   itemsToReturn,
  //   totals,
  //   settings?.options?.enableProportionalShippingValue
  // )

  // const refundableAmount = refundableAmountTotals.reduce(
  //   // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
  //   (amount, cur) => amount + cur.value,
  //   0
  // )

  // customerProfileData can be undefined when coming from a endpoint request
  // const { email: inputEmail } = customerProfileData ?? {}

  // const customerEmail = getCustomerEmail(
  //   clientProfileData,
  //   {
  //     userProfile,
  //     appkey,
  //     inputEmail,
  //   },
  //   {
  //     logger,
  //   }
  // )

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
      sellerOrderId,
      // sellerName: sellerName || sellers?.[0]?.id || undefined,
      sellerId: sellerId || undefined,
      // refundableAmount,
      sequenceNumber,
      status: 'goodwill',
      // refundableAmountTotals,
      // customerProfileData: {
      //   userId: clientProfileData.userProfileId,
      //   name: customerProfileData.name,
      //   email: customerEmail,
      //   phoneNumber: customerProfileData.phoneNumber,
      // },
      // pickupReturnData,
      refundPaymentData: {
        ...refundPaymentDataResult,
        automaticallyRefundPaymentMethod: createInvoiceTypeInput,
      },
      goodwillData: {
        creditAmount,
      },
      // items: itemsToReturn,
      dateSubmitted: requestDate,
      refundData: null,
      refundStatusData: [
        {
          status: 'new',
          submittedBy,
          createdAt: requestDate,
          // comments: userCommentData,
        },
      ],
      cultureInfoData: {
        currencyCode,
        // locale,
      },
      logisticsInfo: {
        currier: shippingData?.logisticsInfo
          .map((logisticInfo: any) => logisticInfo?.deliveryCompany)
          ?.join(','),
        sla: shippingData?.logisticsInfo
          .map((logisticInfo: any) => logisticInfo?.selectedSla)
          ?.join(','),
      },
      reason,
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

  // // We add a try/catch here so we avoid sending an error to the browser only if the email fails.
  // try {
  //   const templateExists = await mail.getTemplate(
  //     OMS_RETURN_REQUEST_CONFIRMATION(locale)
  //   )

  //   if (!templateExists) {
  //     await mail.publishTemplate(
  //       OMS_RETURN_REQUEST_CONFIRMATION_TEMPLATE(locale)
  //     )
  //   }

  //   const {
  //     firstName: clientFirstName,
  //     lastName: clientLastName,
  //     phone,
  //   } = clientProfileData

  //   const {
  //     address: { country, city, street },
  //   } = shippingData

  //   const mailData: ConfirmationMailData = {
  //     templateName: OMS_RETURN_REQUEST_CONFIRMATION(locale),
  //     jsonData: {
  //       data: {
  //         status: 'new',
  //         name: `${clientFirstName} ${clientLastName}`,
  //         DocumentId: rmaDocument.DocumentId,
  //         email: customerEmail,
  //         phoneNumber: phone,
  //         country,
  //         locality: city,
  //         address: street,
  //         paymentMethod: refundPaymentData.refundPaymentMethod,
  //       },
  //       products: [...itemsToReturn],
  //       refundStatusData: [
  //         {
  //           status: 'new',
  //           submittedBy,
  //           createdAt: requestDate,
  //           comments: userCommentData,
  //         },
  //       ],
  //     },
  //   }

  //   await mail.sendMail(mailData)
  // } catch (error) {
  //   logger.warn({
  //     message: `Failed to send email for return request ${rmaDocument.DocumentId}`,
  //     error,
  //   })
  // }

  return { returnRequestId: rmaDocument.DocumentId }
}
