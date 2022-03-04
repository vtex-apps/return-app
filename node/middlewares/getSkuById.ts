export async function getSkuById(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params

  const response = await returnAppClient.getSkuById(ctx, id)

  if (!response) {
    throw new Error(`Error getting SkuById for id: ${id}`)
  }

  logger.info({
    message: 'Get SKU by id successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
