import { createGiftcardService } from '../services/createGiftcardService'
import { json } from 'co-body'

export async function createGiftcard(ctx: Context) {
  const { req } = ctx

  const body = await json(req)
  ctx.set('Cache-Control', 'no-cache')
  
  ctx.body = await createGiftcardService(ctx, body)

  
}

