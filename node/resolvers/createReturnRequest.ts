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
    clients: { oms, masterdata, returnApp },
    vtex: { logger },
  } = ctx

  const { returnRequest, returnedItems } = args
  const { orderId, userId, name } = returnRequest

  const orderPromise = oms.order(orderId, args.authToken)

  const requestsPromise = masterdata.searchDocuments<ReturnRequest>({
    dataEntity: 'ReturnApp',
    schema: 'returnRequests',
    where: `(type=request AND orderId="${orderId}")`,
    fields: ['id'],
    pagination: {
      page: 1,
      pageSize: 100,
    },
  })

  // If order doesn't exist, it throws an error and stop the process.
  // If there is no request created for that order, requests will be an empty array.
  const [order, requests] = await Promise.all([orderPromise, requestsPromise])
  const rmaSequenceNumber = `${order.sequence}-${requests.length + 1}`

  const totalPrice = returnedItems.reduce((total, item) => {
    return total + item.quantity * item.unitPrice
  }, 0)

  const rmaRequestFields = {
    ...returnRequest,
    type: 'request',
    sequenceNumber: rmaSequenceNumber,
    dateSubmitted: new Date().toISOString(),
    totalPrice,
    status: 'New',
  }

  const rmaRequest = await masterdata.createDocument({
    dataEntity: 'ReturnApp',
    schema: 'returnRequests',
    fields: rmaRequestFields,
  })

  const { DocumentId } = rmaRequest

  // Keep track of all documents created related to this request. If any fails,
  // we need to delete all previously created.
  const documentIdCollection = [DocumentId]

  try {
    const { DocumentId: messageId } = await masterdata.createDocument({
      dataEntity: 'ReturnApp',
      schema: 'returnStatusHistory',
      fields: {
        submittedBy: name,
        refundId: DocumentId,
        status: 'New',
        dateSubmitted: new Date().toISOString(),
        type: 'statusHistory',
      },
    })

    documentIdCollection.push(messageId)

    const nonEmptyItems = returnedItems.filter((item) => item.quantity > 0)

    for (const item of nonEmptyItems) {
      // eslint-disable-next-line no-await-in-loop
      const skuData = await returnApp.getSkuById(ctx, item.sku)
      const poductData = {
        ...item,
        userId,
        orderId,
        refundId: DocumentId,
        status: 'New',
        manufacturerCode: skuData.manufacturerCode ?? '',
        totalPrice: item.quantity * item.unitPrice,
        dateSubmitted: new Date().toISOString(),
        type: 'product',
      }

      // eslint-disable-next-line no-await-in-loop
      const { DocumentId: productReturnId } = await masterdata.createDocument({
        dataEntity: 'ReturnApp',
        schema: 'returnProducts',
        fields: poductData,
      })

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

    const deletedDocumentPromises = documentIdCollection.map((id) =>
      masterdata.deleteDocument({ id, dataEntity: 'ReturnApp' })
    )

    await Promise.all(deletedDocumentPromises)

    throw new Error(e)
  }

  return true
}
