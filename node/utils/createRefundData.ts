import type { Maybe, RefundDataInput, ReturnRequest } from 'vtex.return-app'
import { UserInputError } from '@vtex/api'

export const createRefundData = ({
  requestId,
  refundData,
  requestItems,
  refundableShipping,
  settingsData,
}: {
  requestId: string
  refundData?: Maybe<RefundDataInput>
  requestItems: ReturnRequest['items']
  refundableShipping: number
  settingsData: ReturnAppSettingsCustom
}): ReturnRequest['refundData'] => {
  const requestItemsMap = new Map<number, ReturnRequest['items'][number]>()

  for (const requestedItem of requestItems ?? []) {
    requestItemsMap.set(requestedItem.orderItemIndex as number, requestedItem)
  }

  const items = []
  let refundableTaxes = 0
  let invoiceValue = 0
  let refundedItemsValue = 0

  for (const refundItem of refundData?.items ?? []) {
    if (refundItem.quantity === 0) continue
    const requestedItem = requestItemsMap.get(refundItem.orderItemIndex)

    if (!requestedItem) {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} isn't in the return request`
      )
    }

    if (requestedItem.quantity < refundItem.quantity) {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} has a quantity of ${requestedItem.quantity} but ${refundItem.quantity} was requested to return`
      )
    }

    const { orderItemIndex, sellingPrice, tax, id } = requestedItem

    if (typeof refundItem.restockFee !== 'number') {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} has a invalid restockFee. It must be a number. Pass 0 if there is no restock fee.`
      )
    }

    refundableTaxes += Number(tax) ?? 0

    items.push({
      orderItemIndex,
      id,
      price: settingsData?.options?.disableTaxRefund
        ? Number(sellingPrice) ?? 0
        : Number(sellingPrice) + Number(tax) ?? 0,
      quantity: refundItem.quantity,
      restockFee: refundItem.restockFee,
    })
  }

  refundedItemsValue = items.reduce(
    (total, item) => total + (item.price * item.quantity - item.restockFee),
    0
  )

  if (typeof refundData?.refundedShippingValue !== 'number') {
    throw new UserInputError(
      'Missing refundedShippingValue or not a valid number'
    )
  }

  const refundedShippingValue = refundData?.refundedShippingValue ?? 0

  if (refundableShipping < refundedShippingValue) {
    throw new UserInputError(
      `Refundable shipping value (${refundableShipping}) is less than the shipping value sent (${refundedShippingValue})`
    )
  }

  invoiceValue = settingsData?.options?.disableTaxRefund
    ? refundedItemsValue + refundableTaxes + refundedShippingValue
    : refundedItemsValue + refundedShippingValue

  refundedItemsValue = settingsData?.options?.disableTaxRefund
    ? refundedItemsValue + refundableTaxes
    : refundedItemsValue

  return {
    // invoiceNumber has to match the requestId.
    // This values is used to filter the invoices created via Return app when calculating the items available to be returned.
    invoiceNumber: requestId,
    invoiceValue,
    refundedItemsValue,
    refundedShippingValue,
    items,
  }
}
