import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'

import { useReturnDetails } from '../../../hooks/useReturnDetails'

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
        <FormattedMessage id="admin/return-app.return-request-details.request-total.header" />
      </h3>
      <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
          <div>
            <div className="c-muted-2 f6">
              <FormattedMessage id="admin/return-app.return-request-details.request-total.item-tax" />
            </div>
            <div className="w-100 mt2">
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency
                  value={(totalRefundableItems + totalRefundableTaxes) / 100}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns ">
          <div className="flex flex-row">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="admin/return-app.return-request-details.request-total.shipping" />
              </div>
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency value={totalRefundableShipping / 100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
          <div>
            <div className="c-muted-2 f6">
              <FormattedMessage id="admin/return-app.return-request-details.request-total.total" />
            </div>
            <div className="w-100 mt2">
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency value={refundableAmount / 100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
