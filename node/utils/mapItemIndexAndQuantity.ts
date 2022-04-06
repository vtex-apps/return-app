import type { ItemPackage } from '@vtex/clients'

export const mapItemIndexAndQuantity = (
  itemPAckages: ItemPackage[]
): Map<number, number> => {
  const itemIndexAndQuantityMap = new Map<number, number>()

  for (const invoicedItem of itemPAckages) {
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
