/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable camelcase */
import {
  formatComment,
  formatHistory,
  formatProduct,
  formatRequest,
} from '../../utils/utils'

export async function getRequest(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const { request_id } = ctx.vtex.route.params

  const requestResponse = await masterDataClient.getDocuments(
    ctx,
    'returnRequests',
    'request',
    `id=${request_id}`
  )

  if (!requestResponse) {
    throw new Error(`Error getting request`)
  }

  let output = {
    success: false,
    errorMessage: 'Not Found',
    data: {},
  }

  if (requestResponse.length) {
    const [request] = requestResponse
    // Request Products
    const productsResponse = await masterDataClient.getDocuments(
      ctx,
      'returnProducts',
      'product',
      `refundId=${request_id}`
    )

    if (!productsResponse) {
      throw new Error(`Error getting products request`)
    }

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
      `refundId=${request_id}`
    )

    if (!statusHistoryResponse) {
      throw new Error(`Error getting status history request`)
    }

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
      `refundId=${request_id}`
    )

    if (!commentsResponse) {
      throw new Error(`Error getting comments response`)
    }

    const comments: any[] = []

    if (commentsResponse.length) {
      commentsResponse.forEach((comment: any) => {
        comments.push(formatComment(comment))
      })
    }

    const requestOutput = {
      ...formatRequest(request),
      products,
      statusHistory,
      comments,
    }

    output = {
      ...output,
      success: true,
      errorMessage: '',
      data: requestOutput,
    }
  }

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = output

  await next()
}
