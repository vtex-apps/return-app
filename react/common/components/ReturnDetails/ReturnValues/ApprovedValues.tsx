import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { TotalWrapper } from './TotalWrapper'
import { TotalContainer } from './TotalContainer'

export const ApprovedValues = () => {
  const { data } = useReturnDetails()
  const { refundData, status } = data?.returnRequestDetails ?? {}

  if (!data || !refundData) return null

  const { items, invoiceValue, refundedShippingValue } = refundData

  const amountItemRefund = items.reduce((total, item) => {
    return total + item.price * item.quantity
  }, 0)

  const totalRestockFee = items.reduce((total, item) => {
    return total + item.restockFee
  }, 0)

  return (
    <div className="mb5">
      {status === 'amountRefunded' ? (
        <h3>
          <FormattedMessage id="admin/return-app.return-request-details.refund-total.header-refunded" />
        </h3>
      ) : null}
      {status === 'packageVerified' ? (
        <h3>
          <FormattedMessage id="admin/return-app.return-request-details.refund-total.header-approved" />
        </h3>
      ) : null}
      <TotalContainer>
        <TotalWrapper
          title={
            <FormattedMessage id="admin/return-app.return-request-details.refund-total.item-tax" />
          }
          value={amountItemRefund}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="admin/return-app.return-request-details.refund-total.restock-fee" />
          }
          value={totalRestockFee * -1}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="admin/return-app.return-request-details.refund-total.shipping" />
          }
          value={refundedShippingValue}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="admin/return-app.return-request-details.refund-total.total" />
          }
          value={invoiceValue}
        />
      </TotalContainer>
    </div>
  )
}
