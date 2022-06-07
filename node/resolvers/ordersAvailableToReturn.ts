import { ResolverError } from '@vtex/api'
import type { OrdersToReturnList, OrderToReturnSummary } from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { getCurrentDate, substractDays } from '../utils/dateHelpers'

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
}) => {
  const currentDate = getCurrentDate()

  const encodedEmail = encodeURIComponent(userEmail)

  return `clientEmail=${encodedEmail}&orderBy=creationDate,desc&f_status=invoiced&f_creationDate=creationDate:[${substractDays(
    currentDate,
    maxDays
  )} TO ${currentDate}]&page=${page}&per_page=100`
}

export const ordersAvailableToReturn = async (
  _: unknown,
  args: { page: number },
  ctx: Context
): Promise<OrdersToReturnList> => {
  const {
    state: { userProfile },
    clients: { appSettings, oms, returnRequest: returnRequestClient },
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

  const orderSummaryPromises: Array<Promise<OrderToReturnSummary>> = []

  for (const order of orders) {
    const orderToReturnSummary = createOrdersToReturnSummary(order, email, {
      excludedCategories,
      returnRequestClient,
    })

    orderSummaryPromises.push(orderToReturnSummary)
  }

  const orderList = await Promise.all(orderSummaryPromises)

  return { list: orderList, paging }
}
