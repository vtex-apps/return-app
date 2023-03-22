import { storeUserGuard } from '../utils/storeUserGuard'

export async function getOrder(ctx: Context, next: () => Promise<any>) {
  const {
    clients: { returnApp: returnAppClient },
    vtex: { logger },
    state: { userProfile },
  } = ctx

  const { orderId } = ctx.vtex.route.params

  const response = await returnAppClient.getOrder(ctx, orderId)

  if (!response) {
    throw new Error(`Error getting order`)
  }

  if (userProfile?.role === 'store-user') {
    storeUserGuard('singleOrder', {
      source: response.clientProfileData.userProfileId,
      identifier: userProfile.userId,
    })
  }

  logger.info({
    message: 'Get order successfully',
    data: response,
  })

  ctx.status = 200
  ctx.body = response

  await next()
}
