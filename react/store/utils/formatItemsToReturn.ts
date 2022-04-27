import type { OrderToReturnSummary } from 'vtex.return-app'

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
    return {
      ...invoicedItem,
      isExcluded: excludedItemsIndexMap.get(index) || false,
      quantityAvailable:
        invoicedItem.quantity -
        (processedItemsQuantityIndexMap.get(index) ?? 0),
    }
  })
}
