import type { ItemTotal, OrderDetailResponse } from '@vtex/clients'

import { cleanObject } from '../utils'

type RefundDetail =
  | {
      order: OrderDetailResponse
      amountToBeRefund?: number
      amountRefunded?: number
      shippingCostToBeRefund?: number
      shippingCostRefunded?: number
    }
  | { [key: string]: any }

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
    order: { orderId, value },
  } = refundDetail

  const getAvailableAmounts = () => {
    const availableAmounts = refundData || {
      id: orderId,
      orderID: orderId,
      initialInvoicedAmount: value,
      totalRefunded: 0,
      amountToBeRefundedInProcess: 0,
      remainingRefundableAmount: value,
      lastUpdated: new Date(),
    }

    return { ...availableAmounts, action: 'GET' }
  }

  const updateAvailableAmounts = async () => {
    let { amountRefunded, amountToBeRefund, shippingCostRefunded } =
      refundDetail

    let {
      totalRefunded = 0,
      initialInvoicedAmount,
      amountToBeRefundedInProcess = 0,
      totalShippingCostRefunded,
      remainingRefundableShippingCost,
      remainingRefundableAmount,
    } = refundData

    let refundDateToUpdate: OrderRefundDetails = {
      ...refundData,
      lastUpdated: new Date(),
    }

    if (shippingCostRefunded) {
      refundDateToUpdate = {
        ...refundData,
        shippingCostToBeRefundedInProcess: 0,
        totalShippingCostRefunded:
          (totalShippingCostRefunded ?? 0) + Number(shippingCostRefunded),
        remainingRefundableShippingCost: Math.abs(
          (remainingRefundableShippingCost ?? 0) - Number(shippingCostRefunded)
        ),
        lastUpdated: new Date(),
      }
    }

    if (amountRefunded) {
      const possibleToRefund = totalRefunded + Number(amountRefunded)

      if (possibleToRefund > initialInvoicedAmount) {
        amountRefunded = amountToBeRefundedInProcess
      }

      if (
        amountToBeRefundedInProcess > 0 &&
        amountToBeRefundedInProcess - amountRefunded >= 0
      ) {
        amountToBeRefundedInProcess -= amountRefunded
      } else if (amountToBeRefundedInProcess - amountRefunded <= 0) {
        amountToBeRefundedInProcess = 0
      }

      totalRefunded += Number(amountRefunded)
      refundDateToUpdate = {
        ...refundData,
        totalRefunded,
        remainingRefundableAmount: initialInvoicedAmount - totalRefunded,
        amountToBeRefundedInProcess,
        lastUpdated: new Date(),
      }
    }

    if (amountToBeRefund) {
      totalRefunded += Number(amountToBeRefund)

      if (totalRefunded > initialInvoicedAmount) {
        amountToBeRefundedInProcess = remainingRefundableAmount ?? 0
      } else {
        amountToBeRefundedInProcess += Number(amountToBeRefund)
      }

      refundDateToUpdate = {
        ...refundData,
        amountToBeRefundedInProcess,
        lastUpdated: new Date(),
      }
    }

    refundDateToUpdate = cleanObject(refundDateToUpdate)

    await orderRefundDetails.update(orderId, refundDateToUpdate)

    return { ...refundDateToUpdate, amountRefunded, action: 'UPDATE' }
  }

  const createAvailableAmounts = async () => {
    const { order, amountToBeRefund, amountRefunded } = refundDetail

    if (
      (amountToBeRefund && amountToBeRefund > order.value) ||
      (amountRefunded && amountRefunded > order.value)
    ) {
      throw new Error("Can't refund more than the invoiced amount")
    } else {
      if (!refundData && amountToBeRefund) {
        const initialShippingCost = order.totals.find(
          (total: ItemTotal) => total.id === 'Shipping'
        ).value

        const refundDataToCreate = {
          id: order.orderId,
          orderID: order.orderId,
          initialInvoicedAmount: order.value,
          remainingRefundableAmount: order.value,
          amountToBeRefundedInProcess: amountToBeRefund,
          initialShippingCost,
          shippingCostToBeRefundedInProcess: initialShippingCost,
          remainingRefundableShippingCost: initialShippingCost,
          lastUpdated: new Date(),
        }

        await orderRefundDetails.save(refundDataToCreate)

        return { ...refundDataToCreate, action: 'CREATE' }
      }

      if (!refundData && amountRefunded) {
        const refundDataToCreate = {
          id: order.orderId,
          orderID: order.orderId,
          initialInvoicedAmount: order.value,
          totalRefunded: Number(amountRefunded),
          amountToBeRefundedInProcess: 0,
          remainingRefundableAmount: order.value - amountRefunded,
          lastUpdated: new Date(),
        }

        await orderRefundDetails.save(refundDataToCreate)

        return { ...refundDataToCreate, action: 'CREATE' }
      }

      return updateAvailableAmounts()
    }
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
      'initialShippingCost',
      'shippingCostToBeRefundedInProcess',
      'totalShippingCostRefunded',
      'remainingRefundableShippingCost',
    ])

    const actionToResolve = actionRoute(ctx, refundDetail, refundData)
    const reponse = await actionToResolve[action]()

    return reponse
  } catch (error) {
    throw new Error(error.message)
  }
}
