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
    clients: { oms, masterdata },
  } = ctx

  const { returnRequest, returnedItems } = args
  const { orderId } = returnRequest

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

  const rmaRequest = await masterdata.createDocument({
    dataEntity: 'ReturnApp',
    schema: 'returnRequests',
    fields: {
      ...returnRequest,
      type: 'request',
      sequenceNumber: rmaSequenceNumber,
      dateSubmitted: new Date().toISOString(),
    },
  })

  const { DocumentId } = rmaRequest

  console.log('@@@@@@', DocumentId)

  return true
}
