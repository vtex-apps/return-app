/* eslint-disable no-restricted-globals */
import {
  formatComment,
  formatHistory,
  formatProduct,
  formatRequest,
} from '../../utils/utils'

export async function getList(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const { page, limit, status, dateStart, dateEnd } = ctx.query

  const filterData = {
    page:
      page && !isNaN(parseInt(page as string, 10))
        ? parseInt(page as string, 10)
        : 1,
    limit:
      limit && !isNaN(parseInt(limit as string, 10))
        ? parseInt(limit as string, 10)
        : 10,
    status: status || '',
    dateStart: dateStart || '',
    dateEnd: dateEnd || '',
  }

  const requestResponse = await masterDataClient.getList(
    ctx,
    'returnRequests',
    'request',
    filterData
  )

  const output: any[] = []

  if (requestResponse.length) {
    await Promise.all(
      requestResponse.map(async (request: any) => {
        const productsResponse = await masterDataClient.getDocuments(
          ctx,
          'returnProducts',
          'product',
          `refundId=${request.id}`
        )

        const products: any[] = []

        if (productsResponse.length) {
          productsResponse.forEach((product: any) => {
            products.push(formatProduct(product))
          })
        }

        // Request status history
        const statusHistoryResponse = await masterDataClient.getDocuments(
          ctx,
          'returnStatusHistory',
          'statusHistory',
          `refundId=${request.id}`
        )

        const statusHistory: any[] = []

        if (statusHistoryResponse.length) {
          statusHistoryResponse.forEach((history: any) => {
            statusHistory.push(formatHistory(history))
          })
        }

        // Request Comments
        const commentsResponse = await masterDataClient.getDocuments(
          ctx,
          'returnComments',
          'comment',
          `refundId=${request.id}`
        )

        const comments: any[] = []

        if (commentsResponse.length) {
          commentsResponse.forEach((comment: any) => {
            comments.push(formatComment(comment))
          })
        }

        const currentRequest = {
          ...formatRequest(request),
          products,
          statusHistory,
          comments,
        }

        output.push(currentRequest)
      })
    )
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = output.sort((a, b) => (a.dateSubmitted < b.dateSubmitted ? 1 : -1))

  await next()
}
