export function availableProductsToReturn(ordersToReturn) {
  const { invoicedItems, excludedItems, processedItems } = ordersToReturn

  // const processedItems = [
  //   { itemIndex: 0, quantity: 3 },
  //   { itemIndex: 1, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  // ]

  const filteredItemsToReturn: ItemToReturn[] = []

  invoicedItems.forEach(({ quantity, name, imageUrl, id }) => {
    const itemToReturn = {
      id,
      quantity,
      available: quantity,
      isExcluded: false,
      name,
      imageUrl,
    }

    filteredItemsToReturn.push(itemToReturn)
  })

  excludedItems.forEach((item) => {
    const { quantity, name, imageUrl, id } = invoicedItems[item.itemIndex]

    const itemToReturn = {
      id,
      quantity,
      available: 0,
      isExcluded: true,
      name,
      imageUrl,
    }

    filteredItemsToReturn[item.itemIndex] = itemToReturn
  })
  processedItems.forEach(({ itemIndex, quantity }) => {
    const { name, imageUrl, id } = invoicedItems[itemIndex]

    const availableQuantity =
      filteredItemsToReturn[itemIndex].available - quantity

    const itemToReturn = {
      id,
      quantity: filteredItemsToReturn[itemIndex].quantity,
      available: availableQuantity,
      isExcluded: false,
      name,
      imageUrl,
    }

    !filteredItemsToReturn[itemIndex].isExcluded
      ? (filteredItemsToReturn[itemIndex] = itemToReturn)
      : null
  })

  return filteredItemsToReturn
}
