import { ResolverError, ForbiddenError } from '@vtex/api'
import type { ReturnRequest } from '../../typings/ReturnRequest'

export const returnRequestService = async (ctx: Context, requestId: string) => {
  const {
    clients: { returnRequest: returnRequestClient },
    state: { userProfile, appkey },
  } = ctx

  const { userId, role } = userProfile ?? {}
  const userIsAdmin = Boolean(appkey) || role === 'admin'

  const returnRequestResult = await returnRequestClient.get(requestId, ['_all'])

  if (!returnRequestResult) {
    // Code error 'E_HTTP_404' to match the one when failing to find and order by OMS
    throw new ResolverError(`Request ${requestId} not found`, 404, 'E_HTTP_404')
  }

  const { customerProfileData } = returnRequestResult as ReturnRequest

  const requestBelongsToUser = userId === customerProfileData?.userId

  if (!requestBelongsToUser && !userIsAdmin) {
    throw new ForbiddenError('User cannot access this request')
  }

  return returnRequestResult
}
