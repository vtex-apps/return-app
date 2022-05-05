import { ForbiddenError, ResolverError } from '@vtex/api'
import type { QueryReturnRequestArgs, ReturnRequest } from 'vtex.return-app'

export const returnRequest = async (
  _: unknown,
  { requestId }: QueryReturnRequestArgs,
  ctx: Context
) => {
  const {
    clients: { returnRequest: returnRequestClient },
    state: { userProfile },
  } = ctx

  const { userId, role } = userProfile
  const userIsAdmin = role === 'admin'

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
