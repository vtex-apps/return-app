import { ForbiddenError } from '@vtex/api'
import type { MutationUpdateReturnRequestStatusArgs } from 'vtex.return-app'

export const updateReturnRequestStatus = async (
  _: unknown,
  args: MutationUpdateReturnRequestStatusArgs,
  ctx: Context
) => {
  const {
    state: { userProfile },
    clients: { returnRequest: returnRequestClient },
  } = ctx

  const { requestId } = args

  const { role } = userProfile

  const userIsAdmin = role === 'admin'

  if (!userIsAdmin) {
    throw new ForbiddenError('Not authorized')
  }

  const request = await returnRequestClient.get(requestId, [
    'status',
    'refundData',
    'refundStatusData',
  ])

  // placeholder for return value. It should return the updated object
  return request.refundStatusData
}
