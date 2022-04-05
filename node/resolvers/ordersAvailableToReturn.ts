import { ResolverError } from '@vtex/api'
import type { OrderToReturnSummary } from 'vtex.return-app'

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
  perPage: 100 as const,
})

export const ordersAvailableToReturn = async (
  _: unknown,
  args: { page: number },
  ctx: Context
): Promise<OrderToReturnSummary[]> => {
  const {
    state: { userProfile },
    clients: { appSettings, oms },
    vtex: { logger },
  } = ctx

  const { page } = args

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured')
  }

  const { maxDays, excludedCategories } = settings
  const { email } = userProfile

  // Fetch order associated to the user email
  // Hard coded limit to get only latest 100 orders for a user. If we need to fetch more, we need to implement pagination
  const { list } = await oms.listOrdersWithParams(
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

  const orderList = []

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
      }
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

    const invoicedItems = []

    // Associate itemIndex with the correspondent item in the order.item
    for (const index of mapItemIndexAndQuantity.keys()) {
      const quantity = mapItemIndexAndQuantity.get(index) as number

      const {
        id,
        productId,
        additionalInfo: { categoriesIds },
      } = items[index]

      const categoryIdList = categoriesIds.split('/').filter(Boolean)

      // Here we can add the fields we want to have in the final item array. TBD the needed ones
      invoicedItems.push({
        id,
        productId,
        categoriesIds: categoryIdList,
        quantity,
      })
    }

    // Remove items that are included in the categories not allowed to be returned
    const filteredItems = invoicedItems.filter(({ categoriesIds }) => {
      return !excludedCategories.some((categoryId) =>
        categoriesIds.includes(categoryId)
      )
    })

    // If order has at least one item to be returned, we add it to the final item list
    if (filteredItems.length > 0) {
      orderList.push({
        orderId,
        creationDate,
      })
    } else {
      logger.info({
        message: `Order ${order.orderId} has no item available to return`,
      })
    }
  }

  // 3. calculate all items already returned - packages invoice type input
  // 4. Get items committed to be returned - get it from MD - Needs to get all RMA created for this orderId, check the items commited to be reuturned, BUT not returned yet (not in the invoice type Input)
  // 5. calculate all items still available to be returned

  return orderList
}
