import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { TotalWrapper } from './TotalWrapper'
import { TotalContainer } from './TotalContainer'

const CSS_HANDLES = ['requestedValuesContainer'] as const

export const AvailablesAmountsToRefund = () => {
  const handles = useCssHandles(CSS_HANDLES)

  const { data } = useReturnDetails()

  if (!data) return null

  const availableAmounts = data.returnRequestDetails.availableAmountsToRefund

  const {
    amountToBeRefundedInProcess,
    initialInvoicedAmount,
    remainingRefundableAmount,
    totalRefunded,
    totalShippingCostRefunded,
    // remainingRefundableShippingCost,
  } = availableAmounts

  return (
    <div className={`${handles.requestedValuesContainer} mb5`}>
      <h3>
        <FormattedMessage id="return-app.return-request-details.available-amounts.header" />
      </h3>
      <TotalContainer>
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.available-amounts.total-order" />
          }
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          value={initialInvoicedAmount || 0}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.available-amounts.remaining-amount" />
          }
          value={remainingRefundableAmount || 0}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.available-amounts.amount-to-refund" />
          }
          value={amountToBeRefundedInProcess || 0}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.available-amounts.total-shipping-refunded" />
          }
          value={totalShippingCostRefunded || 0}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.available-amounts.total-refunded" />
          }
          value={totalRefunded || 0}
        />
      </TotalContainer>
    </div>
  )
}
