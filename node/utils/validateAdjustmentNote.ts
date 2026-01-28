import type {
  AdjustmentNoteInput,
  AdjustmentNote,
  ReturnAppSettings,
} from 'odp.return-app'
import type { OrderDetailResponse } from '@vtex/clients'

import { orderDataStatsService } from '../services/orderDataStatsService'

export interface AdjustmentNoteValidationResult {
  valid: boolean
  message: string
}

interface ValidateAdjustmentNoteCreationParams {
  adjustmentNote: AdjustmentNoteInput
  order: OrderDetailResponse
  settings: ReturnAppSettings
  ctx: Context
}

export const validateAdjustmentNoteCreation = async ({
  adjustmentNote,
  order,
  settings,
  ctx,
}: ValidateAdjustmentNoteCreationParams): Promise<AdjustmentNoteValidationResult> => {
  const { orderId } = adjustmentNote
  const { additionalInfo } = adjustmentNote
  const refundType = (adjustmentNote as any).refundType as
    | 'DeliveryFee'
    | undefined

  const {
    clients: { returnRequestClient, adjustmentNoteClient, catalogGQL },
  } = ctx

  // Parse additionalInfo to get items (if provided)
  let parsedAdditionalInfo: {
    items?: Array<{ orderItemIndex: number; amount: number }>
  } | null = null

  if (additionalInfo) {
    try {
      parsedAdditionalInfo = JSON.parse(additionalInfo)
    } catch {
      return {
        valid: false,
        message: 'Invalid additionalInfo format. Expected valid JSON.',
      }
    }
  }

  // Check if we have items available for validation
  const hasItems =
    parsedAdditionalInfo?.items &&
    Array.isArray(parsedAdditionalInfo.items) &&
    parsedAdditionalInfo.items.length > 0

  // If no items are available, fail validation unless refundType is DeliveryFee
  if (!hasItems) {
    if (refundType === 'DeliveryFee') {
      const stats = await orderDataStatsService(order, orderId, {
        excludedCategories: settings.excludedCategories,
        returnRequestClient,
        adjustmentNoteClient,
        catalogGQL,
      })

      const { requestAmount } = adjustmentNote

      if (typeof requestAmount !== 'number' || requestAmount < 0) {
        return {
          valid: false,
          message: `Invalid requestAmount: ${requestAmount}. Must be a non-negative number`,
        }
      }

      // Account for pending adjustment notes that haven't been refunded yet
      const effectiveShippingAvailable =
        stats.shippingAvailableForReturn - stats.shippingToRefund

      if (requestAmount > effectiveShippingAvailable) {
        return {
          valid: false,
          message: `Shipping amount to refund (${requestAmount}) exceeds available amount (${effectiveShippingAvailable}). Already pending: ${stats.shippingToRefund}, Total available: ${stats.shippingAvailableForReturn}`,
        }
      }

      return {
        valid: true,
        message: 'Validation successful',
      }
    }

    return {
      valid: false,
      message:
        'Missing additionalInfo or items. Cannot validate refund without item-level data unless refundType is DeliveryFee.',
    }
  }

  // Get order stats
  const stats = await orderDataStatsService(order, orderId, {
    excludedCategories: settings.excludedCategories,
    returnRequestClient,
    adjustmentNoteClient,
    catalogGQL,
  })

  // Validate each item
  // At this point, we know parsedAdditionalInfo is not null and has items due to hasItems check above
  if (!parsedAdditionalInfo || !parsedAdditionalInfo.items) {
    return {
      valid: false,
      message: 'Unexpected error: items not found in parsed additionalInfo',
    }
  }

  for (const item of parsedAdditionalInfo.items) {
    const { orderItemIndex, amount } = item

    if (
      typeof orderItemIndex !== 'number' ||
      orderItemIndex < 0 ||
      orderItemIndex >= stats.itemsStats.length
    ) {
      return {
        valid: false,
        message: `Invalid orderItemIndex: ${orderItemIndex}. Must be between 0 and ${
          stats.itemsStats.length - 1
        }`,
      }
    }

    if (typeof amount !== 'number' || amount < 0) {
      return {
        valid: false,
        message: `Invalid amount for item ${orderItemIndex}: ${amount}. Must be a non-negative number`,
      }
    }

    const itemStats = stats.itemsStats[orderItemIndex]
    const quantityAvailableForReturn =
      itemStats?.quantityAvailableForReturn ?? 0

    const amountAvailableForRefund = itemStats?.amountAvailableForRefund ?? 0
    const amountToRefund = itemStats?.amountToRefund ?? 0

    // Block creation if there are no items available for return
    if (quantityAvailableForReturn <= 0) {
      return {
        valid: false,
        message: `Cannot create adjustment note for item ${orderItemIndex}: no items available for return`,
      }
    }

    // Account for pending adjustment notes that haven't been refunded yet
    const effectiveAmountAvailable = amountAvailableForRefund - amountToRefund

    if (amount > effectiveAmountAvailable) {
      return {
        valid: false,
        message: `Amount to refund for item ${orderItemIndex} (${amount}) exceeds available amount (${effectiveAmountAvailable}). Already pending: ${amountToRefund}, Total available: ${amountAvailableForRefund}`,
      }
    }
  }

  return {
    valid: true,
    message: 'Validation successful',
  }
}

interface ValidateAdjustmentNoteRefundParams {
  currentAdjustmentNote: AdjustmentNote
  order: OrderDetailResponse
  settings: ReturnAppSettings
  ctx: Context
}

export const validateAdjustmentNoteRefund = async ({
  currentAdjustmentNote,
  order,
  settings,
  ctx,
}: ValidateAdjustmentNoteRefundParams): Promise<AdjustmentNoteValidationResult> => {
  const { orderId, additionalInfo } = currentAdjustmentNote
  const refundType = (currentAdjustmentNote as any).refundType as
    | 'DeliveryFee'
    | undefined

  const {
    clients: { returnRequestClient, adjustmentNoteClient, catalogGQL },
  } = ctx

  // Parse additionalInfo to get items (if provided)
  let parsedAdditionalInfo: {
    items?: Array<{ orderItemIndex: number; amount: number }>
  } | null = null

  if (additionalInfo) {
    try {
      parsedAdditionalInfo = JSON.parse(additionalInfo)
    } catch {
      return {
        valid: false,
        message: 'Invalid additionalInfo format. Expected valid JSON.',
      }
    }
  }

  // Check if we have items available for validation
  const hasItems =
    parsedAdditionalInfo?.items &&
    Array.isArray(parsedAdditionalInfo.items) &&
    parsedAdditionalInfo.items.length > 0

  // If no items are available, fail validation unless refundType is DeliveryFee
  if (!hasItems) {
    if (refundType === 'DeliveryFee') {
      const stats = await orderDataStatsService(order, orderId, {
        excludedCategories: settings.excludedCategories,
        returnRequestClient,
        adjustmentNoteClient,
        catalogGQL,
      })

      const { requestAmount } = currentAdjustmentNote

      if (typeof requestAmount !== 'number' || requestAmount < 0) {
        return {
          valid: false,
          message: `Invalid requestAmount: ${requestAmount}. Must be a non-negative number`,
        }
      }

      // When refunding, validate that requestAmount doesn't exceed what's available
      // shippingAvailableForReturn = orderShippingTotal - shippingRefunded (doesn't account for pending)
      // shippingToRefund includes all pending notes (including current note)
      // To check if current note's amount is valid, we need: requestAmount <= shippingAvailableForReturn
      // This ensures we don't exceed what's available after accounting for already refunded amounts
      // Note: This doesn't prevent other pending notes from also being refunded, but they'll be validated separately
      if (requestAmount > stats.shippingAvailableForReturn) {
        return {
          valid: false,
          message: `Shipping amount to refund (${requestAmount}) exceeds available amount (${stats.shippingAvailableForReturn}). Already refunded: ${stats.shippingRefunded}, Pending: ${stats.shippingToRefund}`,
        }
      }

      return {
        valid: true,
        message: 'Validation successful',
      }
    }

    return {
      valid: false,
      message:
        'Missing additionalInfo or items. Cannot validate refund without item-level data unless refundType is DeliveryFee.',
    }
  }

  // Get order stats
  const stats = await orderDataStatsService(order, orderId, {
    excludedCategories: settings.excludedCategories,
    returnRequestClient,
    adjustmentNoteClient,
    catalogGQL,
  })

  // Validate each item
  // At this point, we know parsedAdditionalInfo is not null and has items due to hasItems check above
  if (!parsedAdditionalInfo || !parsedAdditionalInfo.items) {
    return {
      valid: false,
      message: 'Unexpected error: items not found in parsed additionalInfo',
    }
  }

  for (const item of parsedAdditionalInfo.items) {
    const { orderItemIndex, amount } = item

    if (
      typeof orderItemIndex !== 'number' ||
      orderItemIndex < 0 ||
      orderItemIndex >= stats.itemsStats.length
    ) {
      return {
        valid: false,
        message: `Invalid orderItemIndex: ${orderItemIndex}. Must be between 0 and ${
          stats.itemsStats.length - 1
        }`,
      }
    }

    if (typeof amount !== 'number' || amount < 0) {
      return {
        valid: false,
        message: `Invalid amount for item ${orderItemIndex}: ${amount}. Must be a non-negative number`,
      }
    }

    const itemStats = stats.itemsStats[orderItemIndex]
    const quantityAvailableForReturn =
      itemStats?.quantityAvailableForReturn ?? 0

    const amountAvailableForRefund = itemStats?.amountAvailableForRefund ?? 0

    // Block creation if there are no items available for return
    if (quantityAvailableForReturn <= 0) {
      return {
        valid: false,
        message: `Cannot refund adjustment note for item ${orderItemIndex}: no items available for return`,
      }
    }

    if (amount > amountAvailableForRefund) {
      return {
        valid: false,
        message: `Amount to refund for item ${orderItemIndex} (${amount}) exceeds available amount (${amountAvailableForRefund})`,
      }
    }
  }

  return {
    valid: true,
    message: 'Validation successful',
  }
}
