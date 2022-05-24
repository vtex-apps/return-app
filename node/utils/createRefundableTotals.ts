import type { RefundableAmountTotal, ReturnRequest } from 'vtex.return-app'

export const createRefundableTotals = (
  itemsToReturn: ReturnRequest['items'],
  shippingAmount: number
): RefundableAmountTotal[] => {
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

  const shippingTotal = { id: 'shipping' as const, value: shippingAmount }

  return [itemsTotal, shippingTotal, taxTotal]
}
