import React from 'react'
import { FormattedMessage } from 'react-intl'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { TotalWrapper } from './TotalWrapper'
import { TotalContainer } from './TotalContainer'

export const RequestedValues = () => {
  const { data } = useReturnDetails()

  if (!data) return null

  const { refundableAmountTotals, refundableAmount } = data.returnRequestDetails

  const totalRefundableItems =
    refundableAmountTotals.find(({ id }) => id === 'items')?.value ?? 0

  const totalRefundableTaxes =
    refundableAmountTotals.find(({ id }) => id === 'tax')?.value ?? 0

  const totalRefundableShipping =
    refundableAmountTotals.find(({ id }) => id === 'shipping')?.value ?? 0

  return (
    <div className="mb5">
      <h3>
        <FormattedMessage id="return-app.return-request-details.request-total.header" />
      </h3>
      <TotalContainer>
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.request-total.item-tax" />
          }
          value={totalRefundableItems + totalRefundableTaxes}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.request-total.shipping" />
          }
          value={totalRefundableShipping}
        />
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.request-total.total" />
          }
          value={refundableAmount}
        />
      </TotalContainer>
    </div>
  )
}
