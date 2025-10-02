import { json } from 'co-body'

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

  const updatedAdjustment = await updateAdjustmentAdditionalInfoService(ctx, {
    ...body,
    adjustmentId,
  })

  ctx.body = updatedAdjustment
}
