import { json } from 'co-body'

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
  const updatedRequest = await updateRequestStatusService(ctx, {
    ...body,
    requestId,
  })

  ctx.set('Cache-Control', 'no-cache')
  ctx.body = updatedRequest
  ctx.status = 200
}
