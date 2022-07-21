import type { QueryReturnRequestListArgs } from 'vtex.return-app'

import { returnRequestListService } from '../services/returnRequestListService'

export const returnRequestList = (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  return returnRequestListService(ctx, args)
}
