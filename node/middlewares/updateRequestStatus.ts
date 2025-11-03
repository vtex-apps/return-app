import { json } from 'co-body'

import { CommonLogger } from '../utils/commonLogger'
import { updateRequestStatusService } from '../services/updateRequestStatusService'

export async function updateRequestStatus(ctx: Context) {
  const {
    req,
    vtex: {
      route: { params },
    },
  } = ctx

  const { requestId } = params as { requestId: string }
  const body = await json(req)

  // Log status update request
  CommonLogger.logBusinessOperation(
    ctx,
    'updateReturnRequestStatus',
    {
      requestId,
      newStatus: body.status,
      hasComment: !!body.comment,
      hasRefundData: !!body.refundData,
    },
    {
      file: 'middlewares/updateRequestStatus.ts',
      function: 'updateRequestStatus',
    }
  )

  const updatedRequest = await updateRequestStatusService(ctx, {
    ...body,
    requestId,
  })

  // Log successful status update
  CommonLogger.logBusinessOperation(
    ctx,
    'returnRequestStatusUpdated',
    {
      requestId: updatedRequest.id,
      newStatus: updatedRequest.status,
      refundAmount: updatedRequest.refundableAmount,
    },
    {
      file: 'middlewares/updateRequestStatus.ts',
      function: 'updateRequestStatus',
    }
  )

  ctx.body = updatedRequest
}
