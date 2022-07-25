import { ResolverError, UserInputError } from '@vtex/api'
import type { OrderToReturnSummary } from 'vtex.return-app'

import { SETTINGS_PATH } from '../utils/constants'
import { createOrdersToReturnSummary } from '../utils/createOrdersToReturnSummary'
import { isUserAllowed } from '../utils/isUserAllowed'
import { canOrderBeReturned } from '../utils/canOrderBeReturned'
import { getCustomerEmail } from '../utils/getCostumerEmail'
import { addLocalizedName } from '../utils/addLocalizedName'

export const orderToReturnSummary = async (
  _: unknown,
  args: { orderId: string; storeUserEmail?: string },
  ctx: Context
): Promise<OrderToReturnSummary> => {
  const { orderId, storeUserEmail } = args
  const {
    state: { userProfile, appkey },
    clients: {
      appSettings,
      oms,
      returnRequest: returnRequestClient,
      catalogGQL,
    },
    vtex: { logger },
  } = ctx

  const settings = await appSettings.get(SETTINGS_PATH, true)

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const { maxDays, excludedCategories } = settings

  // For requests where orderId is an empty string
  if (!orderId) {
    throw new UserInputError('Order ID is missing')
  }

  const order = await oms.order(orderId)

  const { creationDate, clientProfileData, status } = order

  isUserAllowed({
    requesterUser: userProfile,
    clientProfile: clientProfileData,
    appkey,
  })

  canOrderBeReturned({
    creationDate,
    maxDays,
    status,
  })

  const customerEmail = getCustomerEmail(
    clientProfileData,
    {
      userProfile,
      appkey,
      inputEmail: storeUserEmail,
    },
    {
      logger,
    }
  )

  const summary = await createOrdersToReturnSummary(order, customerEmail, {
    excludedCategories,
    returnRequestClient,
  })

  // Translate the products with the current binding; only for the storefront user
  return addLocalizedName(summary, catalogGQL)
}
