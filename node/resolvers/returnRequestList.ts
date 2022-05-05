import type { QueryReturnRequestListArgs } from 'vtex.return-app'

export const returnRequestList = async (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  const {
    clients: { returnRequest: returnRequestClient },
  } = ctx

  const rmaSearchResult = await returnRequestClient.searchRaw(
    {
      page: args.page,
      pageSize: 25,
    },
    [
      'id',
      'sequenceNumber',
      'createdIn',
      'status',
      'orderId',
      'dateSubmitted',
      'userComment',
    ],
    'createdIn DESC'
  )

  const { data, pagination } = rmaSearchResult
  const { page, pageSize, total } = pagination

  return {
    list: data,
    paging: {
      total,
      perPage: pageSize,
      currentPage: page,
      pages: Math.ceil(total / pageSize),
    },
  }
}
