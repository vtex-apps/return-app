import type { RefundableAmountTotal, ReturnRequest } from 'vtex.return-app'
import type { ItemTotal } from '@vtex/clients'

export const createRefundableTotals = (
  itemsToReturn: ReturnRequest['items'],
  totals: ItemTotal[],
  proportionalShippingSetting: boolean
): RefundableAmountTotal[] => {
  const shippingTotal = totals.find(({ id }) => id === 'Shipping')?.value ?? 0
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

  let proportionalShippingAmount = 0

  if (proportionalShippingSetting) {
    proportionalShippingAmount =
      (itemsAmount * shippingTotal) /
      (orderItemsTotal + orderDiscountsTotal) /
      100
  }

  const shippingAmount =
    proportionalShippingAmount !== 0
      ? {
          id: 'shipping' as const,
          value: parseFloat(proportionalShippingAmount.toFixed(2)) * 100,
        }
      : { id: 'shipping' as const, value: shippingTotal }

  return [itemsTotal, shippingAmount, taxTotal]
}
