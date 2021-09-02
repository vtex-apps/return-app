export async function getSkuById(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const { id } = ctx.vtex.route.params
  const response = await returnAppClient.getSkuById(ctx, id)

  ctx.status = 200
  ctx.body = response

  await next()
}
