import type {
  MutationUpdateReturnRequestStatusArgs,
  ReturnRequest,
} from 'odp.return-app'

import { updateRequestStatusService } from '../services/updateRequestStatusService'

export const updateReturnRequestStatus = (
  _: unknown,
  args: MutationUpdateReturnRequestStatusArgs,
  ctx: Context
): Promise<ReturnRequest> => updateRequestStatusService(ctx, args)
