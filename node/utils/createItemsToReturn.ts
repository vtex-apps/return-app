import { UserInputError } from '@vtex/api'
import type { OrderItemDetailResponse, PriceTag } from '@vtex/clients'
import type { ReturnRequest, ReturnRequestItemInput } from 'vtex.return-app'

const calculateItemTax = ({
  tax,
  priceTags,
  quantity,
  sellingPrice,
}: {
  tax: number
  priceTags: PriceTag[]
  quantity: number
  sellingPrice: number
}): number => {
  if (tax) return tax

  const taxHubItems = priceTags.filter((priceTag) =>
    priceTag.name.includes('TAXHUB')
  )

  if (taxHubItems.length === 0) return 0

  const taxValueFromTaxHub = taxHubItems.reduce((acc, priceTag) => {
    const { isPercentual, value, rawValue } = priceTag
    // value for TAXHUB is total (not per unit).
    // When it's percentual, the rawValue is the % to be applied. Since we divide the total ammount per quantity in the return, we
    const taxValue = isPercentual ? rawValue * sellingPrice * quantity : value

    return acc + taxValue
  }, 0)

  return parseFloat((taxValueFromTaxHub / quantity).toFixed(0))
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
      tax: calculateItemTax({ tax, priceTags, quantity, sellingPrice }),
    }
  })
}
