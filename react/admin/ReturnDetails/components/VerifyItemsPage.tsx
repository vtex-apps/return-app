import type { ChangeEvent } from 'react'
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
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.approve" />
        </div>
      )}
      {actionStatus !== 'deny' ? null : (
        <div>
          <IconFailure size={14} />
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.deny" />
        </div>
      )}
      {actionStatus !== 'partially-approve' ? null : (
        <div>
          <IconWarning size={14} />
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.action.partially-approve" />
        </div>
      )}
    </>
  )
}

type RefundItemMap = Map<number, { quantity: number; restockFee: number }>

const verifyItemsTableSchema = (
  refundItemMap: RefundItemMap,
  updateChanges: (args: {
    orderItemIndex: number
    restockFee?: number
    quantity?: number
  }) => void
) => ({
  properties: {
    name: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.product" />
      ),
    },
    sellingPrice: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.price" />
      ),
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
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.tax" />
      ),
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
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.total" />
      ),
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax } = rowData

        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={(sellingPrice + tax) / 100} />
      },
    },
    quantity: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.quantity" />
      ),
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
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.verified" />
      ),
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
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
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const restockFee = refundItem?.restockFee ?? 0
        const selectedQuantity = refundItem?.quantity ?? 0

        const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
          const { value } = event.target
          const restockFeeInput = Number(value)

          if (Number.isNaN(restockFeeInput)) return

          const restockFeeCents = parseFloat((restockFeeInput * 100).toFixed(0))

          if (restockFeeCents > (sellingPrice + tax) * selectedQuantity) return

          updateChanges({ restockFee: restockFeeCents, orderItemIndex })
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
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ rowData }: { rowData: ReturnRequestItem }) => {
        const { sellingPrice, tax, orderItemIndex } = rowData

        const refundItem = refundItemMap.get(orderItemIndex)
        const selectedQuantity = refundItem?.quantity ?? 0
        const restockFee = refundItem?.restockFee ?? 0

        // TODO: Refactor this with right currency symbol and locale
        return (
          <FormattedCurrency
            value={((sellingPrice + tax) * selectedQuantity - restockFee) / 100}
          />
        )
      },
    },
    action: {
      title: (
        <FormattedMessage id="admin/return-app.return-request-details.verify-items.table.header.action" />
      ),
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
  const [refundItemsInput, setRefundItemsInput] = useState<RefundItemMap>(
    new Map()
  )

  const { items = [] } = data?.returnRequestDetails ?? {}

  const handleChanges = ({
    orderItemIndex,
    restockFee,
    quantity,
  }: {
    orderItemIndex: number
    restockFee?: number
    quantity?: number
  }) => {
    const updatedRefundItemMap = new Map(refundItemsInput)
    const item = updatedRefundItemMap.get(orderItemIndex)
    const itemQuantity = quantity ?? item?.quantity ?? 0
    const itemRestockFee = restockFee ?? item?.restockFee ?? 0

    updatedRefundItemMap.set(orderItemIndex, {
      quantity: itemQuantity,
      restockFee: itemQuantity === 0 ? 0 : itemRestockFee,
    })

    setRefundItemsInput(updatedRefundItemMap)
  }

  return (
    <>
      <section>
        <h2>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.title" />
        </h2>
        <Table
          fullWidth
          schema={verifyItemsTableSchema(refundItemsInput, handleChanges)}
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
