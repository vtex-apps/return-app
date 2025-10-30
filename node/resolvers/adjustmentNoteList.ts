import type { QueryAdjustmentNoteListArgs } from 'odp.return-app'

import { adjustmentNoteListService } from '../services/adjustmentNoteListService'

export const adjustmentNoteList = (
  _: unknown,
  args: QueryAdjustmentNoteListArgs,
  ctx: Context
) => {
  return adjustmentNoteListService(ctx, args)
}
