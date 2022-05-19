import { UserInputError } from '@vtex/api'
import type { OrderItemDetailResponse, PriceTag } from '@vtex/clients'
import type { ReturnRequest, ReturnRequestItemInput } from 'vtex.return-app'

const calculateItemTax = (
  tax: number,
  priceTags: PriceTag[],
  totalQuantity: number
): number => {
  if (tax) return tax

  const taxHubItems = priceTags.filter((priceTag) =>
    priceTag.name.includes('TAXHUB')
  )

  if (taxHubItems.length === 0) return 0

  const taxValueFromTaxHub = taxHubItems.reduce(
    (acc, cur) => acc + cur.value,
    0
  )

  return parseFloat((taxValueFromTaxHub / totalQuantity).toFixed(2)) * 100
}

export const createItemsToReturn = (
  itemsToReturn: ReturnRequestItemInput[],
  orderItems: OrderItemDetailResponse[]
): ReturnRequest['items'] => {
  return itemsToReturn.map((item) => {
    const orderItem = orderItems[item.orderItemIndex]

    if (!orderItem) {
      throw new UserInputError(
        `Item index ${item.orderItemIndex} doesn't exist on order`
      )
    }

    const { id, sellingPrice, tax, priceTags, quantity } = orderItem

    return {
      ...item,
      id,
      sellingPrice,
      tax: calculateItemTax(tax, priceTags, quantity),
    }
  })
}
