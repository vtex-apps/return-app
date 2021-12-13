import { json } from 'co-body'

export async function createRefund(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const { orderId } = ctx.vtex.route.params
  const body = await json(ctx.req)
  const response = await returnAppClient.createRefund(ctx, orderId, body)

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
