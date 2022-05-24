import type { Status, Maybe, ReturnRequest, GiftCard } from 'vtex.return-app'

import type { OMSCustom } from '../clients/oms'
import { canRefundCard } from './canRefundCard'

interface HandleRefundProps {
  currentStatus: Status
  previousStatus?: Status
  refundPaymentData: ReturnRequest['refundPaymentData']
  orderId: string
  clients: {
    omsClient: OMSCustom
  }
}

export const handleRefund = async ({
  currentStatus,
  previousStatus,
  refundPaymentData,
  orderId,
  clients,
}: HandleRefundProps): Promise<Maybe<{ giftCard: GiftCard }>> => {
  // To avoid handling the amountRefunded after it has been already done, we check the previous status.
  // If the current status is already amountRefunded, it means the refund has already been done and we don't need to do it again.
  const shouldHandle =
    currentStatus === 'amountRefunded' && previousStatus !== 'amountRefunded'

  if (!shouldHandle) {
    // do something
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
    // handle credit card''
    return null
  }

  return null
}
