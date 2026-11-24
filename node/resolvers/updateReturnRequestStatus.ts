import type { MutationUpdateReturnRequestStatusArgs } from 'vtex.return-app'

import { updateRequestStatusService } from '../services/updateRequestStatusService'
import type { ReturnRequest } from '../typings/returnRequest'

export const updateReturnRequestStatus = (
  _: unknown,
  args: MutationUpdateReturnRequestStatusArgs,
  ctx: Context
): Promise<ReturnRequest> => updateRequestStatusService(ctx, args)
