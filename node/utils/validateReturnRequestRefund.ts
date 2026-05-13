import type { ReturnRequest, ReturnAppSettings } from 'vtex.return-app'
import type { OrderDetailResponse } from '@vtex/clients'

import { orderDataStatsService } from '../services/orderDataStatsService'

export interface ReturnRequestValidationResult {
  valid: boolean
  message: string
}

interface ValidateReturnRequestRefundParams {
  currentReturnRequest: ReturnRequest
  order: OrderDetailResponse
  settings: ReturnAppSettings
  ctx: Context
}

export const validateReturnRequestRefund = async ({
  currentReturnRequest,
  order,
  settings,
  ctx,
}: ValidateReturnRequestRefundParams): Promise<ReturnRequestValidationResult> => {
  const { orderId, refundData } = currentReturnRequest

  const {
    clients: { returnRequestClient, adjustmentNoteClient, catalogGQL },
  } = ctx

  // If no refundData is provided, we can't validate per-item amounts
  if (!refundData) {
    return {
      valid: false,
      message:
        'Missing refundData. Cannot validate refund without refund data.',
    }
  }

  // If no items are provided in refundData, fail validation
  if (
    !refundData.items ||
    !Array.isArray(refundData.items) ||
    refundData.items.length === 0
  ) {
    return {
      valid: false,
      message:
        'Missing refundData.items. Cannot validate refund without item-level refund data.',
    }
  }

  // Get order stats
  const stats = await orderDataStatsService(order, orderId, {
    excludedCategories: settings.excludedCategories,
    returnRequestClient,
    adjustmentNoteClient,
    catalogGQL,
  })

  // Validate each item in refundData.items
  for (const item of refundData.items) {
    const { orderItemIndex, quantity, price, restockFee } = item

    const itemStats = stats.itemsStats[orderItemIndex]
    const amountAvailableForRefund = itemStats?.amountAvailableForRefund ?? 0

    // Calculate refund amount: price * quantity - restockFee
    const refundAmount = price * quantity - restockFee

    if (refundAmount > amountAvailableForRefund) {
      return {
        valid: false,
        message: `Amount to refund for item ${orderItemIndex} (${refundAmount}) exceeds available amount (${amountAvailableForRefund})`,
      }
    }
  }

  return {
    valid: true,
    message: 'Validation successful',
  }
}
