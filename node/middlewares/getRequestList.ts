import type { Status } from '../../typings/ReturnRequest'
import { returnRequestListService } from '../services/returnRequestListService'

export async function getRequestList(ctx: Context) {
  const {
    query,
    state: { sellerId },
  } = ctx

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

  ctx.body = await returnRequestListService(
    ctx,
    {
      page: _page ? Number(_page) : 1,
      perPage: _perPage ? Number(_perPage) : 25,
      filter: {
        status: _status as Status | undefined,
        sequenceNumber: _sequenceNumber as string | undefined,
        id: _id as string | undefined,
        createdIn: _dateSubmitted ? { from, to } : undefined,
        orderId: _orderId as string | undefined,
        userEmail: _userEmail as string | undefined,
        sellerName: sellerId as string | undefined,
      },
    },
    getAllFields
  )
}
