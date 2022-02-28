export async function receiveCategories(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  try {
    const response = await returnAppClient.getCategories(ctx)

    logger.info({
      message: 'Received categories successfully',
      data: response,
    })

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error receiving categories`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
