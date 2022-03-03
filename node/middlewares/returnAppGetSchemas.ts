export async function returnAppGetSchemas(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
    vtex: { logger },
  } = ctx

  const { schema } = ctx.vtex.route.params

  const response = await masterDataClient.getSchema(ctx, schema.toString())

  if (!response) {
    throw new Error(`Error getting schema: ${schema}`)
  }

  logger.info({
    message: `Get schema ${schema} successfully`,
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
