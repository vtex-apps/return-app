import { json } from 'co-body'

export async function createGiftCard(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
  } = ctx

  const response = await returnAppClient.createGiftCard(ctx, body)

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
