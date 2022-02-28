export async function getOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { orderId } = ctx.vtex.route.params

  try {
    const response = await returnAppClient.getOrder(ctx, orderId)

    logger.info({
      message: 'Get order successfully',
      data: response,
    })

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error fetching order: ${orderId}`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
