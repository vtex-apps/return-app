import type {
  MutationUpdateAdjustmentNoteStatusArgs,
  AdjustmentNote,
} from 'odp.return-app'

import { updateAdjustmentStatusService } from '../services/updateAdjustmentStatusService'

export const updateAdjustmentNoteStatus = (
  _: unknown,
  args: MutationUpdateAdjustmentNoteStatusArgs,
  ctx: Context
): Promise<AdjustmentNote> => updateAdjustmentStatusService(ctx, args)
