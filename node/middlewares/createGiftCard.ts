import { json } from 'co-body'

export async function createGiftCard(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const response = await returnAppClient.createGiftCard(ctx, body)

  if (!response) {
    throw new Error(`Error creating gift card`)
  }

  logger.info({
    message: 'Created giftcard successfully',
    data: response,
  })

  ctx.status = 200
  ctx.set('Cache-Control', 'no-cache')
  ctx.body = response

  await next()
}
