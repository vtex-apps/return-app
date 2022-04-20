export function productsStatusToReturn({
  invoicedItems,
  processedItems,
  excludedItems,
}) {
  if (excludedItems.length === invoicedItems.length) return 'Not active'

  // const processedItems = [
  //   { itemIndex: 0, quantity: 3 },
  //   { itemIndex: 1, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  // ]

  const unavailableItems = {}

  excludedItems.forEach((item) => {
    unavailableItems[item.itemIndex] = Infinity
  })

  processedItems.forEach(({ itemIndex, quantity }) => {
    // eslint-disable-next-line no-prototype-builtins
    if (!unavailableItems.hasOwnProperty(itemIndex)) {
      unavailableItems[itemIndex] = quantity
    } else if (
      // eslint-disable-next-line no-prototype-builtins
      unavailableItems.hasOwnProperty(itemIndex) &&
      unavailableItems[itemIndex] !== Infinity
    ) {
      unavailableItems[itemIndex] =
        Number(quantity) + Number(unavailableItems[itemIndex])
    }
  })

  const isActive = invoicedItems.some(({ quantity }, index) => {
    // eslint-disable-next-line no-prototype-builtins
    if (unavailableItems.hasOwnProperty(index)) {
      return quantity > unavailableItems[Number(index)]
    }

    return true
  })

  return isActive ? 'Active' : 'Not active'
}
