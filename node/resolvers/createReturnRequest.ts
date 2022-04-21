// import { createReturnProductFields } from '../utils/createReturnProductFields'
// import { createReturnRequestFields } from '../utils/createReturnRequestFields'
// import { createStatusHistoryFields } from '../utils/createStatusHistoryFields'
import { UserInputError } from '@vtex/api'
import type { MutationCreateReturnRequestArgs } from 'vtex.return-app'

export const createReturnRequest = async (
  _: unknown,
  args: MutationCreateReturnRequestArgs,
  ctx: Context
) => {
  const {
    clients: {
      oms,
      /** returnApp, mdFactory, */ returnRequest: returnRequestClient,
    },
    // vtex: { logger },
    state: { userProfile },
  } = ctx

  const { returnRequest } = args
  const { orderId, items, customerProfileData } = returnRequest
  const { firstName, lastName, email } = userProfile

  const requestDate = new Date().toISOString()
  const submittedBy =
    firstName || firstName ? `${firstName} ${lastName}` : email

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
  // TODO: VALIDATE configutarion on settings - payment methods allowed, other reasons or custom reasons

  const {
    pagination: { total },
  } = searchRMA

  const {
    sequence,
    clientProfileData: { userProfileId },
  } = order

  // Possible bug here: If someone deletes a request, it can lead to a duplicated sequence number.
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
    pickupReturnData: {
      addressId: '123',
      address: 'Rua Teste',
      city: 'São Paulo',
      state: 'SP',
      country: 'BRA',
      zipCode: '12345678',
      addressType: 'pickup-point',
    },
    refundPaymentData: {
      refundPaymentMethod: 'bank',
      iban: '123456789',
      accountHolderName: 'John Doe',
    },
    items: items.map((item) => {
      return {
        ...item,
        verifiedItems: item.verifiedItems ?? null,
      }
    }),
    dateSubmitted: requestDate,
    refundData: null,
    userComment: 'This is a test',
    refundStatusData: [
      {
        status: 'new',
        submittedBy,
        dateSubmitted: requestDate,
      },
    ],
  })

  // TODO: Send confirmation email.

  // const totalPrice = returnedItems.reduce((totalValue, item) => {
  //   return totalValue + item.quantity * item.unitPrice
  // }, 0)

  // const rmaRequestFields = createReturnRequestFields({
  //   returnRequestInput: returnRequest,
  //   sequenceNumber: rmaSequenceNumber,
  //   totalPrice,
  // })

  // const rmaRequest = await mdFactory.createReturnRequest(rmaRequestFields)

  // const { DocumentId } = rmaRequest

  // // Keep track of all documents created related to this request. If any fails,
  // // we need to delete all previously created.
  // const documentIdCollection = [DocumentId]

  // try {
  //   const statusHistoryFields = createStatusHistoryFields({
  //     refundId: DocumentId,
  //     submittedBy: name,
  //   })

  //   const { DocumentId: messageId } = await mdFactory.createStatusHistory(
  //     statusHistoryFields
  //   )

  //   documentIdCollection.push(messageId)

  //   const nonEmptyItems = returnedItems.filter((item) => item.quantity > 0)

  //   for (const item of nonEmptyItems) {
  //     // eslint-disable-next-line no-await-in-loop
  //     const skuData = await returnApp.getSkuById(ctx, item.sku)

  //     const productFields = createReturnProductFields({
  //       item,
  //       userId,
  //       orderId,
  //       refundId: DocumentId,
  //       totalPrice: item.quantity * item.unitPrice,
  //       manufacturerCode: skuData.manufacturerCode,
  //     })

  //     const { DocumentId: productReturnId } =
  //       // eslint-disable-next-line no-await-in-loop
  //       await mdFactory.createReturnProduct(productFields)

  //     documentIdCollection.push(productReturnId)
  //   }

  //   await returnApp.sendMail(ctx, {
  //     TemplateName: 'oms-return-request',
  //     applicationName: 'email',
  //     logEvidence: false,
  //     jsonData: {
  //       data: { ...rmaRequestFields, DocumentId },
  //       products: returnedItems.map((item) => ({
  //         name: item.skuName,
  //         selectedQuantity: item.quantity,
  //         sellingPrice: item.unitPrice,
  //       })),
  //     },
  //   })
  // } catch (e) {
  //   logger.error({
  //     message: `Error creating return request ${DocumentId} for order id ${orderId}`,
  //     error: e,
  //     data: {
  //       returnRequest,
  //       returnedItems,
  //     },
  //   })

  //   // if something fails, we delete all documents related to that request.
  //   // This way, we try to make the operation atomic.
  //   for (const id of documentIdCollection) {
  //     // eslint-disable-next-line no-await-in-loop
  //     await mdFactory.deleteRMADocument(id)
  //   }

  //   throw new Error(e)
  // }

  // eslint-disable-next-line no-console
  console.log('@@@@@@@@', rmaDocument.DocumentId, requestDate)

  return { returnRequestId: rmaDocument.DocumentId }
}
