import { ResolverError, ForbiddenError } from '@vtex/api'
import type { ReturnRequest } from 'vtex.return-app'

export const returnRequestService = async (ctx: Context, requestId: string) => {
  const {
    clients: { returnRequest: returnRequestClient, marketplace },
    state: { userProfile, appkey },
  } = ctx

  const { userId, role, email } = userProfile ?? {}

  const isAppRequester = email?.includes('vtexsphinx') ?? false

  const [, , , sellerRequester] =
    email && isAppRequester ? email.split('--') : []

  const [requestIdSeller, targetMarketplace] = requestId.split('::')

  console.log({
    sellerRequester,
    requestId,
    targetMarketplace,
    requestIdSeller,
  })

  const userIsAdmin = Boolean(appkey) || role === 'admin'

  const returnRequestResult = targetMarketplace
    ? await marketplace.getRMADetails(requestIdSeller, targetMarketplace)
    : await returnRequestClient.get(requestId, ['_all'])

  if (!returnRequestResult) {
    // Code error 'E_HTTP_404' to match the one when failing to find and order by OMS
    throw new ResolverError(`Request ${requestId} not found`, 404, 'E_HTTP_404')
  }

  const { customerProfileData, items } = returnRequestResult as ReturnRequest

  const requestBelongsToUser = userId === customerProfileData?.userId

  const requestbelongsToSeller = items.some(
    (item) => item.sellerId === sellerRequester
  )

  console.log({ requestbelongsToSeller })

  if (!requestBelongsToUser && !userIsAdmin && !requestbelongsToSeller) {
    throw new ForbiddenError('User cannot access this request')
  }

  return returnRequestResult
}
