import type { Maybe, RefundDataInput, ReturnRequest } from 'odp.return-app'
import { UserInputError } from '@vtex/api'

export const createRefundData = ({
  requestId,
  refundData,
  requestItems,
  refundableShipping,
  additionalInfo,
  logger,
}: {
  requestId: string
  refundData?: Maybe<RefundDataInput>
  requestItems: ReturnRequest['items']
  refundableShipping: number
  additionalInfo?: string
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

  // Check if this is a Miscellaneous Refund (MF) return
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

  // For MF returns, ignore refundableAmount and only use refundAdditionalValue + refundShippingValue
  // For other refund types (RT and CO), use the standard calculation
  const isMFReturn = parsedAdditionalInfo.returnAction === 'MF'
  
  if (logger) {
    logger.info({
      message: 'Refund calculation details',
      requestId,
      isMFReturn,
      returnAction: parsedAdditionalInfo.returnAction,
      refundedItemsValue,
      refundedShippingValue,
      refundedAdditionalValue,
      refundableShipping,
    })
  }
  
  let invoiceValue: number
  if (isMFReturn) {
    // For MF returns, only use refundAdditionalValue + refundShippingValue
    invoiceValue = refundedAdditionalValue + refundedShippingValue
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
    invoiceValue = refundedItemsValue + refundedShippingValue + refundedAdditionalValue
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
