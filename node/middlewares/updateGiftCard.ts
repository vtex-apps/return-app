import { json } from 'co-body'

export async function updateGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const { id } = ctx.vtex.route.params
  const body = await json(ctx.req)
  const response = await returnAppClient.updateGiftCard(ctx, id, body)

  ctx.status = 200
  ctx.body = response

  await next()
}
