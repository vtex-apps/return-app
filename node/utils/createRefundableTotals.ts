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

  const orderItemsValue = orderItemsTotal + orderDiscountsTotal

  // This handles the case where the items returned are all gifts (net value = 0)
  const areAllItemsGift = orderItemsValue === 0

  // If all items are gifts, we split the shipping value proportionally
  const proportionalShippingValue = areAllItemsGift
    ? orderShippingTotal / itemsToReturn.length
    : parseFloat(
        ((itemsAmount * orderShippingTotal) / orderItemsValue).toFixed(0)
      )

  const shippingAmount = proportionalShippingSetting
    ? proportionalShippingValue
    : orderShippingTotal

  const shippingTotal = { id: 'shipping' as const, value: shippingAmount }

  // Sum both Tax and all CustomTax entries from totals
  const standardTaxTotal = totals.find(({ id }) => id === 'Tax')?.value ?? 0
  const customTaxTotal = totals
    .filter(({ id }) => id === 'CustomTax')
    .reduce((sum, total) => sum + (total.value ?? 0), 0)

  const orderTaxTotal = standardTaxTotal + customTaxTotal

  // Additional amount is only refundable when no items are selected
  const additionalAmount =
    itemsAmount === 0 ? orderItemsValue + orderTaxTotal : 0

  const additionalTotal = { id: 'additional' as const, value: additionalAmount }

  return [itemsTotal, shippingTotal, taxTotal, additionalTotal]
}
