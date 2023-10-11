import type { OrderDetailResponse } from '@vtex/clients'

type RefundDetail =
  | {
      order: OrderDetailResponse
      amountToBeRefund: number
      amountRefunded?: never
    }
  | {
      order: OrderDetailResponse | { orderId: string }
      amountRefunded: number
      amountToBeRefund?: never
    }
  | {
      order: OrderDetailResponse | { orderId: string }
      amountToBeRefund?: never
      amountRefunded?: never
    }

type ActionRouteFunction = {
  GET: () => OrderRefundDetails & { action: string }
  CREATE: () => Promise<OrderRefundDetails & { action: string }>
  UPDATE: () => Promise<OrderRefundDetails & { action: string }>
}

const actionRoute = (
  { clients: { orderRefundDetails } }: Context,
  refundDetail: RefundDetail,
  refundData: OrderRefundDetails
): ActionRouteFunction => {
  const {
    order: { orderId },
  } = refundDetail

  const getAvailableAmounts = () => {
    return { ...refundData, action: 'GET' }
  }

  const updateAvailableAmounts = async () => {
    const { amountRefunded, amountToBeRefund } = refundDetail

    let { totalRefunded = 0, initialInvoicedAmount } = refundData

    let refundDateToUpdate: OrderRefundDetails = {
      ...refundData,
      lastUpdated: new Date(),
    }

    if (amountRefunded) {
      totalRefunded += amountRefunded

      if (totalRefunded > initialInvoicedAmount) {
        throw new Error("Can't refund more than the invoiced amount")
      }

      refundDateToUpdate = {
        ...refundData,
        totalRefunded,
        remainingRefundableAmount: initialInvoicedAmount - totalRefunded,
        amountToBeRefundedInProcess: 0,
        lastUpdated: new Date(),
      }
    }

    if (amountToBeRefund) {
      totalRefunded += amountToBeRefund

      if (totalRefunded > initialInvoicedAmount) {
        throw new Error("Can't refund more than the invoiced amount")
      }

      refundDateToUpdate = {
        ...refundData,
        amountToBeRefundedInProcess: amountToBeRefund,
        lastUpdated: new Date(),
      }
    }

    await orderRefundDetails.update(orderId, refundDateToUpdate)

    return { ...refundDateToUpdate, action: 'UPDATE' }
  }

  const createAvailableAmounts = async () => {
    const { order, amountToBeRefund } = refundDetail

    if (!refundData && amountToBeRefund && 'paymentData' in order) {
      const refundDataToCreate = {
        id: order.orderId,
        orderID: order.orderId,
        initialInvoicedAmount:
          order.paymentData?.transactions[0].payments[0].value,
        amountToBeRefundedInProcess: amountToBeRefund,
        lastUpdated: new Date(),
      }

      await orderRefundDetails.save(refundDataToCreate)

      return { ...refundDataToCreate, action: 'CREATE' }
    }

    return updateAvailableAmounts()
  }

  return {
    GET: () => getAvailableAmounts(),
    CREATE: () => createAvailableAmounts(),
    UPDATE: () => updateAvailableAmounts(),
  }
}

export const calculateAvailableAmountsService = async (
  ctx: Context,
  refundDetail: RefundDetail,
  action: 'GET' | 'CREATE' | 'UPDATE'
): Promise<any> => {
  try {
    const {
      clients: { orderRefundDetails },
    } = ctx

    const {
      order: { orderId },
    } = refundDetail

    const refundData = await orderRefundDetails.get(orderId, [
      'orderID',
      'initialInvoicedAmount',
      'amountToBeRefundedInProcess',
      'totalRefunded',
      'remainingRefundableAmount',
      'lastUpdated',
    ])

    const actionToResolve = actionRoute(ctx, refundDetail, refundData)
    const reponse = await actionToResolve[action]()

    console.info('reponse: ', reponse)

    return reponse
  } catch (error) {
    console.error(error)

    return 'error'
  }
}
