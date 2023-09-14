import { returnRequestService } from '../services/returnRequestService'

export async function getRequest(ctx: Context) {
  const { requestId } = ctx.vtex.route.params as { requestId: string }

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await returnRequestService(ctx, requestId)
}
