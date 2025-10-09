import { UserInputError } from '@vtex/api'
import { json } from 'co-body'

import { createAdjustmentNoteService } from '../services/createAdjustmentNoteService'

export async function createAdjustment(ctx: Context) {
  const { req } = ctx

  const body = await json(req)

  const { locale } = body

  if (!locale) {
    throw new UserInputError('Locale is required.')
  }

  ctx.vtex.locale = locale

  ctx.body = await createAdjustmentNoteService(ctx, body)
  ctx.status = 201
}
