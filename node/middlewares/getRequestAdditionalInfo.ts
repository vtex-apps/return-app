import { returnRequestService } from '../services/returnRequestService'

export async function getRequestAdditionalInfo(ctx: Context) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { requestId } = params as { requestId: string }

  ctx.set('Cache-Control', 'no-cache')

  const returnRequest = await returnRequestService(ctx, requestId)

  try {
    ctx.body = JSON.parse(
      returnRequest.additionalInfo
        ? (returnRequest.additionalInfo as string)
        : '{}'
    )
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      message: 'Failed to parse additionalInfo field',
    }
  }
}
