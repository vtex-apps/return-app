import { CommonLogger } from '../utils/commonLogger'
import { adjustmentNoteService } from '../services/adjustmentNoteService'

export async function getAdjustment(ctx: Context) {
  const { adjustmentId } = ctx.vtex.route.params as { adjustmentId: string }

  // Log adjustment retrieval
  CommonLogger.logApiOperation(ctx, 'getAdjustment', {
    adjustmentId,
  }, { 
    file: 'middlewares/getAdjustment.ts', 
    function: 'getAdjustment', 
  })

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await adjustmentNoteService(ctx, adjustmentId)
}
