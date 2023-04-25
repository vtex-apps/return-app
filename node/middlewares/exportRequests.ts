import type { Status } from 'vtex.return-app'
import Papa from 'papaparse'

import { returnRequestListService } from '../services/returnRequestListService'

function generateCSV(data: any[]) {
  const flattenedData = data.map((item: any) => ({
    ['Return Request ID']       :item?.id,
    ['Order ID']                :item?.orderId,
    ['Return Request Status']   :item?.status,
    ['Return Reason']           :item?.items?.map((reason: any) => `${reason?.id}-${reason?.returnReason?.reason}`).join(','),
    ['Customer Name']           :item?.customerProfileData?.name,
    ['Customer Email']          :item?.customerProfileData?.email,
    ['Seller Name']             :item?.sellerName || '',
    'Currier'                   :item?.logisticsInfo?.currier || '',
    'SLA'                       :item?.logisticsInfo?.sla || '',
    ['Sequence Number']         :item?.sequenceNumber,
    ['Creation date']           :item?.createdIn,
    ['Creation time']           :item?.dateSubmitted
  }))

  return Papa.unparse(flattenedData)
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

    const file = generateCSV(responseRequests)

    ctx.status = 200
    ctx.set('Content-Type', 'application/csv')
    ctx.set('Content-Disposition', `attachment; filename=return-requests-${(new Date().toJSON().slice(0,10))}.csv`)
    ctx.body = file
  } catch (error) {
    ctx.status = 500
    ctx.body = { error: error.message }
  }

  ctx.set('Cache-Control', 'no-cache')
  await next()
}
