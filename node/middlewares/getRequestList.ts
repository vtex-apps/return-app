import type { Status, ReturnType } from 'vtex.return-app'

import { returnRequestListService } from '../services/returnRequestListService'

export async function getRequestList(ctx: Context) {
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
    _returnType,
    _reasonCode,
    _originalPaymentMethod,
    _externalReference,
    _locationCode,
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
        returnType: _returnType as ReturnType | undefined,
        reasonCode: _reasonCode as string | undefined,
        originalPaymentMethod: _originalPaymentMethod as string | undefined,
        externalReference: _externalReference as string | undefined,
        locationCode: _locationCode as string | undefined,
      },
    },
    getAllFields
  )
}
