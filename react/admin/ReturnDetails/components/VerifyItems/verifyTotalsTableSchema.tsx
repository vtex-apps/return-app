import type { ChangeEvent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import { FormattedCurrency } from 'vtex.format-currency'
import { InputCurrency } from 'vtex.styleguide'

import { AlignItemRight } from '../AlignItemRight'

export const verifyTotalsTableSchema = (
  handleShippingChanges: (shippingToRefundInput: number) => void
) => ({
  properties: {
    refundableShipping: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.refundable-shipping" />
      ),
      headerRight: true,
      cellRenderer: function RefundableShippingHeader({
        cellData,
      }: {
        cellData: number
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    shippingToRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.shipping-to-refund" />
      ),
      headerRight: true,
      cellRenderer: function ShippingToRefundHeader({
        cellData,
        rowData,
      }: {
        cellData: number
        rowData: { refundableShipping: number }
      }) {
        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const { refundableShipping } = rowData
          const { value } = event.target
          const shippingToRefundInput = Number(value)

          const shippingToRefundParsed = Number.isNaN(shippingToRefundInput)
            ? 0
            : shippingToRefundInput * 100

          const shippingToRefundChecked =
            shippingToRefundParsed > refundableShipping
              ? refundableShipping
              : shippingToRefundParsed

          handleShippingChanges(shippingToRefundChecked)
        }

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <InputCurrency
              value={cellData / 100}
              currencyCode="EUR"
              locale="es-ES"
              onChange={handleChange}
            />
          </AlignItemRight>
        )
      },
    },
    totalRefundItems: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund-items" />
      ),
      headerRight: true,
      cellRenderer: function TotalRefundItemsHeader({
        cellData,
      }: {
        cellData: number
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total-refund" />
      ),
      headerRight: true,
      cellRenderer: function TotalRefundHeader({
        cellData,
      }: {
        cellData: number
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
  },
})
