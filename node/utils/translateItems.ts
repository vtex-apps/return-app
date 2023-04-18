import type { InvoicedItem } from '../../typings/OrderToReturn'

import type { CatalogGQL } from '../clients/catalogGQL'

/**
 * @returns the most up to date SKU translations, if it exist
 */
export const translateItemName = async (
  id: string,
  originalName: string,
  catalogClient: CatalogGQL
) => {
  try {
    const skuName = await catalogClient.getSKUTranslation(id)
    const isLocalized = skuName && skuName !== originalName

    return isLocalized ? skuName : null
  } catch (error) {
    error.message = 'Error translating item name'
    throw error
  }
}

export function handleTranlateItems(
  items: InvoicedItem[],
  catalogClient: CatalogGQL
): Promise<InvoicedItem[]> {
  return Promise.all(
    items.map(async (item: InvoicedItem) => {
      return {
        ...item,
        localizedName: await translateItemName(
          item.id,
          item.name,
          catalogClient
        ),
      }
    })
  )
}
