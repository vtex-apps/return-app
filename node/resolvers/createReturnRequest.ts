import { UserInputError } from '@vtex/api'
import type { MutationCreateReturnRequestArgs } from 'vtex.return-app'

export const createReturnRequest = async (
  _: unknown,
  args: MutationCreateReturnRequestArgs,
  ctx: Context
) => {
  const {
    clients: { oms, returnRequest: returnRequestClient },
    state: { userProfile },
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

  const orderPromise = oms.order(orderId, 'AUTH_TOKEN')

  const searchRMAPromise = returnRequestClient.searchRaw(
    { page: 1, pageSize: 1 },
    ['id'],
    undefined,
    `orderId=${orderId}`
  )

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, requests will be an empty array.
  const [order, searchRMA] = await Promise.all([orderPromise, searchRMAPromise])

  // TODO: VALIDATE ORDER. Is the user allowed to place the order? Is the order invoiced? Is the order within the max days?
  // TODO: VALIDATE ITEMS. Are the items available to be returned?
  // TODO: VALIDATE REASONS and Max days. Are the items avaible to be returned?
  // TODO: VALIDATE configutarion on settings - payment methods allowed (also bank should have iban and accountHolder name), other reasons or custom reasons

  const {
    pagination: { total },
  } = searchRMA

  const {
    sequence,
    clientProfileData: { userProfileId },
  } = order

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
  // Possible alternative: Save a key value pair in to VBase where key is the orderId and value is either the latest sequence (as number) or an array with all Ids, so we can use the length to calcualate the next seuqence number.
  const sequenceNumber = `${sequence}-${total + 1}`

  const rmaDocument = await returnRequestClient.save({
    orderId,
    totalReturnAmount: 1234,
    sequenceNumber,
    status: 'new',
    returnTotals: [{ id: 'items', value: 1234 }],
    customerProfileData: {
      userId: userProfileId,
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
    items: items.map((item) => {
      return {
        ...item,
        verifiedItems: item.verifiedItems ?? null,
      }
    }),
    dateSubmitted: requestDate,
    refundData: null,
    userComment,
    refundStatusData: [
      {
        status: 'new',
        submittedBy,
        dateSubmitted: requestDate,
      },
    ],
  })

  // TODO: Send confirmation email.

  return { returnRequestId: rmaDocument.DocumentId }
}
