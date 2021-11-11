export async function returnAppGetSchemas(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { masterData: masterDataClient },
  } = ctx

  const { schema } = ctx.vtex.route.params

  const response = await masterDataClient.getSchema(ctx, schema.toString())

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
