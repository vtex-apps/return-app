import { ResolverError } from '@vtex/api'
import type { OrdersToReturnList } from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'

const currentDate = new Date().toISOString()

const substractDays = (days: number) => {
  const date = new Date()

  date.setDate(date.getDate() - days)
  date.setUTCHours(0, 0, 0)

  return date.toISOString()
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
): Promise<OrdersToReturnList | null> => {
  const {
    state: { userProfile },
    clients: { appSettings, oms },
  } = ctx

  const { page } = args

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured')
  }

  const { maxDays } = settings
  const { email } = userProfile

  const { list, paging } = await oms.listOrdersWithParams(
    createParams({ maxDays, userEmail: email, page })
  )

  // 1. fetch order details to get items and packages
  // 2. calculate all items already shipped - packages invoice type output
  // 3. calculate all items already returned - packages invoice type input
  // 4. Get items committed to be returned (will need to wait until feature the create RMA is done)
  // 5. calculate all items still available to be returned (2 - (3 + 4))

  if (!list || !paging) {
    return null
  }

  return { list, paging }
}
