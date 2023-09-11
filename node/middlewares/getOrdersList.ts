import { returnOrdersListService } from '../services/returnOrdersListService'

export async function getOrdersList(ctx: Context) {
  const { body } = ctx

  ctx.set('Cache-Control', 'no-cache')

  return (ctx.body = await returnOrdersListService(ctx, body))
}
