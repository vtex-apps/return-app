import { adjustmentNoteService } from '../services/adjustmentNoteService'

export async function getAdjustmentAdditionalInfo(ctx: Context) {
  const {
    vtex: {
      route: { params },
    },
  } = ctx

  const { adjustmentId } = params as { adjustmentId: string }

  ctx.set('Cache-Control', 'no-cache')

  const adjustmentNote = await adjustmentNoteService(ctx, adjustmentId)

  try {
    ctx.body = JSON.parse(
      adjustmentNote.additionalInfo
        ? (adjustmentNote.additionalInfo as string)
        : '{}'
    )
  } catch (error) {
    ctx.status = 500
    ctx.body = {
      message: 'Failed to parse additionalInfo field',
    }
  }
}
