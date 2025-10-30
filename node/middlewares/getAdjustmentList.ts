import type { AdjustmentNoteStatus } from 'odp.return-app'
import { CommonLogger } from '../utils/commonLogger'
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
    _reasonCode,
    _locationCode,
    _originalPaymentMethod,
    _allFields,
  } = query

  const [from, to] = (_dateSubmitted as string | undefined)?.split(',') ?? []

  const getAllFields = Boolean(_allFields)

  // Log adjustment list query
  CommonLogger.logApiOperation(ctx, 'getAdjustmentList', {
    page: _page ? Number(_page) : 1,
    perPage: _perPage ? Number(_perPage) : 25,
    filters: {
      status: _status,
      orderId: _orderId,
      userEmail: _userEmail
    },
    getAllFields
  }, { 
    file: 'middlewares/getAdjustmentList.ts', 
    function: 'getAdjustmentList' 
  })

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
        reasonCode: _reasonCode as string | undefined,
        locationCode: _locationCode as string | undefined,
        originalPaymentMethod: _originalPaymentMethod as string | undefined,
      },
    },
    getAllFields
  )
}
