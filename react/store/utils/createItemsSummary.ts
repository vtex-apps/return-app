import type { OrderToReturnSummary } from '../../../typings/OrderToReturn'

import { formatItemsToReturn } from './formatItemsToReturn'

export function createItemsSummary(orderToReturn: OrderToReturnSummary): {
  quantityAvailable: number
  quantity: number
} {
  const itemsToReturn = formatItemsToReturn(orderToReturn)

  const quantity = itemsToReturn.reduce((acc, value) => {
    return acc + value.quantity
  }, 0)

  const quantityAvailable = itemsToReturn.reduce((acc, value) => {
    return value.isExcluded ? acc : acc + value.quantityAvailable
  }, 0)

  return { quantity, quantityAvailable }
}
