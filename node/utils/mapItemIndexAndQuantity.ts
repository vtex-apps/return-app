import type { ItemPackage } from '@vtex/clients'

export const mapItemIndexAndQuantity = (
  itemPackages: Array<
    Omit<ItemPackage, 'description' | 'price' | 'unitMultiplier'>
  >
): Map<number, number> => {
  const itemIndexAndQuantityMap = new Map<number, number>()

  for (const invoicedItem of itemPackages) {
    const { itemIndex, quantity } = invoicedItem

    if (itemIndexAndQuantityMap.has(itemIndex)) {
      const currentQuantity = itemIndexAndQuantityMap.get(itemIndex) as number

      itemIndexAndQuantityMap.set(itemIndex, currentQuantity + quantity)
    } else {
      itemIndexAndQuantityMap.set(itemIndex, quantity)
    }
  }

  return itemIndexAndQuantityMap
}
