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

const totalsSchema = (
  handleShippingChanges: (shippingToRefundInput: number) => void
) => ({
  properties: {
    refundableShipping: {
      title: 'Refundable Shipping',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    shippingToRefund: {
      title: 'Total Shipping to refund',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({
        cellData,
        rowData,
      }: {
        cellData: number
        rowData: { refundableShipping: number }
      }) => {
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
          <InputCurrency
            value={cellData / 100}
            currencyCode="EUR"
            locale="es-ES"
            onChange={handleChange}
          />
        )
      },
    },
    totalRefundItems: {
      title: 'Total Products',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
      },
    },
    totalRefund: {
      title: 'Refund Total',
      // eslint-disable-next-line react/display-name
      cellRenderer: ({ cellData }: { cellData: number }) => {
        // TODO: Refactor this with right currency symbol and locale
        return <FormattedCurrency value={cellData / 100} />
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

  const [shippingToRefund, setShippingToRefund] = useState(0)

  const { items = [], refundableAmountTotals = [] } =
    data?.returnRequestDetails ?? {}

  const handleItemChanges = ({
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

  const handleShippingChanges = (shippingToRefundInput: number) => {
    setShippingToRefund(shippingToRefundInput)
  }

  const refundableShipping =
    refundableAmountTotals.find(({ id }) => id === 'shipping')?.value ?? 0

  const totalRefundItems = items.reduce((total, item) => {
    const { orderItemIndex, sellingPrice, tax } = item
    const returningItem = refundItemsInput.get(orderItemIndex)
    const { quantity = 0, restockFee = 0 } = returningItem ?? {}
    const itemTotal = (sellingPrice + tax) * quantity - restockFee

    return total + itemTotal
  }, 0)

  return (
    <>
      <section>
        <h2>
          <FormattedMessage id="admin/return-app.return-request-details.verify-items.title" />
        </h2>
        <div>
          <h3>Items</h3>
          <Table
            fullWidth
            schema={verifyItemsTableSchema(refundItemsInput, handleItemChanges)}
            items={items}
          />
        </div>
        <div>
          <h3>Totals</h3>
          <Table
            fullWidth
            schema={totalsSchema(handleShippingChanges)}
            items={[
              {
                refundableShipping,
                shippingToRefund,
                totalRefundItems,
                totalRefund: shippingToRefund + totalRefundItems,
              },
            ]}
          />
        </div>
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
