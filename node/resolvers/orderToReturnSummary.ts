import { ResolverError, UserInputError } from '@vtex/api'
import type { OrderToReturnSummary } from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { isUserAllowed } from '../utils/isUserAllowed'
import { canOrderBeReturned } from '../utils/canOrderBeReturned'

export const orderToReturnSummary = async (
  _: unknown,
  args: { orderId: string },
  ctx: Context
): Promise<OrderToReturnSummary> => {
  const { orderId } = args
  const {
    state: { userProfile },
    clients: { appSettings, oms, returnRequest: returnRequestClient },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const { maxDays, excludedCategories } = settings

  if (!userProfile) {
    throw new ResolverError('Missing userProfile', 500)
  }

  const { email } = userProfile

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const order = await oms.order(orderId)

  const { creationDate, clientProfileData, status } = order

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
  })

  return createOrdersToReturnSummary(order, email, {
    excludedCategories,
    returnRequestClient,
  })
}
