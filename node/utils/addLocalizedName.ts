import type { OrderToReturnSummary } from 'vtex.return-app'

import type { CatalogGQL } from '../clients/catalogGQL'

/**
 * Adds localized names with the most up to date SKU's translations, using catalog-graphql
 * @returns the OTRS with the invoiced items‘ names translated, if they exist
 */
export const addLocalizedName = async (
  orderToReturnSummary: OrderToReturnSummary,
  catalogGraphQL: CatalogGQL
): Promise<OrderToReturnSummary> => {
  const localizedItems = await Promise.all(
    orderToReturnSummary.invoicedItems.map(async (item) => {
      const skuName = await catalogGraphQL.getSKUTranslation(item.id)

      const isLocalized = skuName && item.name !== skuName

      return {
        ...item,
        ...(isLocalized && { localizedName: skuName }),
      }
    })
  )

  return { ...orderToReturnSummary, invoicedItems: localizedItems }
}
