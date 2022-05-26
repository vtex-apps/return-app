import type { RefundableAmountTotal, ReturnRequest } from 'vtex.return-app'
import type { ItemTotal } from '@vtex/clients'

export const createRefundableTotals = (
  itemsToReturn: ReturnRequest['items'],
  totals: ItemTotal[],
  proportionalShippingSetting?: boolean | null
): RefundableAmountTotal[] => {
  const orderShippingTotal =
    totals.find(({ id }) => id === 'Shipping')?.value ?? 0

  const orderItemsTotal = totals.find(({ id }) => id === 'Items')?.value ?? 0
  const orderDiscountsTotal =
    totals.find(({ id }) => id === 'Discounts')?.value ?? 0

  const itemsAmount =
    itemsToReturn?.reduce((total, item) => {
      const { quantity, sellingPrice } = item

      return total + (quantity ?? 0) * (sellingPrice ?? 0)
    }, 0) ?? 0

  const itemsTotal = { id: 'items' as const, value: itemsAmount }

  const taxAmount =
    itemsToReturn?.reduce((total, item) => {
      const { quantity, tax } = item

      return total + (quantity ?? 0) * (tax ?? 0)
    }, 0) ?? 0

  const taxTotal = { id: 'tax' as const, value: taxAmount }

  const shippingAmount = proportionalShippingSetting
    ? parseFloat(
        (
          (itemsAmount * orderShippingTotal) /
          (orderItemsTotal + orderDiscountsTotal)
        ).toFixed(0)
      )
    : orderShippingTotal

  const shippingTotal = { id: 'shipping' as const, value: shippingAmount }

  return [itemsTotal, shippingTotal, taxTotal]
}
