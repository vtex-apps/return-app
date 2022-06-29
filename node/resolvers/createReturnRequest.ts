import { UserInputError, ResolverError } from '@vtex/api'
import type { MutationCreateReturnRequestArgs } from 'vtex.return-app'

import { OMS_RETURN_REQUEST, SETTINGS_PATH } from '../utils/constants'
import { createItemsToReturn } from '../utils/createItemsToReturn'
import { createRefundableTotals } from '../utils/createRefundableTotals'
import { isUserAllowed } from '../utils/isUserAllowed'
import { canOrderBeReturned } from '../utils/canOrderBeReturned'
import { canReturnAllItems } from '../utils/canReturnAllItems'
import { validateReturnReason } from '../utils/validateReturnReason'
import { validatePaymentMethod } from '../utils/validatePaymentMethod'
import { OMS_RETURN_REQUEST_TEMPLATE } from '../utils/templates'

export const createReturnRequest = async (
  _: unknown,
  args: MutationCreateReturnRequestArgs,
  ctx: Context
) => {
  const {
    clients: { oms, returnRequest: returnRequestClient, appSettings, mail },
    state: { userProfile },
    vtex: { logger },
  } = ctx

  const { returnRequest } = args
  const {
    orderId,
    items,
    customerProfileData,
    pickupReturnData,
    refundPaymentData,
    userComment,
  } = returnRequest

  const { firstName, lastName, email } = userProfile

  const requestDate = new Date().toISOString()
  const submittedBy = firstName || lastName ? `${firstName} ${lastName}` : email

  // Graphql validation doesn't prevent user to send empty items
  if (items.length === 0) {
    throw new UserInputError('There is no items in the request')
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
  } = order

  const { maxDays, excludedCategories, customReturnReasons, paymentOptions } =
    settings

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
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
  })

  // Validate maxDays for custom reasons.
  validateReturnReason(items, creationDate, customReturnReasons)

  // Validate payment methods
  validatePaymentMethod(refundPaymentData, paymentOptions)

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
  // Possible alternative: Save a key value pair in to VBase where key is the orderId and value is either the latest sequence (as number) or an array with all Ids, so we can use the length to calcualate the next seuqence number.
  const sequenceNumber = `${sequence}-${total + 1}`

  const itemsToReturn = createItemsToReturn({
    itemsToReturn: items,
    orderItems,
    sellers,
    itemMetadata,
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

  const rmaDocument = await returnRequestClient.save({
    orderId,
    refundableAmount,
    sequenceNumber,
    status: 'new',
    refundableAmountTotals,
    customerProfileData: {
      userId: clientProfileData.userProfileId,
      name: customerProfileData.name,
      /**
       * Why using email from args and not for userProfile (session)?
       * When submitting a request via GraphQL IDE (or postman), there is no profile from session.
       * It would use the admin email, instead of the user one.
       * Also, we cannot use the email in the order because it might be masked.
       * However, email is an optional field in the mutation input, so it's ok the front end doesn't send it.
       */
      email: customerProfileData.email ?? email,
      phoneNumber: customerProfileData.phoneNumber,
    },
    pickupReturnData,
    refundPaymentData,
    items: itemsToReturn,
    dateSubmitted: requestDate,
    refundData: null,
    userComment,
    refundStatusData: [
      {
        status: 'new',
        submittedBy,
        createdAt: requestDate,
        comments: [],
      },
    ],
  })

  // We add a try/catch here so we avoid sending an error to the browser if only the email fails.
  try {
    const templateExists = await mail.getTemplate(OMS_RETURN_REQUEST)

    if (!templateExists) {
      const template = OMS_RETURN_REQUEST_TEMPLATE

      await mail.publishTemplate(template)
    }

    const {
      firstName: clientFirstName,
      lastName: clientLastName,
      document,
      phone,
    } = clientProfileData

    const {
      address: { country, city, street },
    } = shippingData

    const mailData: MailData = {
      templateName: OMS_RETURN_REQUEST,
      jsonData: {
        data: {
          status: 'New',
          name: `${clientFirstName} ${clientLastName}`,
          DocumentId: document,
          email,
          phoneNumber: phone,
          country,
          locality: city,
          address: street,
          paymentMethod: refundPaymentData.refundPaymentMethod,
        },
        products: [...itemsToReturn],
        timeline: [],
      },
    }

    await mail.sendMail(mailData)
  } catch (error) {
    logger.warn({
      message: `Failed to send email for return request ${rmaDocument.DocumentId}`,
    })
  }

  return { returnRequestId: rmaDocument.DocumentId }
}
