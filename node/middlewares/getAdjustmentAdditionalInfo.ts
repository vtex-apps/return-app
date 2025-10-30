import { CommonLogger } from '../utils/commonLogger'
import { adjustmentNoteService } from '../services/adjustmentNoteService'

export async function getAdjustmentAdditionalInfo(ctx: Context) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { adjustmentId } = params as { adjustmentId: string }

  // Log additional info retrieval
  CommonLogger.logApiOperation(ctx, 'getAdjustmentAdditionalInfo', {
    adjustmentId
  }, { 
    file: 'middlewares/getAdjustmentAdditionalInfo.ts', 
    function: 'getAdjustmentAdditionalInfo' 
  })

  ctx.set('Cache-Control', 'no-cache')

  const adjustmentNote = await adjustmentNoteService(ctx, adjustmentId)

  try {
    ctx.body = JSON.parse(
      adjustmentNote.additionalInfo
        ? (adjustmentNote.additionalInfo as string)
        : '{}'
    )
  } catch (error) {
    // Log parsing error
    CommonLogger.logError(ctx, error as Error, 'parseAdditionalInfo', {
      adjustmentId,
      rawAdditionalInfo: adjustmentNote.additionalInfo
    }, { 
      file: 'middlewares/getAdjustmentAdditionalInfo.ts', 
      function: 'getAdjustmentAdditionalInfo' 
    })

    ctx.status = 500
    ctx.body = {
      message: 'Failed to parse additionalInfo field',
    }
  }
}
