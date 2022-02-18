import { createReturnProductFields } from '../utils/createReturnProductFields'
import { createReturnRequestFields } from '../utils/createReturnRequestFields'
import { createStatusHistoryFields } from '../utils/createStatusHistoryFields'

export const createReturnRequest = async (
  _: unknown,
  args: {
    returnRequest: ReturnRequestInput
    returnedItems: ProductReturnedInput[]
    authToken: AuthToken
  },
  ctx: Context
) => {
  const {
    clients: { oms, returnApp, mdFactory },
    vtex: { logger },
  } = ctx

  const { returnRequest, returnedItems } = args
  const { orderId, userId, name } = returnRequest

  const orderPromise = oms.order(orderId, args.authToken)

  const requestsPromise = mdFactory.searchReturnRequests({
    where: `(type=request AND orderId="${orderId}")`,
  })

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, requests will be an empty array.
  const [order, requests] = await Promise.all([orderPromise, requestsPromise])
  const rmaSequenceNumber = `${order.sequence}-${requests.length + 1}`

  const totalPrice = returnedItems.reduce((total, item) => {
    return total + item.quantity * item.unitPrice
  }, 0)

  const rmaRequestFields = createReturnRequestFields({
    returnRequestInput: returnRequest,
    sequenceNumber: rmaSequenceNumber,
    totalPrice,
  })

  const rmaRequest = await mdFactory.createReturnRequest(rmaRequestFields)

  const { DocumentId } = rmaRequest

  // Keep track of all documents created related to this request. If any fails,
  // we need to delete all previously created.
  const documentIdCollection = [DocumentId]

  try {
    const statusHistoryFields = createStatusHistoryFields({
      refundId: DocumentId,
      submittedBy: name,
    })

    const { DocumentId: messageId } = await mdFactory.createStatusHistory(
      statusHistoryFields
    )

    documentIdCollection.push(messageId)

    const nonEmptyItems = returnedItems.filter((item) => item.quantity > 0)

    for (const item of nonEmptyItems) {
      // eslint-disable-next-line no-await-in-loop
      const skuData = await returnApp.getSkuById(ctx, item.sku)

      const productFields = createReturnProductFields({
        item,
        userId,
        orderId,
        refundId: DocumentId,
        totalPrice: item.quantity * item.unitPrice,
        manufacturerCode: skuData.manufacturerCode,
      })

      const { DocumentId: productReturnId } =
        // eslint-disable-next-line no-await-in-loop
        await mdFactory.createReturnProduct(productFields)

      documentIdCollection.push(productReturnId)
    }

    await returnApp.sendMail(ctx, {
      TemplateName: 'oms-return-request',
      applicationName: 'email',
      logEvidence: false,
      jsonData: {
        data: { ...rmaRequestFields, DocumentId },
        products: returnedItems.map((item) => ({
          name: item.skuName,
          selectedQuantity: item.quantity,
          sellingPrice: item.unitPrice,
        })),
      },
    })
  } catch (e) {
    logger.error({
      message: `Error creating return request ${DocumentId} for order id ${orderId}`,
      error: e,
      data: {
        returnRequest,
        returnedItems,
      },
    })

    // if something fails, we delete all documents related to that request.
    // This way, we try to make the operation atomic.
    for (const id of documentIdCollection) {
      // eslint-disable-next-line no-await-in-loop
      await mdFactory.deleteRMADocument(id)
    }

    throw new Error(e)
  }

  return { returnRequestId: DocumentId }
}
