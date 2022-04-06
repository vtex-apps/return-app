import { ResolverError } from '@vtex/api'
import type {
  ExcludedItem,
  InvoicedItem,
  OrdersToReturnList,
  OrderToReturnSummary,
  ProcessedItem,
} from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'

const currentDate = new Date().toISOString()

const substractDays = (days: number) => {
  const date = new Date()

  date.setDate(date.getDate() - days)
  date.setUTCHours(0, 0, 0)

  return date.toISOString()
}

const ONE_MINUTE = 60 * 1000

function pacer(callsPerMinute: number) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve('done')
    }, ONE_MINUTE / callsPerMinute)
  })
}

const createParams = ({
  maxDays,
  userEmail,
  page = 1,
}: {
  maxDays: number
  userEmail: string
  page: number
}) => ({
  clientEmail: userEmail,
  orderBy: 'creationDate,desc' as const,
  f_status: 'invoiced' as const,
  f_creationDate: `creationDate:[${substractDays(maxDays)} TO ${currentDate}]`,
  page,
  per_page: 10 as const,
})

export const ordersAvailableToReturn = async (
  _: unknown,
  args: { page: number },
  ctx: Context
): Promise<OrdersToReturnList> => {
  const {
    state: { userProfile },
    clients: { appSettings, oms },
  } = ctx

  const { page } = args

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured')
  }

  const { maxDays, excludedCategories } = settings
  const { email } = userProfile

  // Fetch order associated to the user email
  const { list, paging } = await oms.listOrdersWithParams(
    createParams({ maxDays, userEmail: email, page })
  )

  const orderListPromises = []

  for (const order of list) {
    // Fetch order details to get items and packages
    const orderPromise = oms.order(order.orderId)

    orderListPromises.push(orderPromise)

    // eslint-disable-next-line no-await-in-loop
    await pacer(2000)
  }

  const orders = await Promise.all(orderListPromises)

  const orderList: OrderToReturnSummary[] = []

  for (const order of orders) {
    const { items, orderId, creationDate } = order

    // Calculate all items already shipped - packages invoice type output
    // Filter items invoiced
    const invoiceOutput = order.packageAttachment.packages.filter(
      ({ type }) => type === 'Output'
    )

    // Create a list with all items inside the packages
    const invoicedItemsRaw = invoiceOutput.map(
      ({ items: invoicedItems }) => invoicedItems
    )

    // Flatten the list of items
    const invoicedItemsFlatten = invoicedItemsRaw.reduce(
      (acc, invoicedItems) => {
        return [...acc, ...invoicedItems]
      },
      []
    )

    const invoiceInput = order.packageAttachment.packages.filter(
      ({ type }) => type === 'Input'
    )

    // Create a list with all items inside the packages
    const returnedItemsRaw = invoiceInput.map(
      ({ items: returnedItems }) => returnedItems
    )

    // Flatten the list of items
    const returnedItemsFlatten = returnedItemsRaw.reduce(
      (acc, returnedItems) => {
        return [...acc, ...returnedItems]
      },
      []
    )

    // Create a map to get quantity invoiced for an item (based on its index)
    const mapItemIndexAndQuantity = new Map<number, number>()

    for (const invoicedItem of invoicedItemsFlatten) {
      const { itemIndex, quantity } = invoicedItem

      if (mapItemIndexAndQuantity.has(itemIndex)) {
        const currentQuantity = mapItemIndexAndQuantity.get(itemIndex) as number

        mapItemIndexAndQuantity.set(itemIndex, currentQuantity + quantity)
      } else {
        mapItemIndexAndQuantity.set(itemIndex, quantity)
      }
    }

    // Create a map to get quantity invoiced for an item (based on its index)
    const mapRefundedItemIndexAndQuantity = new Map<number, number>()

    for (const invoicedItem of returnedItemsFlatten) {
      const { itemIndex, quantity } = invoicedItem

      if (mapRefundedItemIndexAndQuantity.has(itemIndex)) {
        const currentQuantity = mapRefundedItemIndexAndQuantity.get(
          itemIndex
        ) as number

        mapRefundedItemIndexAndQuantity.set(
          itemIndex,
          currentQuantity + quantity
        )
      } else {
        mapRefundedItemIndexAndQuantity.set(itemIndex, quantity)
      }
    }

    const invoicedItems: InvoicedItem[] = []
    const excludedItems: ExcludedItem[] = []
    const processedItems: ProcessedItem[] = []

    // Associate itemIndex with the correspondent item in the order.item
    for (const index of mapItemIndexAndQuantity.keys()) {
      const quantity = mapItemIndexAndQuantity.get(index) as number

      const {
        id,
        productId,
        additionalInfo: { categoriesIds },
      } = items[index]

      // Here we can add the fields we want to have in the final item array. TBD the needed ones
      const currentLength = invoicedItems.push({
        id,
        productId,
        quantity,
      })

      const categoryIdList = categoriesIds.split('/').filter(Boolean)

      const excludedCategory = excludedCategories.filter((categoryId) =>
        categoryIdList.includes(categoryId)
      )

      // Remove items that are included in the categories not allowed to be returned
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
      if (mapRefundedItemIndexAndQuantity.has(index)) {
        processedItems.push({
          itemIndex: currentLength - 1,
          quantity: mapRefundedItemIndexAndQuantity.get(index) as number,
        })
      }
    }

    orderList.push({
      orderId,
      creationDate,
      invoicedItems,
      processedItems,
      excludedItems,
    })
  }

  return { list: orderList, paging }
}
