import { json } from 'co-body'
import { CommonLogger } from '../utils/commonLogger'
import { updateAdjustmentAdditionalInfoService } from '../services/updateAdjustmentAdditionalInfoService'

export async function updateAdjustmentAdditionalInfo(ctx: Context) {
  const {
    req,
    vtex: {
      route: { params },
    },
  } = ctx

  const { adjustmentId } = params as { adjustmentId: string }
  const body = await json(req)

  // Log additional info update
  CommonLogger.logBusinessOperation(ctx, 'updateAdjustmentAdditionalInfo', {
    adjustmentId,
    hasAdditionalInfo: !!body.additionalInfo,
  }, { 
    file: 'middlewares/updateAdjustmentAdditionalInfo.ts', 
    function: 'updateAdjustmentAdditionalInfo', 
  })

  const updatedAdjustment = await updateAdjustmentAdditionalInfoService(ctx, {
    ...body,
    adjustmentId,
  })

  ctx.body = updatedAdjustment
}
