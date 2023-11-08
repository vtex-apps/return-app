export const returnOrdersListService = async (ctx: Context, body: any) => {
  const {
    clients: { returnRequest: returnRequestClient },
  } = ctx

  const returnRequestSameOrder = await returnRequestClient.searchRaw(
    { page: 1, pageSize: 100 },
    body?.fields,
    undefined,
    body?.filter
  )

  return returnRequestSameOrder
}
