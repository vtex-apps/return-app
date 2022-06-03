import type { Maybe, RefundDataInput, ReturnRequest } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

type RequiredReturnRequest = Required<ReturnRequest>

export const createRefundData = ({
  requestId,
  refundData,
  requestItems,
}: {
  requestId: string
  refundData?: Maybe<RefundDataInput>
  requestItems: ReturnRequest['items']
}): RequiredReturnRequest['refundData'] => {
  const requestItemsMap = new Map<
    number,
    Required<ReturnRequest>['items'][number]
  >()

  for (const requestedItem of requestItems ?? []) {
    requestItemsMap.set(requestedItem.orderItemIndex as number, requestedItem)
  }

  const items = []

  for (const refundItem of refundData?.items ?? []) {
    if (refundItem.quantity === 0) continue
    const requestedItem = requestItemsMap.get(refundItem.orderItemIndex)

    if (!requestedItem) {
      throw new ResolverError(
        `Item index ${refundItem.orderItemIndex} isn't in the return request`
      )
    }

    const { orderItemIndex, sellingPrice, tax, id } = requestedItem

    items.push({
      orderItemIndex,
      id,
      price: (sellingPrice ?? 0) + (tax ?? 0),
      quantity: refundItem.quantity,
      restockFee: refundItem.restockFee,
    })
  }

  const refundedItemsValue = items.reduce(
    (total, item) => total + (item.price * item.quantity - item.restockFee),
    0
  )

  const refundedShippingValue = refundData?.refundedShippingValue ?? 0

  return {
    invoiceNumber: requestId,
    invoiceValue: refundedItemsValue + refundedShippingValue,
    refundedItemsValue,
    refundedShippingValue,
    items,
  }
}
