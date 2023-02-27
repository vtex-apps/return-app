import type { QueryReturnRequestListArgs } from 'obidev.obi-return-app'

import { returnRequestListService } from '../services/returnRequestListService'

export const returnRequestList = (
  _: unknown,
  args: QueryReturnRequestListArgs,
  ctx: Context
) => {
  return returnRequestListService(ctx, args)
}
