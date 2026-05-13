import type {
  Maybe,
  RefundDataInput,
  ReturnRequest,
  AdjustmentNote,
} from 'vtex.return-app'
import { UserInputError } from '@vtex/api'

export const createRefundData = ({
  requestId,
  refundData,
  requestItems,
  refundableShipping,
  additionalInfo,
  returnType,
  logger,
}: {
  requestId: string
  refundData?: Maybe<RefundDataInput>
  requestItems: ReturnRequest['items']
  refundableShipping: number
  additionalInfo?: string
  returnType?: string | null
  logger?: any
}): ReturnRequest['refundData'] => {
  const requestItemsMap = new Map<number, ReturnRequest['items'][number]>()

  for (const requestedItem of requestItems ?? []) {
    requestItemsMap.set(requestedItem.orderItemIndex as number, requestedItem)
  }

  const items = []

  for (const refundItem of refundData?.items ?? []) {
    if (refundItem.quantity === 0) continue
    const requestedItem = requestItemsMap.get(refundItem.orderItemIndex)

    if (!requestedItem) {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} isn't in the return request`
      )
    }

    if (requestedItem.quantity < refundItem.quantity) {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} has a quantity of ${requestedItem.quantity} but ${refundItem.quantity} was requested to return`
      )
    }

    const { orderItemIndex, sellingPrice, tax, id } = requestedItem

    if (typeof refundItem.restockFee !== 'number') {
      throw new UserInputError(
        `Item index ${refundItem.orderItemIndex} has a invalid restockFee. It must be a number. Pass 0 if there is no restock fee.`
      )
    }

    items.push({
      orderItemIndex,
      id,
      price: (Number(sellingPrice) ?? 0) + (Number(tax) ?? 0),
      quantity: refundItem.quantity,
      restockFee: refundItem.restockFee,
    })
  }

  const refundedItemsValue = items.reduce(
    (total, item) => total + (item.price * item.quantity - item.restockFee),
    0
  )

  if (typeof refundData?.refundedShippingValue !== 'number') {
    throw new UserInputError(
      'Missing refundedShippingValue or not a valid number'
    )
  }

  if (typeof refundData?.refundedAdditionalValue !== 'number') {
    throw new UserInputError(
      'Missing refundedAdditionalValue or not a valid number'
    )
  }

  const refundedShippingValue = refundData?.refundedShippingValue ?? 0
  const refundedAdditionalValue = refundData?.refundedAdditionalValue ?? 0

  if (refundableShipping < refundedShippingValue) {
    throw new UserInputError(
      `Refundable shipping value (${refundableShipping}) is less than the shipping value sent (${refundedShippingValue})`
    )
  }

  // Parse additionalInfo for legacy `returnAction` (e.g. MF) used in refund math
  let parsedAdditionalInfo: any = {}

  if (additionalInfo) {
    try {
      parsedAdditionalInfo = JSON.parse(additionalInfo)
      if (logger) {
        logger.info({
          message: 'Parsed additionalInfo successfully',
          requestId,
          parsedAdditionalInfo,
        })
      }
    } catch (error) {
      if (logger) {
        logger.error({
          message: 'Failed to parse additionalInfo',
          requestId,
          additionalInfo,
          error: error.message,
        })
      }
      // If parsing fails, continue with empty object
    }
  }

  const usesShippingAndAdditionalOnly =
    parsedAdditionalInfo.returnAction === 'MF' ||
    returnType === 'notDeliveryReturn'

  if (logger) {
    logger.info({
      message: 'Refund calculation details',
      requestId,
      usesShippingAndAdditionalOnly,
      returnAction: parsedAdditionalInfo.returnAction,
      returnType,
      refundedItemsValue,
      refundedShippingValue,
      refundedAdditionalValue,
      refundableShipping,
    })
  }

  let invoiceValue: number

  if (usesShippingAndAdditionalOnly) {
    // Shipping + additional only (notDeliveryReturn)
    invoiceValue =
      (refundedAdditionalValue as number) + (refundedShippingValue as number)
    if (logger) {
      logger.info({
        message: 'MF return calculation',
        requestId,
        invoiceValue,
        calculation: `${refundedAdditionalValue} + ${refundedShippingValue} = ${invoiceValue}`,
      })
    }
  } else {
    // For other return types, use the standard calculation
    invoiceValue =
      (refundedItemsValue as number) +
      (refundedShippingValue as number) +
      (refundedAdditionalValue as number)
    if (logger) {
      logger.info({
        message: 'Standard return calculation',
        requestId,
        invoiceValue,
        calculation: `${refundedItemsValue} + ${refundedShippingValue} + ${refundedAdditionalValue} = ${invoiceValue}`,
      })
    }
  }

  return {
    // invoiceNumber has to match the requestId.
    // This values is used to filter the invoices created via Return app when calculating the items available to be returned.
    invoiceNumber: requestId,
    invoiceValue,
    refundedItemsValue,
    refundedShippingValue,
    refundedAdditionalValue,
    items,
  }
}

export const createAdjustmentRefundData = ({
  sequenceNumber,
  requestAmount,
  authorizedAmount,
  refundValue,
}: {
  sequenceNumber: number
  requestAmount: number
  authorizedAmount: number
  refundValue: number
  additionalInfo?: string
  logger?: any
}): AdjustmentNote['transactionData'] => {
  if (requestAmount < refundValue) {
    throw new UserInputError(
      `Requested value (${requestAmount}) is less than the value sent (${refundValue})`
    )
  }

  if (authorizedAmount < refundValue) {
    throw new UserInputError(
      `Authorized value (${authorizedAmount}) is less than the value sent (${refundValue})`
    )
  }

  const invoiceValue = refundValue

  return {
    // invoiceNumber has to match the sequenceNumber.
    invoiceNumber: `CN-${sequenceNumber}`,
    invoiceValue,
  }
}
