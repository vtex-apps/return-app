export async function getOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const { orderId } = ctx.vtex.route.params

  const response = await returnAppClient.getOrder(ctx, orderId)

  ctx.status = 200
  ctx.body = response

  await next()
}
