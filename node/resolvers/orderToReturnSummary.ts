import { ResolverError } from '@vtex/api'
import type { OrderToReturnSummary } from 'vtex.return-app'

import { ORDER_TO_RETURN_VALIDATON, SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { isWithinMaxDaysToReturn } from '../utils/dateHelpers'
import { isUserAllowed } from '../utils/isUserAllowed'

const { ORDER_NOT_INVOICED, OUT_OF_MAX_DAYS } = ORDER_TO_RETURN_VALIDATON

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
  const { email } = userProfile

  const order = await oms.order(orderId)

  const { creationDate, clientProfileData, status } = order

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
  })

  if (!isWithinMaxDaysToReturn(creationDate, maxDays)) {
    throw new ResolverError(
      'Order is not within max days to return',
      400,
      OUT_OF_MAX_DAYS
    )
  }

  if (status !== 'invoiced') {
    throw new ResolverError('Order is not invoiced', 400, ORDER_NOT_INVOICED)
  }

  return createOrdersToReturnSummary(order, email, {
    excludedCategories,
    returnRequestClient,
  })
}
