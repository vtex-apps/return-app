import { ResolverError } from '@vtex/api'
import type { OrdersToReturnList, OrderToReturnSummary } from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'

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
    const orderToReturnSummary = createOrdersToReturnSummary(order, {
      excludedCategories,
    })

    orderList.push(orderToReturnSummary)
  }

  return { list: orderList, paging }
}
