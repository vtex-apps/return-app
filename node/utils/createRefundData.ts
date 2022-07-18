import type { Maybe, RefundDataInput, ReturnRequest } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

export const createRefundData = ({
  requestId,
  refundData,
  requestItems,
  refundableShipping,
}: {
  requestId: string
  refundData?: Maybe<RefundDataInput>
  requestItems: ReturnRequest['items']
  refundableShipping: number
}): ReturnRequest['refundData'] => {
  const requestItemsMap = new Map<number, ReturnRequest['items'][number]>()

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
      price: (Number(sellingPrice) ?? 0) + (Number(tax) ?? 0),
      quantity: refundItem.quantity,
      restockFee: refundItem.restockFee,
    })
  }

  const refundedItemsValue = items.reduce(
    (total, item) => total + (item.price * item.quantity - item.restockFee),
    0
  )

  const refundedShippingValue = refundData?.refundedShippingValue ?? 0

  if (refundableShipping < refundedShippingValue) {
    throw new ResolverError(
      `Refundable shipping value (${refundableShipping}) is less than the shipping value sent (${refundedShippingValue})`
    )
  }

  return {
    // invoiceNumber has to match the requestId.
    // This values is used to filter the invoices created via Return app when calculating the items available to be returned.
    invoiceNumber: requestId,
    invoiceValue: refundedItemsValue + refundedShippingValue,
    refundedItemsValue,
    refundedShippingValue,
    items,
  }
}
