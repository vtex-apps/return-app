import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { TotalWrapper } from './TotalWrapper'
import { TotalContainer } from './TotalContainer'

const CSS_HANDLES = ['approvedValuesContainer'] as const

export const ApprovedValues = () => {
  const handles = useCssHandles(CSS_HANDLES)
  const { data } = useReturnDetails()
  const { refundData, status } = data?.returnRequestDetails ?? {}

  if (!data || !refundData) return null

  const { items, invoiceValue, refundedShippingValue } = refundData

  const amountItemRefund = items.reduce((total, item) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return total + item.price * item.quantity
  }, 0)

  const totalRestockFee = items.reduce((total, item) => {
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return total + item.restockFee
  }, 0)

  return (
    <div className={`${handles.approvedValuesContainer} mb5`}>
      {status === 'amountRefunded' ? (
        <h3>
          <FormattedMessage id="return-app.return-request-details.refund-total.header-refunded" />
        </h3>
      ) : null}
      {status === 'packageVerified' ? (
        <h3>
          <FormattedMessage id="return-app.return-request-details.refund-total.header-approved" />
        </h3>
      ) : null}
      <TotalContainer>
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.refund-total.item-tax" />
          }
          value={amountItemRefund}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.refund-total.restock-fee" />
          }
          value={totalRestockFee === 0 ? 0 : totalRestockFee * -1}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.refund-total.shipping" />
          }
          value={refundedShippingValue}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.refund-total.total" />
          }
          value={invoiceValue}
        />
      </TotalContainer>
    </div>
  )
}
