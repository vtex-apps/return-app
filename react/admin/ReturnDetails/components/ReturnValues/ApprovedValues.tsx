import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'

import { useReturnDetails } from '../../../hooks/useReturnDetails'

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
      <div className="w-100 flex flex-row-ns ba br3 b--muted-4 flex-column">
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
          <div>
            <div className="c-muted-2 f6">
              <FormattedMessage id="admin/return-app.return-request-details.refund-total.item-tax" />
            </div>
            <div className="w-100 mt2">
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency value={amountItemRefund / 100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns ">
          <div className="flex flex-row">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="admin/return-app.return-request-details.refund-total.restock-fee" />
              </div>
              <div className="f4 fw5 c-danger">
                <FormattedCurrency value={(totalRestockFee * -1) / 100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns ">
          <div className="flex flex-row">
            <div>
              <div className="c-muted-2 f6">
                <FormattedMessage id="admin/return-app.return-request-details.refund-total.shipping" />
              </div>
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency value={refundedShippingValue / 100} />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-column pa4 b--muted-4 flex-auto bb bb-0-ns br-ns">
          <div>
            <div className="c-muted-2 f6">
              <FormattedMessage id="admin/return-app.return-request-details.refund-total.total" />
            </div>
            <div className="w-100 mt2">
              <div className="f4 fw5 c-on-base">
                <FormattedCurrency value={invoiceValue / 100} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
