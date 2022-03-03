import { statusToError } from '../utils/statusToError'

export async function getOrder(ctx: Context) {
  const {
    clients: { returnApp: returnAppClient },
    state,
  } = ctx

  const { orderId } = ctx.vtex.route.params

  const response = await returnAppClient.getOrder(ctx, orderId)

  const { userId } = state
  const { userProfileId } = response.clientProfileData

  const hasAllIDs = userId && userProfileId

  if (!hasAllIDs && userId !== userProfileId) {
    throw statusToError({
      status: 401,
      message: 'unauthorized',
    })
  }

  ctx.status = 200
  ctx.body = response
}
