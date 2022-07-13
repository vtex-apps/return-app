import { json } from 'co-body'

import { createReturnRequestService } from '../services/createReturnRequestService'

export async function createReturn(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  ctx.body = await createReturnRequestService(ctx, body)
  ctx.status = 204
}
