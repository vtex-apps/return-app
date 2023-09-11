import type { ChangeEvent } from 'react'
import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import { InputCurrency } from 'vtex.styleguide'

import type { CultureInfoData } from '../../../../../typings/ReturnRequest'
import { AlignItemRight } from '../AlignItemRight'

export const verifyTotalsTableSchema = (
  handleShippingChanges: (shippingToRefundInput: number) => void,
  cultureInfoData: CultureInfoData
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
        return (
          <AlignItemRight>
            <FormattedNumber
              value={cellData / 100}
              style="currency"
              currency={cultureInfoData.currencyCode}
            />
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

        return (
          <AlignItemRight>
            <InputCurrency
              value={cellData / 100}
              currencyCode={cultureInfoData.currencyCode}
              locale={cultureInfoData.locale}
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
        return (
          <AlignItemRight>
            <FormattedNumber
              value={cellData / 100}
              style="currency"
              currency={cultureInfoData.currencyCode}
            />
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
        return (
          <AlignItemRight>
            <FormattedNumber
              value={cellData / 100}
              style="currency"
              currency={cultureInfoData.currencyCode}
            />
          </AlignItemRight>
        )
      },
    },
  },
})
