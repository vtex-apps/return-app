export async function generateReturnsSchema(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  try {
    const response = await masterDataClient.generateSchema(ctx)

    logger.info({
      message: 'Schema generated successfully',
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error generating schema`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
