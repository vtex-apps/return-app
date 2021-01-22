export async function returnAppGetSchemas(ctx: Context, next: () => Promise<any>) {

  const {
    clients: { returnApp: returnAppClient }
  } = ctx

  const response = await returnAppClient.getSchema(ctx)

  ctx.status = 200
  ctx.body = response

  await next()
}
