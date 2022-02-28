import { json } from 'co-body'

export async function updateGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params
  const body = await json(ctx.req)

  try {
    const response = await returnAppClient.updateGiftCard(ctx, id, body)

    logger.info({
      message: `Update gift card successfully`,
      data: response,
    })

    ctx.status = 200
    ctx.body = response
  } catch (e) {
    logger.error({
      message: `Error updating gift card with id: ${id}`,
      error: e,
      data: {
        ctx,
        body,
      },
    })
  }

  await next()
}
