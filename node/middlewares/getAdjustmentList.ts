import type { AdjustmentNoteStatus } from 'odp.return-app'

import { adjustmentNoteListService } from '../services/adjustmentNoteListService'

export async function getAdjustmentList(ctx: Context) {
  const { query } = ctx

  const {
    _page,
    _perPage,
    _status,
    _sequenceNumber,
    _id,
    _dateSubmitted,
    _orderId,
    _userEmail,
    _allFields,
  } = query

  const [from, to] = (_dateSubmitted as string | undefined)?.split(',') ?? []

  const getAllFields = Boolean(_allFields)

  ctx.set('Cache-Control', 'no-cache')

  ctx.body = await adjustmentNoteListService(
    ctx,
    {
      page: _page ? Number(_page) : 1,
      perPage: _perPage ? Number(_perPage) : 25,
      filter: {
        status: _status as AdjustmentNoteStatus | undefined,
        sequenceNumber: _sequenceNumber as string | undefined,
        id: _id as string | undefined,
        createdIn: _dateSubmitted ? { from, to } : undefined,
        orderId: _orderId as string | undefined,
        userEmail: _userEmail as string | undefined,
      },
    },
    getAllFields
  )
}
