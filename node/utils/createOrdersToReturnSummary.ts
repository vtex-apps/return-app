import type { OrderDetailResponse } from '@vtex/clients'
import type {
  OrderToReturnSummary,
  InvoicedItem,
  ExcludedItem,
  ProcessedItem,
  ReturnAppSettings,
} from 'vtex.return-app'

import { getInvoicedItems } from './getInvoicedItems'
import { mapItemIndexAndQuantity } from './mapItemIndexAndQuantity'

export const createOrdersToReturnSummary = (
  order: OrderDetailResponse,
  {
    excludedCategories,
  }: { excludedCategories: ReturnAppSettings['excludedCategories'] }
): OrderToReturnSummary => {
  const { items, orderId, creationDate } = order
  // get all items (based on index on order.items) that were invoiced and sent to customer.
  // By the documentation: The Output type should be used when the invoice you are sending is a selling invoice
  // https://developers.vtex.com/vtex-rest-api/reference/invoicenotification
  const outputInvoicedItems = getInvoicedItems(
    order.packageAttachment.packages,
    'Output'
  )

  // get all items (based on index on order.items) that were send a return invoice.
  // By the documentation: The Input type should be used when you send a return invoice.
  // https://developers.vtex.com/vtex-rest-api/reference/invoicenotification
  const inputIvoicedItems = getInvoicedItems(
    order.packageAttachment.packages,
    'Input'
  )

  // Create a map to get quantity invoiced with Output type for an item (based on its index)
  const quantityInvoiced = mapItemIndexAndQuantity(outputInvoicedItems)

  // Create a map to get quantity invoiced with Input type for an item (based on its index)
  const returnedQuantityInvoiced = mapItemIndexAndQuantity(inputIvoicedItems)

  const invoicedItems: InvoicedItem[] = []
  const excludedItems: ExcludedItem[] = []
  const processedItems: ProcessedItem[] = []

  // Associate itemIndex with the correspondent item in the order.item
  for (const [index, quantity] of quantityInvoiced.entries()) {
    const {
      id,
      productId,
      name,
      imageUrl,
      additionalInfo: { categoriesIds },
    } = items[index]

    // Here we can add the fields we want to have in the final item array. TBD the needed ones
    const currentLength = invoicedItems.push({
      id,
      productId,
      quantity,
      name,
      imageUrl,
      orderItemIndex: index,
    })

    const categoryIdList = categoriesIds.split('/').filter(Boolean)

    const excludedCategory = excludedCategories.filter((categoryId) =>
      categoryIdList.includes(categoryId)
    )

    // If item is in a category that is forbidden to be returned by admin, add it to the control array
    if (excludedCategory.length) {
      excludedItems.push({
        itemIndex: currentLength - 1,
        reason: {
          key: 'EXCLUDED_CATEGORY',
          value: JSON.stringify(excludedCategory),
        },
      })
    }

    // Add items already refunded to the processed items list TBD: Check items committed via RMA app to be returned / returned and merge the information here.
    // A item could have been refunded via RMA app or OMS interface (or manually via API)
    if (returnedQuantityInvoiced.has(index)) {
      processedItems.push({
        itemIndex: currentLength - 1,
        quantity: returnedQuantityInvoiced.get(index) as number,
      })
    }
  }

  return {
    orderId,
    creationDate,
    invoicedItems,
    processedItems,
    excludedItems,
  }
}
