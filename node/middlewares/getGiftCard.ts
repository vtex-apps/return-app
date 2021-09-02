export async function getGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const { id } = ctx.vtex.route.params
  const response = await returnAppClient.getGiftCard(ctx, id)

  ctx.status = 200
  ctx.body = response

  await next()
}
