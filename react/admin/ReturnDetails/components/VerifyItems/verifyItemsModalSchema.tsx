import React from 'react'
import { FormattedMessage, FormattedNumber } from 'react-intl'

import type {
  ReturnRequestItem,
  CultureInfoData,
} from '../../../../../typings/ReturnRequest'
import type { RefundItemMap } from './VerifyItemsPage'
import { AlignItemRight } from '../AlignItemRight'
import { ProductActionStatus } from './ProductActionStatus'

export const verifyItemsModalSchema = (
  refundItemMap: RefundItemMap,
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
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.quantity" />
      ),
      width: 80,
      cellRenderer: function QuantityHeader({
        rowData,
      }: {
        rowData: ReturnRequestItem
        // cellData: ReturnRequestItem['quantity']
      }) {
        const { orderItemIndex } = rowData
        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        return (
          <span className="w-100 flex justify-center">{selectedQuantity}</span>
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
