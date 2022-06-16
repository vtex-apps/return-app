import type { ChangeEvent } from 'react'
import React from 'react'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItem } from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'
import { NumericStepper, InputCurrency } from 'vtex.styleguide'

import type { RefundItemMap, UpdateItemsChange } from './VerifyItemsPage'
import { AlignItemRight } from '../AlignItemRight'
import { ProductActionStatus } from './ProductActionStatus'

export const verifyItemsTableSchema = (
  refundItemMap: RefundItemMap,
  updateChanges: UpdateItemsChange
) => ({
  properties: {
    name: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.product" />
      ),
      minWidth: 320,
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.price" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function SellingPriceHeader({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['sellingPrice']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    tax: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.tax" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function TaxHeader({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['tax']
      }) {
        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={cellData / 100} />
          </AlignItemRight>
        )
      },
    },
    totalPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total" />
      ),
      width: 90,
      headerRight: true,
      cellRenderer: function TotalPriceHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency value={(sellingPrice + tax) / 100} />
          </AlignItemRight>
        )
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.quantity" />
      ),
      width: 80,
      cellRenderer: function QuantityHeader({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['quantity']
      }) {
        return <span className="w-100 flex justify-center">{cellData}</span>
      },
    },
    verified: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.verified" />
      ),
      width: 160,
      cellRenderer: function VerifiedPQuantityHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { orderItemIndex, quantity } = rowData

        const handleChange = ({ value }: { value: number }) => {
          updateChanges({ quantity: value, orderItemIndex })
        }

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        return (
          <NumericStepper
            value={selectedQuantity}
            maxValue={quantity}
            onChange={handleChange}
          />
        )
      },
    },
    restockFee: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.restock-fee" />
      ),
      width: 150,
      cellRenderer: function RestockFeeHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const restockFee = refundItem?.restockFee ?? 0
        const selectedQuantity = refundItem?.quantity ?? 0

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target
          const restockFeeInput = Number(value)

          const restockFeeInputParsed = Number.isNaN(restockFeeInput)
            ? 0
            : restockFeeInput

          const restockFeeCents = parseFloat(
            (restockFeeInputParsed * 100).toFixed(0)
          )

          const maxRestockFee = (sellingPrice + tax) * selectedQuantity

          const restockFeeChecked =
            restockFeeCents > maxRestockFee ? maxRestockFee : restockFeeCents

          updateChanges({ restockFee: restockFeeChecked, orderItemIndex })
        }

        // TODO: Refactor this with right currency symbol and locale
        return (
          <InputCurrency
            value={restockFee / 100}
            currencyCode="EUR"
            locale="es-ES"
            onChange={handleChange}
            disabled={selectedQuantity === 0}
          />
        )
      },
    },
    totalRefund: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.refund-product-total" />
      ),
      headerRight: true,
      width: 90,
      cellRenderer: function TotalProductRefundHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const selectedQuantity = refundItem?.quantity ?? 0
        const restockFee = refundItem?.restockFee ?? 0

        // TODO: Refactor this with right currency symbol and locale
        return (
          <AlignItemRight>
            <FormattedCurrency
              value={
                ((sellingPrice + tax) * selectedQuantity - restockFee) / 100
              }
            />
          </AlignItemRight>
        )
      },
    },
    action: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.action" />
      ),
      cellRenderer: function VerifyActionHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
      }) {
        const { quantity, orderItemIndex } = rowData

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        return (
          <ProductActionStatus
            quantity={quantity}
            selectedQuantity={selectedQuantity}
          />
        )
      },
    },
  },
})
