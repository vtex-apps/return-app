import type { QueryReturnRequestArgs } from 'obidev.obi-return-app'

import { returnRequestService } from '../services/returnRequestService'

export const returnRequest = async (
  _: unknown,
  { requestId }: QueryReturnRequestArgs,
  ctx: Context
) => {
  return returnRequestService(ctx, requestId)
}
