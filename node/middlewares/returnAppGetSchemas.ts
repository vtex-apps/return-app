export async function returnAppGetSchemas(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schema } = ctx.vtex.route.params

  try {
    const response = await masterDataClient.getSchema(ctx, schema.toString())

    logger.info({
      message: `Get schema ${schema} successfully`,
      data: response,
    })

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error getting schema: ${schema}`,
      error: e,
      data: {
        ctx,
      },
    })
  }

  await next()
}
