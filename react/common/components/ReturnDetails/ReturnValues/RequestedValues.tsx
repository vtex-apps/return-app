import React from 'react'
import { FormattedMessage } from 'react-intl'
import { useCssHandles } from 'vtex.css-handles'

import { useReturnDetails } from '../../../hooks/useReturnDetails'
import { TotalWrapper } from './TotalWrapper'
import { TotalContainer } from './TotalContainer'

const CSS_HANDLES = ['requestedValuesContainer'] as const

export const RequestedValues = () => {
  const handles = useCssHandles(CSS_HANDLES)

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
    <div className={`${handles.requestedValuesContainer} mb5`}>
      <h3>
        <FormattedMessage id="return-app.return-request-details.request-total.header" />
      </h3>
      <TotalContainer>
        <TotalWrapper
          title={
            <FormattedMessage id="return-app.return-request-details.request-total.item-tax" />
          }
          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
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
