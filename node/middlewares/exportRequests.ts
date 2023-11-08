import XLSX from 'xlsx'

import type { Status } from '../../typings/ReturnRequest'
import { returnRequestListService } from '../services/returnRequestListService'

const createXLSBuffer = (data: any[]) => {
  const flattenedData = data.map((item: any) => ({
    'Return Request ID': item?.id,
    'Order ID': item?.orderId,
    'Return Request Status': item?.status,
    'Return Reason': item?.items
      ?.map((reason: any) => `${reason?.id}-${reason?.returnReason?.reason}`)
      .join(','),
    'Customer Name': item?.customerProfileData?.name,
    'Customer Email': item?.customerProfileData?.email,
    'Seller Name': item?.sellerName || '',
    Carrier: item?.logisticsInfo?.currier || '',
    'Shipping method': item?.logisticsInfo?.sla || '',
    'Sequence Number': item?.sequenceNumber,
    'Creation date': item?.createdIn,
    'Creation time': item?.dateSubmitted,
  }))

  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(flattenedData)

  XLSX.utils.book_append_sheet(workbook, worksheet, 'return-requests')

  return XLSX.write(workbook, { bookType: 'xls', type: 'buffer' })
}

export async function exportRequests(ctx: Context, next: () => Promise<void>) {
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
    _sellerName,
    _onlyData = false,
  } = query

  try {
    if (!_dateSubmitted) {
      throw new Error("The '_dateSubmitted' query parameter is required")
    }

    const [from, to] = (_dateSubmitted as string | undefined)?.split(',') ?? []

    const getAllFields = Boolean(_allFields)

    const params = {
      perPage: _perPage ? Number(_perPage) : 100,
      filter: {
        status: _status as Status | undefined,
        sequenceNumber: _sequenceNumber as string | undefined,
        id: _id as string | undefined,
        createdIn: _dateSubmitted ? { from, to } : undefined,
        orderId: _orderId as string | undefined,
        userEmail: _userEmail as string | undefined,
        sellerName: _sellerName as string | undefined,
      },
    }

    const requests = await returnRequestListService(
      ctx,
      {
        page: _page ? Number(_page) : 1,
        ...params,
      },
      getAllFields
    )

    const { paging, list } = requests

    let responseRequests = list

    if (paging.currentPage !== paging.pages) {
      const arrayRequests = Array.from({ length: paging.pages - 1 })

      const nextRequest = await Promise.all(
        arrayRequests.map(async (_, index) => {
          try {
            const page = index + 2

            const nextRequestResponse = await returnRequestListService(
              ctx,
              {
                page,
                ...params,
              },
              getAllFields
            )

            return nextRequestResponse.list
          } catch (error) {
            console.error(`Error fetching page ${index + 2}:`, error)

            return undefined
          }
        })
      )

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      responseRequests = responseRequests.concat(nextRequest.flat())
    }

    if (_onlyData) {
      ctx.status = 200
      ctx.body = responseRequests
    } else {
      const file = createXLSBuffer(responseRequests)

      ctx.status = 200
      ctx.set(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      )
      ctx.set(
        'Content-Disposition',
        `attachment; filename=return-requests-${new Date()
          .toJSON()
          .slice(0, 10)}.xls`
      )
      ctx.body = file
    }
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: error.message }
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
