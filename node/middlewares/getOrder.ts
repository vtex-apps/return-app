export async function getOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { orderId } = ctx.vtex.route.params

  const response = await returnAppClient.getOrder(ctx, orderId)

  if (!response) {
    throw new Error(`Error getting order`)
  }

  logger.info({
    message: 'Get order successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
