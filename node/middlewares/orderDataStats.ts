import { ResolverError } from '@vtex/api'

import { orderDataStatsService } from '../services/orderDataStatsService'
import { CommonLogger } from '../utils/commonLogger'
import { SETTINGS_PATH } from '../utils/constants'

export async function orderDataStats(ctx: Context) {
  const {
    vtex: {
      route: {
        params: { orderId },
      },
    },
    clients: {
      oms,
      returnRequestClient,
      adjustmentNoteClient,
      catalogGQL,
      appSettings,
    },
  } = ctx

  if (!orderId || typeof orderId !== 'string') {
    throw new ResolverError('Missing orderId in path params', 400)
  }

  CommonLogger.logApiOperation(
    ctx,
    'orderDataStats.started',
    {
      orderId,
    },
    {
      file: 'middlewares/orderDataStats.ts',
      function: 'orderDataStats',
    }
  )

  const settingsPromise = appSettings.get(SETTINGS_PATH, true)

  const [order, settings] = await Promise.all([
    // Second argument is kept for backward compatibility with custom OMS clients
    oms.order(orderId as string),
    settingsPromise,
  ])

  if (!settings) {
    throw new ResolverError('Return App settings is not configured', 500)
  }

  const { excludedCategories } = settings

  const stats = await orderDataStatsService(order, orderId, {
    excludedCategories,
    returnRequestClient,
    adjustmentNoteClient,
    catalogGQL,
  })

  CommonLogger.logApiOperation(
    ctx,
    'orderDataStats.completed',
    {
      orderId,
      itemsCount: stats.itemsStats.length,
    },
    {
      file: 'middlewares/orderDataStats.ts',
      function: 'orderDataStats',
    }
  )

  ctx.body = {
    orderId,
    itemsReturns: stats.itemsStats,
    shippingRefunded: stats.shippingRefunded,
    shippingToRefund: stats.shippingToRefund,
    shippingAvailableForRefund: stats.shippingAvailableForRefund,
  }
  ctx.status = 200
}
