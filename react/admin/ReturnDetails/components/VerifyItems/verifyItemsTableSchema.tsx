import type { ChangeEvent } from 'react'
import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'
import type { ReturnRequestItem, CultureInfoData } from '../../../../../typings/ReturnRequest'
import { NumericStepper, InputCurrency } from 'vtex.styleguide'

import type { RefundItemMap, UpdateItemsChange } from './VerifyItemsPage'
import { AlignItemRight } from '../AlignItemRight'
import { ProductActionStatus } from './ProductActionStatus'

export const verifyItemsTableSchema = (
  refundItemMap: RefundItemMap,
  updateChanges: UpdateItemsChange,
  cultureInfoData: CultureInfoData
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

        return (
          <AlignItemRight>
            <FormattedNumber
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              value={(sellingPrice + tax) / 100}
              style="currency"
              currency={cultureInfoData.currencyCode}
            />
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

          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
          const maxRestockFee = (sellingPrice + tax) * selectedQuantity

          const restockFeeChecked =
            restockFeeCents > maxRestockFee ? maxRestockFee : restockFeeCents

          updateChanges({ restockFee: restockFeeChecked, orderItemIndex })
        }

        return (
          <InputCurrency
            value={restockFee / 100}
            currencyCode={cultureInfoData.currencyCode}
            locale={cultureInfoData.locale}
            onChange={handleChange}
            readOnly={selectedQuantity === 0}
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

        return (
          <AlignItemRight>
            <FormattedNumber
              value={
                // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                ((sellingPrice + tax) * selectedQuantity - restockFee) / 100
              }
              style="currency"
              currency={cultureInfoData.currencyCode}
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
