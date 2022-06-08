import React, { useState } from 'react'
import {
  Table,
  FloatingActionBar,
  InputCurrency,
  NumericStepper,
  IconSuccess,
  IconFailure,
  IconWarning,
} from 'vtex.styleguide'
import { FormattedMessage } from 'react-intl'
import type { ReturnRequestItem } from 'vtex.return-app'
import { FormattedCurrency } from 'vtex.format-currency'

import { useReturnDetails } from '../../hooks/useReturnDetails'

type ActionStatus = 'deny' | 'approve' | 'partially-approve'

const getActionStatus = ({
  quantity,
  selectedQuantity,
}: {
  quantity: number
  selectedQuantity: number
}): ActionStatus =>
  selectedQuantity === 0
    ? 'deny'
    : selectedQuantity === quantity
    ? 'approve'
    : 'partially-approve'

const ProductActionStatus = ({
  actionStatus,
}: {
  actionStatus: ActionStatus
}) => {
  return (
    <>
      {actionStatus !== 'approve' ? null : (
        <div>
          <IconSuccess size={14} />
          <p>Approve</p>
        </div>
      )}
      {actionStatus !== 'deny' ? null : (
        <div>
          <IconFailure size={14} />
          <p>Deny</p>
        </div>
      )}
      {actionStatus !== 'partially-approve' ? null : (
        <div>
          <IconWarning size={14} />
          <p>Partially approve</p>
        </div>
      )}
    </>
  )
}

type RefundItemMap = Map<number, { quantity: number; restockFee: number }>

const verifyItemsTableSchema = (refundItemMap: RefundItemMap) => ({
  properties: {
    name: {
      title: 'Product',
    },
    sellingPrice: {
      title: 'Price',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['sellingPrice']
      }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    tax: {
      title: 'unitTax',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['tax']
      }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    totalPrice: {
      title: 'Total',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={(sellingPrice + tax) / 100} />
      },
    },
    quantity: {
      title: 'Quantity',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
      }: {
        rowData: ReturnRequestItem
        cellData: ReturnRequestItem['quantity']
      }) => {
        return cellData
      },
    },
    verified: {
      title: 'Verified',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { quantity } = rowData

        return <NumericStepper maxValue={quantity} />
      },
    },
    restockFee: {
      title: 'Restock Fee',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return (
          <InputCurrency
            value={100}
            currencyCode="EUR"
            locale="es-ES"
            max={(sellingPrice + tax) / 100}
          />
        )
      },
    },
    totalRefund: {
      title: 'Total',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        // TODO: Refactor this with right currency symbol and locale
        return (
          <FormattedCurrency
            value={((sellingPrice + tax) * selectedQuantity) / 100}
          />
        )
      },
    },
    action: {
      title: 'Action',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { quantity, orderItemIndex } = rowData

        const selectedQuantity =
          refundItemMap.get(orderItemIndex)?.quantity ?? 0

        const actionStatus = getActionStatus({ quantity, selectedQuantity })

        return <ProductActionStatus actionStatus={actionStatus} />
      },
    },
  },
})

interface Props {
  onViewVerifyItems: () => void
}

export const VerifyItemsPage = ({ onViewVerifyItems }: Props) => {
  const { submitting, data } = useReturnDetails()
  const [refundItemsInput] = useState<RefundItemMap>(new Map())

  const { items = [] } = data?.returnRequestDetails ?? {}

  return (
    <>
      <section>
        <h2>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.title" />
        </h2>
        <Table
          fullWidth
          schema={verifyItemsTableSchema(refundItemsInput)}
          items={items}
        />
      </section>
      <FloatingActionBar
        save={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.confirm" />
          ),
          isLoading: submitting,
          onClick: () => {},
        }}
        cancel={{
          label: (
            <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.cancel" />
          ),
          onClick: onViewVerifyItems,
        }}
      />
    </>
  )
}
