export async function returnAppGetSchemas(ctx: Context, next: () => Promise<any>) {

  const {
    clients: { returnApp: returnAppClient }
  } = ctx

  const { schemaEntity, schemaName } = ctx.vtex.route.params
  const response = await returnAppClient.getSchema(schemaEntity, schemaName)

  ctx.status = 200
  ctx.body = response

  await next()
}
