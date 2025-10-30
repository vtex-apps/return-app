import { json } from 'co-body'

import { updateAdjustmentStatusService } from '../services/updateAdjustmentStatusService'

export async function updateAdjustmentStatus(ctx: Context) {
  const {
    req,
    vtex: {
      route: { params },
    },
  } = ctx

  const { adjustmentId } = params as { adjustmentId: string }

  const body = await json(req)

  const updatedAdjustment = await updateAdjustmentStatusService(ctx, {
    ...body,
    adjustmentId,
  })

  ctx.body = updatedAdjustment
}
