import { json } from 'co-body'

import { CommonLogger } from '../utils/commonLogger'
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

  // Log status update request
  CommonLogger.logBusinessOperation(
    ctx,
    'updateAdjustmentStatus',
    {
      adjustmentId,
      newStatus: body.status,
      hasComment: !!body.comment,
    },
    {
      file: 'middlewares/updateAdjustmentStatus.ts',
      function: 'updateAdjustmentStatus',
    }
  )

  const updatedAdjustment = await updateAdjustmentStatusService(ctx, {
    ...body,
    adjustmentId,
  })

  // Log successful status update
  CommonLogger.logBusinessOperation(
    ctx,
    'adjustmentStatusUpdated',
    {
      adjustmentId: updatedAdjustment.id,
      newStatus: updatedAdjustment.status,
    },
    {
      file: 'middlewares/updateAdjustmentStatus.ts',
      function: 'updateAdjustmentStatus',
    }
  )

  ctx.body = updatedAdjustment
}
