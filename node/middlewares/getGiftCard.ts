export async function getGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params

  const response = await returnAppClient.getGiftCard(ctx, id)

  if (!response) {
    throw new Error(`Error getting gift card with id: ${id}`)
  }

  logger.info({
    message: 'Gift card successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
