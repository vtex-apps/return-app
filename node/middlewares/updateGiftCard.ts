import { json } from 'co-body'

export async function updateGiftCard(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
  } = ctx

  const { id } = ctx.vtex.route.params
  const body = await json(ctx.req)

  const response = await returnAppClient.updateGiftCard(ctx, id, body)

  if (!response) {
    throw new Error(`Error updating giftcard with id ${id}`)
  }

  logger.info({
    message: `Update gift card successfully`,
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
