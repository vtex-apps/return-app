export async function receiveCategories(
  ctx: Context,
  next: () => Promise<any>
) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const response = await returnAppClient.getCategories(ctx)

  ctx.status = 200
  ctx.body = response

  await next()
}
