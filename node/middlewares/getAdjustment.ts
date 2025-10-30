import { adjustmentNoteService } from '../services/adjustmentNoteService'

export async function getAdjustment(ctx: Context) {
  const { adjustmentId } = ctx.vtex.route.params as { adjustmentId: string }

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await adjustmentNoteService(ctx, adjustmentId)
}
