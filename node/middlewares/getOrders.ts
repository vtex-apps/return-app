export async function getOrders(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { where } = ctx.vtex.route.params

  try {
    const response = await returnAppClient.getOrders(ctx, where)

    logger.info({
      message: 'Get orders successfully',
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error fetching orders`,
      error: e,
      data: {
        ctx,
        where,
      },
    })
  }

  await next()
}
