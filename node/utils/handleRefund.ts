import type { Status, Maybe, ReturnRequest, GiftCard } from 'vtex.return-app'
import { ResolverError } from '@vtex/api'

import type { OMSCustom } from '../clients/oms'
import { canRefundCard } from './canRefundCard'

interface HandleRefundProps {
  currentStatus: Status
  previousStatus?: Status
  refundPaymentData: ReturnRequest['refundPaymentData']
  orderId: string
  createdAt: string
  refundInvoice: ReturnRequest['refundData']
  clients: {
    omsClient: OMSCustom
  }
}

export const handleRefund = async ({
  currentStatus,
  previousStatus,
  refundPaymentData,
  orderId,
  createdAt,
  refundInvoice,
  clients,
}: HandleRefundProps): Promise<Maybe<{ giftCard: GiftCard }>> => {
  // To avoid handling the amountRefunded after it has been already done, we check the previous status.
  // If the current status is already amountRefunded, it means the refund has already been done and we don't need to do it again.
  const shouldHandle =
    currentStatus === 'amountRefunded' &&
    previousStatus !== 'amountRefunded' &&
    refundInvoice

  if (!shouldHandle) {
    return null
  }

  const { omsClient } = clients

  const { refundPaymentMethod } = refundPaymentData ?? {}

  if (refundPaymentMethod === 'giftCard') {
    // handle gift card

    return { giftCard: { id: 'id', code: 'code' } }
  }

  const order = await omsClient.order(orderId)

  const refundCard =
    refundPaymentMethod === 'card' ||
    (refundPaymentMethod === 'sameAsPurchase' &&
      canRefundCard(order.paymentData.transactions))

  if (refundCard) {
    try {
      await omsClient.createInvoice(orderId, {
        type: 'Input',
        issuanceDate: createdAt,
        invoiceNumber: refundInvoice?.invoiceNumber as string,
        invoiceValue: refundInvoice?.invoiceValue as number,
        items:
          refundInvoice?.items?.map((item) => {
            return {
              id: item.id as string,
              price: (item.price as number) - (item.restockFee as number),
              quantity: item.quantity as number,
            }
          }) ?? [],
      })

      return null
    } catch (error) {
      throw new ResolverError('Error creating refund invoice')
    }
  }

  return null
}
