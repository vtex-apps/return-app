import type { QueryAdjustmentNoteArgs } from 'vtex.return-app'

import { adjustmentNoteService } from '../services/adjustmentNoteService'

export const adjustmentNote = async (
  _: unknown,
  { adjustmentId }: QueryAdjustmentNoteArgs,
  ctx: Context
) => {
  return adjustmentNoteService(ctx, adjustmentId)
}
