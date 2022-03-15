export async function generateReturnsSchema(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const response = await masterDataClient.generateSchema(ctx)

  if (!response) {
    throw new Error(`Error generating schema`)
  }

  logger.info({
    message: 'Schema generated successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
