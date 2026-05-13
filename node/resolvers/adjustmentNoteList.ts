import type { QueryAdjustmentNoteListArgs } from 'vtex.return-app'

import { adjustmentNoteListService } from '../services/adjustmentNoteListService'

export const adjustmentNoteList = (
  _: unknown,
  args: QueryAdjustmentNoteListArgs,
  ctx: Context
) => {
  return adjustmentNoteListService(ctx, args)
}
