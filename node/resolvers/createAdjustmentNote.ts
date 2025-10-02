import type { MutationCreateAdjustmentNoteArgs } from 'odp.return-app'

import { createAdjustmentNoteService } from '../services/createAdjustmentNoteService'

export const createAdjustmentNote = async (
  _: unknown,
  args: MutationCreateAdjustmentNoteArgs,
  ctx: Context
) => {
  const { adjustmentNote } = args

  return createAdjustmentNoteService(ctx, adjustmentNote)
}
