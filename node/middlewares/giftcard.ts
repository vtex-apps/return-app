import { json } from 'co-body'

import { createGiftcardService } from '../services/createGiftcardService'

export async function createGiftcard(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await createGiftcardService(ctx, body)
}
