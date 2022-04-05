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
  perPage: 15 as const,
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

  const { list, paging } = await oms.listOrdersWithParams(
    createParams({ maxDays, userEmail: email, page })
  )

  // eslint-disable-next-line no-console
  console.log({ paging })

  const orderListPromises = []

  for (const order of list) {
    const orderPromise = oms.order(order.orderId)

    orderListPromises.push(orderPromise)

    // eslint-disable-next-line no-await-in-loop
    await pacer(2000)
  }

  const orders = await Promise.all(orderListPromises)

  const orderList = []

  for (const order of orders) {
    const { items, orderId, creationDate } = order

    // Filter items invoiced
    const invoiceOutput = order.packageAttachment.packages.filter(
      ({ type }) => type === 'Output'
    )

    const invoicedItemsRaw = invoiceOutput.map(
      ({ items: invoicedItems }) => invoicedItems
    )

    const invoicedItemsFlatten = invoicedItemsRaw.reduce(
      (acc, invoicedItems) => {
        return [...acc, ...invoicedItems]
      }
    )

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

    for (const index of mapItemIndexAndQuantity.keys()) {
      const quantity = mapItemIndexAndQuantity.get(index) as number

      const {
        id,
        productId,
        additionalInfo: { categoriesIds },
      } = items[index]

      const categoryIdList = categoriesIds.split('/').filter(Boolean)

      invoicedItems.push({
        id,
        productId,
        categoriesIds: categoryIdList,
        quantity,
      })
    }

    const filteredItems = invoicedItems.filter(({ categoriesIds }) => {
      return !excludedCategories.some((categoryId) =>
        categoriesIds.includes(categoryId)
      )
    })

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

  // 1. fetch order details to get items and packages
  // 2. calculate all items already shipped - packages invoice type output
  // 3. calculate all items already returned - packages invoice type input
  // 4. Get items committed to be returned (will need to wait until feature the create RMA is done). Need to control the items that were alredy invoiced to return. This way we can remove it from the comparasion.
  // 5. calculate all items still available to be returned (2 - (3 + 4))

  return orderList
}
