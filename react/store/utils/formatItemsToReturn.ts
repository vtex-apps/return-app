import type { OrderToReturnSummary } from '../../../typings/OrderToReturn'

export function formatItemsToReturn(
  orderToReturn: OrderToReturnSummary
): ItemToReturn[] {
  const { invoicedItems, excludedItems, processedItems } = orderToReturn

  const excludedItemsIndexMap = new Map()

  for (const excludedItem of excludedItems) {
    excludedItemsIndexMap.set(excludedItem.itemIndex, true)
  }

  const processedItemsQuantityIndexMap = new Map()

  for (const processedItem of processedItems) {
    processedItemsQuantityIndexMap.set(
      processedItem.itemIndex,
      processedItem.quantity
    )
  }

  return invoicedItems.map((invoicedItem, index) => {
    const quantityAvailable =
      invoicedItem.quantity - (processedItemsQuantityIndexMap.get(index) ?? 0)

    return {
      ...invoicedItem,
      isExcluded: excludedItemsIndexMap.get(index) || false,
      // Quantity available can be negative when the store invoices the return outside the return app and doesnot apply the .
      quantityAvailable: quantityAvailable > 0 ? quantityAvailable : 0,
    }
  })
}
