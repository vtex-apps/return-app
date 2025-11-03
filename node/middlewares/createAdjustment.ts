import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

import { CommonLogger } from '../utils/commonLogger'
import { createAdjustmentNoteService } from '../services/createAdjustmentNoteService'

export async function createAdjustment(ctx: Context) {
  const { req } = ctx
  const body = await json(req)
  const { locale, orderId, reasonCode } = body

  // Log adjustment creation start
  CommonLogger.logBusinessOperation(
    ctx,
    'createAdjustmentNote',
    {
      orderId,
      locale,
      reasonCode,
      hasItems: !!body.items,
      itemCount: body.items?.length,
    },
    {
      file: 'middlewares/createAdjustment.ts',
      function: 'createAdjustment',
    }
  )

  if (!locale) {
    throw new UserInputError('Locale is required.')
  }

  ctx.vtex.locale = locale
  const result = await createAdjustmentNoteService(ctx, body)

  // Log successful creation
  CommonLogger.logBusinessOperation(
    ctx,
    'adjustmentNoteCreated',
    {
      adjustmentId: result.adjustmentNoteId,
      orderId,
      locale,
    },
    {
      file: 'middlewares/createAdjustment.ts',
      function: 'createAdjustment',
    }
  )

  ctx.body = result
  ctx.status = 201
}
