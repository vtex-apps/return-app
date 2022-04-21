type FilteredItems = {
  quantity: number
  available: number
  isExcluded: boolean
}

export function productsStatusToReturn(orderToReturn) {
  const { invoicedItems, excludedItems, processedItems } = orderToReturn

  // const processedItems = [
  //   { itemIndex: 1, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  //   { itemIndex: 2, quantity: 1 },
  // ]

  const filteredItemsToReturn: FilteredItems[] = []

  invoicedItems.forEach(({ quantity }) => {
    const itemToReturn = {
      quantity,
      available: quantity,
      isExcluded: false,
    }

    filteredItemsToReturn.push(itemToReturn)
  })

  excludedItems.forEach((item) => {
    const { quantity } = filteredItemsToReturn[item.itemIndex]

    const itemToReturn = {
      quantity,
      available: 0,
      isExcluded: true,
    }

    filteredItemsToReturn[item.itemIndex] = itemToReturn
  })

  processedItems.forEach(({ itemIndex, quantity }) => {
    if (filteredItemsToReturn[itemIndex]) {
      let availableQuantity =
        filteredItemsToReturn[itemIndex].available - quantity

      if (availableQuantity < 0) {
        availableQuantity = 0
      }

      const itemToReturn = {
        quantity: filteredItemsToReturn[itemIndex].quantity,
        available: availableQuantity,
        isExcluded: false,
      }

      return !filteredItemsToReturn[itemIndex].isExcluded
        ? (filteredItemsToReturn[itemIndex] = itemToReturn)
        : null
    }

    return null
  })

  const quantity = filteredItemsToReturn.reduce((acc, value) => {
    return acc + value.quantity
  }, 0)

  const availableQuantity = filteredItemsToReturn.reduce((acc, value) => {
    return value.isExcluded ? acc + 0 : acc + value.available
  }, 0)

  return { quantity, availableQuantity }
}
