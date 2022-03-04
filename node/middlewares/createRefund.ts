import { json } from 'co-body'

export async function createRefund(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { orderId } = ctx.vtex.route.params
  const body = await json(ctx.req)

  const response = await returnAppClient.createRefund(ctx, orderId, body)

  if (!response) {
    throw new Error(`Error creating refund for id: ${orderId}`)
  }

  logger.info({
    message: `Created refund successfully for orderId ${orderId}`,
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
