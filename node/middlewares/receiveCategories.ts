export async function receiveCategories(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const response = await returnAppClient.getCategories(ctx)

  if (!response) {
    throw new Error(`Error receiving categories`)
  }

  logger.info({
    message: 'Received categories successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
