import { statusToError } from '../utils/statusToError'

export async function getOrder(ctx: Context) {
  const {
    clients: { returnApp: returnAppClient },
    state,
    vtex: { logger },
  } = ctx

  const { orderId } = ctx.vtex.route.params

  const response = await returnAppClient.getOrder(ctx, orderId)

  const { userId, isAdmin } = state

  if (isAdmin) {
    /**
     * here we can use the adminUserAuthToken, so we can get the data from the admin account.
     */

    ctx.status = 200
    ctx.set('Cache-Control', 'no-cache')
    ctx.body = response
    return
  }

  if (!response) {
    throw new Error(`Error getting order`)
  }

  const { userProfileId } = response.clientProfileData

  if (userId !== userProfileId) {
    throw statusToError({
      status: 401,
      message: 'unauthorized',
    })
  }

  logger.info({
    message: 'Get order successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response
}
