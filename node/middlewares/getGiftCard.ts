export async function getGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params

  try {
    const response = await returnAppClient.getGiftCard(ctx, id)

    logger.info({
      message: 'Gift card successfully',
      data: response,
    })

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error fetching gift card`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
