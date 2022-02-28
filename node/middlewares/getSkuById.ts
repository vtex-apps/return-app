export async function getSkuById(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params

  try {
    const response = await returnAppClient.getSkuById(ctx, id)

    logger.info({
      message: 'Get SKU by id successfully',
      data: response,
    })

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error getting SKU by id: ${id}`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
