import { UserInputError } from '@vtex/api'
import type {
  OrderItemDetailResponse,
  PriceTag,
  SellerDetail,
} from '@vtex/clients'
import type { ReturnRequestItemInput, ReturnRequestItem } from 'vtex.return-app'

import type { CatalogGQL } from '../clients/catalogGQL'
import { translateItemName } from './translateItems'

interface ItemMetadata {
  Items: Array<{
    Id: string
    ImageUrl: string
  }>
}

/** TAXHUB line-level tax total (before per-unit rounding). */
const taxHubLineTotal = (
  priceTags: PriceTag[],
  quantity: number,
  sellingPrice: number
): number => {
  const taxHubItems =
    priceTags?.filter((priceTag) => priceTag.name.includes('TAXHUB')) ?? []

  if (taxHubItems.length === 0) return 0

  return taxHubItems.reduce((acc, priceTag) => {
    const { isPercentual, value, rawValue } = priceTag
    // value for TAXHUB is total (not per unit).
    // When it's percentual, rawValue is applied to sellingPrice * quantity (line total).
    const taxValue = isPercentual ? rawValue * sellingPrice * quantity : value

    return acc + taxValue
  }, 0)
}

/** Total tax for the order line (not per unit). */
export const calculateLineItemTax = ({
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
  if (tax) return tax * quantity

  return parseFloat(
    taxHubLineTotal(priceTags, quantity, sellingPrice).toFixed(0)
  )
}

/** Unit tax (per item), for display and unit price math. */
export const calculateItemTax = ({
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

  if (quantity === 0) return 0

  const lineTotal = taxHubLineTotal(priceTags, quantity, sellingPrice)

  return parseFloat((lineTotal / quantity).toFixed(0))
}

export const createItemsToReturn = async ({
  itemsToReturn,
  orderItems,
  sellers,
  itemMetadata,
  catalogGQL,
}: {
  itemsToReturn: ReturnRequestItemInput[]
  orderItems: OrderItemDetailResponse[]
  sellers: SellerDetail[]
  itemMetadata: ItemMetadata
  catalogGQL: CatalogGQL
}): Promise<ReturnRequestItem[]> => {
  return Promise.all(
    itemsToReturn.map(async (item) => {
      const orderItem = orderItems[item.orderItemIndex]

      if (!orderItem) {
        throw new UserInputError(
          `Item index ${item.orderItemIndex} doesn't exist on order`
        )
      }

      const {
        id,
        sellingPrice,
        tax,
        priceTags,
        quantity,
        name,
        imageUrl,
        unitMultiplier,
        seller,
        refId,
        productId,
      } = orderItem

      const sellerName =
        sellers.find((sellerInfo) => sellerInfo.id === seller)?.name ?? ''

      const productImage =
        imageUrl ??
        itemMetadata.Items.find((itemMeta) => itemMeta.Id === id)?.ImageUrl ??
        ''

      return {
        ...item,
        id,
        sellingPrice,
        tax: calculateItemTax({ tax, priceTags, quantity, sellingPrice }),
        name,
        localizedName: await translateItemName(id, name, catalogGQL),
        imageUrl: productImage,
        unitMultiplier,
        sellerId: seller,
        refId: refId ?? '',
        productId,
        sellerName,
        condition: item.condition ? item.condition : 'unspecified',
      }
    })
  )
}
