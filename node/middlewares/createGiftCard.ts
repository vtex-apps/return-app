import { json } from 'co-body'

export async function createGiftCard(ctx: Context, next: () => Promise<any>) {
  const body = await json(ctx.req)
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  try {
    const response = await returnAppClient.createGiftCard(ctx, body)

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response

    await next()
  } catch (e) {
    logger.error({
      message: `Error creating creating gift card`,
      error: e,
      data: {
        body,
      },
    })
  }
}
