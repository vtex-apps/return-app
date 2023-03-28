import { returnOrdersListService } from '../services/returnOrdersListService'
import { json } from 'co-body'

export async function getOrdersList(ctx: Context) {
  const { req } = ctx

  const body = await json(req)
  ctx.set('Cache-Control', 'no-cache')
  
  ctx.body = await returnOrdersListService(ctx, body)

  
}

