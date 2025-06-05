import { json } from 'co-body'

import { updateRequestAdditionalInfoService } from '../services/updateRequestAdditionalInfoService'

export async function updateRequestAdditionalInfo(ctx: Context) {
  const {
    req,
    vtex: {
      route: { params },
    },
  } = ctx

  const { requestId } = params as { requestId: string }

  const body = await json(req)

  const updatedRequest = await updateRequestAdditionalInfoService(ctx, {
    ...body,
    requestId,
  })

  ctx.body = updatedRequest
}
